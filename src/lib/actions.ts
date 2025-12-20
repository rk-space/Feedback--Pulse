'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { analyzeFeedbackSentiment } from '@/ai/flows/analyze-feedback-sentiment';
import { projectSchema, feedbackSchema, labelSchema } from '@/lib/schemas';
import { projects, feedback as feedbackData } from '@/lib/data';
import type { Project, Feedback } from './definitions';

export async function createProject(prevState: any, formData: FormData) {
  const validatedFields = projectSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
      project: null,
      resetKey: Date.now().toString(),
    };
  }

  const { name } = validatedFields.data;
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name,
    createdAt: new Date(),
    projectKey: `pk_${crypto.randomUUID()}`,
  };

  // This adds the project to the in-memory array.
  // NOTE: In a real application, this would be a database call.
  // This data will be lost on server restart.
  projects.unshift(newProject);
  
  revalidatePath('/dashboard');
  
  return {
    message: `Project "${name}" created successfully.`,
    errors: null,
    project: newProject,
    resetKey: Date.now().toString(),
  };
}

const feedbackSubmitSchema = feedbackSchema.extend({
    projectData: z.string().optional(),
});

export async function submitFeedback(prevState: any, formData: FormData) {
    const validatedFields = feedbackSubmitSchema.safeParse({
      type: formData.get('type'),
      comment: formData.get('comment'),
      projectId: formData.get('projectId'),
      projectData: formData.get('projectData'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Submit Feedback.',
        resetKey: Date.now().toString(),
      };
    }
    
    const { type, comment, projectId, projectData } = validatedFields.data;
  
    const newFeedback: Feedback = {
      id: `fb_${Date.now()}`,
      projectId,
      type,
      comment,
      createdAt: new Date(),
      labels: [],
      sentiment: null,
    };
  
    feedbackData.unshift(newFeedback);
    
    // If projectData is passed, it means we are on a "new" project page.
    // We need to revalidate with the project query param.
    const revalidationPath = projectData
      ? `/project/${projectId}?project=${encodeURIComponent(projectData)}`
      : `/project/${projectId}`;

    revalidatePath(revalidationPath);
  
    return {
      message: 'Feedback submitted successfully!',
      errors: null,
      feedback: newFeedback,
      resetKey: Date.now().toString(),
    };
  }

export async function getSentimentAnalysis(feedbackId: string, text: string) {
  try {
    const result = await analyzeFeedbackSentiment({ feedbackText: text });
    
    const feedbackItem = feedbackData.find(f => f.id === feedbackId);
    if (feedbackItem) {
      feedbackItem.sentiment = result.sentiment as 'positive' | 'negative' | 'neutral';
      revalidatePath(`/project/${feedbackItem.projectId}`);
      return { sentiment: result.sentiment };
    }
    return { error: 'Feedback not found' };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return { error: 'Failed to analyze sentiment.' };
  }
}

export async function addLabelToFeedback(prevState: any, formData: FormData) {
    const validatedFields = labelSchema.safeParse({
        label: formData.get('label'),
        feedbackId: formData.get('feedbackId'),
    });

    if (!validatedFields.success) {
        return { message: 'Invalid label.' };
    }
    
    const { label, feedbackId } = validatedFields.data;
    const feedbackItem = feedbackData.find(f => f.id === feedbackId);

    if (feedbackItem && !feedbackItem.labels.includes(label)) {
        feedbackItem.labels.push(label);
        revalidatePath(`/project/${feedbackItem.projectId}`);
        return { message: `Added label "${label}"` };
    }

    return { message: 'Failed to add label.' };
}
