'use client';

import { projects as initialProjects, feedback as allFeedback } from '@/lib/data';
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
import type { Project, Feedback } from '@/lib/definitions';
import { useState, use } from 'react';

function getProject(projectId: string, projectQueryParam?: string): Project | undefined {
  if (projectQueryParam) {
    try {
      // URL-decode the string before parsing
      const decodedParam = decodeURIComponent(projectQueryParam);
      const p = JSON.parse(decodedParam);
      if (p.id === projectId && p.name && p.createdAt && p.projectKey) {
        return {
          ...p,
          createdAt: new Date(p.createdAt),
        };
      }
    } catch (e) {
      console.error("Failed to parse project data from query param:", e);
    }
  }
  return initialProjects.find((p) => p.id === projectId);
}

export default function ProjectDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const projectQueryParam = resolvedSearchParams.project as string | undefined;

  const project = getProject(resolvedParams.projectId, projectQueryParam);
  
  const [feedback, setFeedback] = useState<Feedback[]>(() => 
    allFeedback.filter((f) => f.projectId === resolvedParams.projectId)
  );

  const handleFeedbackSubmitted = (newFeedback: Feedback) => {
    setFeedback((prevFeedback) => [newFeedback, ...prevFeedback]);
  };

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
            onFeedbackSubmitted={handleFeedbackSubmitted} 
            projectData={projectQueryParam}
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

      <FeedbackTable initialFeedback={feedback} />
    </div>
  );
}
