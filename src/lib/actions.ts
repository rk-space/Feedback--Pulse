'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { analyzeFeedbackSentiment } from '@/ai/flows/analyze-feedback-sentiment';
import { projectSchema, feedbackSchema, labelSchema } from '@/lib/schemas';
import type { Project, Feedback } from './definitions';

// In a real app, these would be database operations.
// For this demo, we are just returning the data.
const tempProjects: Project[] = [];
const tempFeedback: Feedback[] = [];

type CreateProjectState = {
  message?: string | null;
  errors?: {
    name?: string[];
  } | null;
  project?: Project | null;
}

export async function createProject(prevState: CreateProjectState | null, formData: FormData): Promise<CreateProjectState> {
  const validatedFields = projectSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
      project: null,
    };
  }

  const { name } = validatedFields.data;
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name,
    createdAt: new Date(),
    projectKey: `pk_${crypto.randomUUID()}`,
  };

  // This is a temporary in-memory store.
  tempProjects.unshift(newProject);
  
  revalidatePath('/dashboard');
  
  return {
    message: `Project "${name}" created successfully.`,
    errors: null,
    project: newProject,
  };
}

type SubmitFeedbackState = {
    message: string;
    errors?: {
        type?: string[];
        comment?: string[];
        projectId?: string[];
    } | null;
    feedback?: Feedback;
};

export async function submitFeedback(prevState: SubmitFeedbackState | null, formData: FormData): Promise<SubmitFeedbackState> {
    const validatedFields = feedbackSchema.safeParse({
      type: formData.get('type'),
      comment: formData.get('comment'),
      projectId: formData.get('projectId'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Submit Feedback.',
      };
    }
    
    const { type, comment, projectId } = validatedFields.data;
  
    const newFeedback: Feedback = {
      id: `fb_${Date.now()}`,
      projectId,
      type,
      comment,
      createdAt: new Date(),
      labels: [],
      sentiment: null,
    };
  
    tempFeedback.unshift(newFeedback);
    
    revalidatePath(`/project/${projectId}`);
  
    return {
      message: 'Feedback submitted successfully!',
      errors: null,
      feedback: newFeedback,
    };
  }

export async function getSentimentAnalysis(feedbackId: string, text: string) {
  try {
    const result = await analyzeFeedbackSentiment({ feedbackText: text });
    return { sentiment: result.sentiment };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return { error: 'Failed to analyze sentiment.' };
  }
}

type AddLabelState = { message: string };

export async function addLabelToFeedback(prevState: AddLabelState, formData: FormData): Promise<AddLabelState> {
    const validatedFields = labelSchema.safeParse({
        label: formData.get('label'),
        feedbackId: formData.get('feedbackId'),
    });

    if (!validatedFields.success) {
        return { message: 'Invalid label.' };
    }
    
    const { label, feedbackId } = validatedFields.data;

    // In a real app, you would update the feedback item in your database.
    const feedbackItem = tempFeedback.find(f => f.id === feedbackId);
    if (feedbackItem && !feedbackItem.labels.includes(label)) {
        feedbackItem.labels.push(label);
    }
    
    revalidatePath(`/project/`);

    return { message: `Added label "${label}"` };
}
