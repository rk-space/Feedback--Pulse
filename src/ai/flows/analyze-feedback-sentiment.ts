'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of user feedback.
 *
 * analyzeFeedbackSentiment - A function that takes feedback text as input and returns the sentiment analysis result.
 * AnalyzeFeedbackSentimentInput - The input type for the analyzeFeedbackSentiment function.
 * AnalyzeFeedbackSentimentOutput - The return type for the analyzeFeedbackSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFeedbackSentimentInputSchema = z.object({
  feedbackText: z
    .string()
    .describe('The text content of the feedback to be analyzed.'),
});
export type AnalyzeFeedbackSentimentInput = z.infer<
  typeof AnalyzeFeedbackSentimentInputSchema
>;

const AnalyzeFeedbackSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the feedback text (positive, neutral, or negative).'
    ),
});
export type AnalyzeFeedbackSentimentOutput = z.infer<
  typeof AnalyzeFeedbackSentimentOutputSchema
>;

export async function analyzeFeedbackSentiment(
  input: AnalyzeFeedbackSentimentInput
): Promise<AnalyzeFeedbackSentimentOutput> {
  return analyzeFeedbackSentimentFlow(input);
}

const analyzeFeedbackSentimentPrompt = ai.definePrompt({
  name: 'analyzeFeedbackSentimentPrompt',
  input: {schema: AnalyzeFeedbackSentimentInputSchema},
  output: {schema: AnalyzeFeedbackSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following feedback text.  Return 'positive', 'negative', or 'neutral'.

Feedback Text: {{{feedbackText}}}`,
});

const analyzeFeedbackSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeFeedbackSentimentFlow',
    inputSchema: AnalyzeFeedbackSentimentInputSchema,
    outputSchema: AnalyzeFeedbackSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeFeedbackSentimentPrompt(input);
    return output!;
  }
);
