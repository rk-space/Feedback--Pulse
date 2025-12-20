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
          <Link href={`/project/${project.id}`}>View Feedback</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
