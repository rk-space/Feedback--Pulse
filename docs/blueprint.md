# **App Name**: PulseTrack

## Core Features:

- Email/Password Authentication: Secure user registration and login via email and password.
- Project Creation and Management: Users can create and manage multiple projects, each with a unique ID, name, creation date, and auto-generated project key.
- Embeddable Feedback Widget: A small JavaScript widget served by the backend that can be embedded on any website to collect user feedback. Requires proper CORS configuration.
- Admin Dashboard: A Next.js-powered admin dashboard with a list of projects and the ability to view feedback per project.
- Feedback Filtering and Labeling: The admin dashboard includes filters to sort feedback by type (All/Bug/Feature/Other) and the ability to add labels to feedback entries.
- Sentiment Analysis: An "Analyze Sentiment" button calls an external AI API to determine the sentiment (positive/neutral/negative) of a feedback entry, and displays a sentiment badge.
- Feedback Submission: Collect and submit feedback via an embeddable javascript widget.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey trust and reliability, reflecting the platform's function of handling user feedback.
- Background color: Very light Indigo (#E8EAF6), creating a calm and professional atmosphere.
- Accent color: Electric Blue (#7DF9FF), used sparingly to draw attention to key interactive elements without overwhelming the user.
- Body and headline font: 'Inter', a sans-serif font, is used to maintain a clear, modern and neutral design.
- Simple, outlined icons to represent feedback types and project actions.
- Clean, card-based layout for project and feedback listings, ensuring information is easily digestible.
- Subtle transitions and animations on form submissions and data updates to enhance user experience.