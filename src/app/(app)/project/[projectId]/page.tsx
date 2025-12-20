import { projects, feedback as allFeedback } from '@/lib/data';
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
import type { Project } from '@/lib/definitions';

function getProject(projectId: string, projectQueryParam?: string): Project | undefined {
  if (projectQueryParam) {
    try {
      const p = JSON.parse(projectQueryParam);
      // Basic validation
      if (p.id === projectId && p.name && p.createdAt && p.projectKey) {
        return {
          ...p,
          createdAt: new Date(p.createdAt),
        };
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  return projects.find((p) => p.id === projectId);
}

export default function ProjectDetailsPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const project = getProject(params.projectId, searchParams.project as string | undefined);

  if (!project) {
    notFound();
  }

  const projectFeedback = allFeedback.filter(
    (f) => f.projectId === params.projectId
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">Manage feedback for this project.</p>
        </div>
        <FeedbackWidgetButton projectId={project.id} />
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
