'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components/dashboard/project-card';
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog';
import { projects as initialProjects } from '@/lib/data';
import type { Project } from '@/lib/definitions';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your projects.</p>
        </div>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
