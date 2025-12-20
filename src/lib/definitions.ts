export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  projectKey: string;
};

export type FeedbackType = 'bug' | 'feature' | 'other';
export type Sentiment = 'positive' | 'negative' | 'neutral' | null;

export type Feedback = {
  id: string;
  projectId: string;
  type: FeedbackType;
  comment: string;
  createdAt: Date;
  labels: string[];
  sentiment: Sentiment;
};
