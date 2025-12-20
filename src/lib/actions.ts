'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { analyzeFeedbackSentiment } from '@/ai/flows/analyze-feedback-sentiment';
import { projectSchema, feedbackSchema, labelSchema } from '@/lib/schemas';
import { projects, feedback } from '@/lib/data';
import type { Project } from './definitions';

export async function createProject(prevState: any, formData: FormData) {
  const validatedFields = projectSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
    };
  }

  const { name } = validatedFields.data;
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name,
    createdAt: new Date(),
    projectKey: `pk_${crypto.randomUUID()}`,
  };

  // Note: In a real app, this would be a database call.
  projects.unshift(newProject);
  revalidatePath('/dashboard');

  return {
    message: `Project "${name}" created successfully.`,
    errors: null,
    project: newProject,
    resetKey: Date.now().toString(),
  };
}

export async function submitFeedback(prevState: any, formData: FormData) {
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

  const newFeedback = {
    id: `fb_${Date.now()}`,
    projectId,
    type,
    comment,
    createdAt: new Date(),
    labels: [],
    sentiment: null,
  };

  feedback.unshift(newFeedback);
  revalidatePath(`/project/${projectId}`);

  return {
    message: 'Feedback submitted successfully!',
    errors: {},
    resetKey: Date.now().toString(),
  };
}

export async function getSentimentAnalysis(feedbackId: string, text: string) {
  try {
    const result = await analyzeFeedbackSentiment({ feedbackText: text });
    
    const feedbackItem = feedback.find(f => f.id === feedbackId);
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
    const feedbackItem = feedback.find(f => f.id === feedbackId);

    if (feedbackItem && !feedbackItem.labels.includes(label)) {
        feedbackItem.labels.push(label);
        revalidatePath(`/project/${feedbackItem.projectId}`);
        return { message: `Added label "${label}"` };
    }

    return { message: 'Failed to add label.' };
}
