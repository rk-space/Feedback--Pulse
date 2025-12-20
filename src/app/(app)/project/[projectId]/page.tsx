'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { FeedbackTable } from '@/components/feedback/feedback-table';
import { FeedbackWidgetButton } from '@/components/feedback/feedback-widget-button';
import { EmbedSnippet } from '@/components/dashboard/embed-snippet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppContext } from '@/context/app-provider';

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = use(params);
  const { projects, feedback } = useAppContext();

  const project = projects.find((p) => p.id === resolvedParams.projectId);
  const projectFeedback = feedback.filter((f) => f.projectId === resolvedParams.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">Manage feedback for this project.</p>
        </div>
        <FeedbackWidgetButton 
            projectId={project.id} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Embed Widget</CardTitle>
          <CardDescription>
            Place this script on your website to start collecting feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmbedSnippet projectKey={project.projectKey} />
        </CardContent>
      </Card>

      <FeedbackTable initialFeedback={projectFeedback} />
    </div>
  );
}
