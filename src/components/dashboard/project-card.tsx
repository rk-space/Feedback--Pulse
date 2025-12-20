import Link from 'next/link';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmbedSnippet } from '@/components/dashboard/embed-snippet';
import type { Project } from '@/lib/definitions';
import { feedback } from '@/lib/data';

export function ProjectCard({ project }: { project: Project }) {
  const feedbackCount = feedback.filter(f => f.projectId === project.id).length;
  // A project is considered "new" if it was created just now and doesn't exist in the original hardcoded data.
  // We can check this by seeing if its creation date doesn't match the predefined ones.
  const isNew = !['2023-10-26T10:00:00.000Z', '2023-11-15T14:30:00.000Z'].includes(project.createdAt.toISOString());

  const projectData = {
    id: project.id,
    name: project.name,
    createdAt: project.createdAt.toISOString(),
    projectKey: project.projectKey,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{project.name}</CardTitle>
        <CardDescription>
          Created on {format(project.createdAt, 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{feedbackCount}</span> total feedback submissions.
        </div>
        <EmbedSnippet projectKey={project.projectKey} />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link 
            href={{
              pathname: `/project/${project.id}`,
              query: isNew ? { project: JSON.stringify(projectData) } : {},
            }}
          >
            View Feedback
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
