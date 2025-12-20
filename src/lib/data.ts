import type { Project, Feedback } from '@/lib/definitions';

export const projects: Project[] = [
  {
    id: 'proj_1',
    name: 'PulseTrack App',
    createdAt: new Date('2023-10-26T10:00:00Z'),
    projectKey: 'pk_live_xxxxxxxxxxxx1',
  },
  {
    id: 'proj_2',
    name: 'E-commerce Website',
    createdAt: new Date('2023-11-15T14:30:00Z'),
    projectKey: 'pk_live_xxxxxxxxxxxx2',
  },
];

export const feedback: Feedback[] = [
  {
    id: 'fb_1',
    projectId: 'proj_1',
    type: 'feature',
    comment: 'It would be great to have a dark mode for the dashboard. My eyes would appreciate it!',
    createdAt: new Date('2023-10-27T11:00:00Z'),
    labels: ['ui', 'dark-mode'],
    sentiment: 'positive',
  },
  {
    id: 'fb_2',
    projectId: 'proj_1',
    type: 'bug',
    comment: "The 'Create Project' button doesn't work on Firefox. Nothing happens when I click it.",
    createdAt: new Date('2023-10-28T09:20:00Z'),
    labels: ['bug', 'firefox'],
    sentiment: 'negative',
  },
  {
    id: 'fb_3',
    projectId: 'proj_2',
    type: 'other',
    comment: 'The checkout process is very smooth and easy to understand. Good job!',
    createdAt: new Date('2023-11-20T18:05:00Z'),
    labels: ['checkout', 'ux'],
    sentiment: 'positive',
  },
  {
    id: 'fb_4',
    projectId: 'proj_1',
    type: 'feature',
    comment: 'Can we get email notifications when new feedback is submitted?',
    createdAt: new Date('2023-10-29T16:45:00Z'),
    labels: ['notifications'],
    sentiment: 'neutral',
  },
  {
    id: 'fb_5',
    projectId: 'proj_2',
    type: 'bug',
    comment: "Product images are not loading on the main page. I just see spinners.",
    createdAt: new Date('2023-11-21T12:00:00Z'),
    labels: [],
    sentiment: null,
  },
];
