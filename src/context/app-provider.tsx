
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Project, Feedback } from '@/lib/definitions';

interface AppContextType {
  projects: Project[];
  feedback: Feedback[];
  addProject: (project: Project) => void;
  addFeedback: (feedbackItem: Feedback) => void;
  updateFeedback: (feedbackId: string, updates: Partial<Feedback>) => void;
  updateLabel: (feedbackId: string, label: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ 
    children, 
    initialProjects, 
    initialFeedback 
}: { 
    children: ReactNode,
    initialProjects: Project[],
    initialFeedback: Feedback[] 
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const addFeedback = (feedbackItem: Feedback) => {
    setFeedback((prev) => [feedbackItem, ...prev]);
  };

  const updateFeedback = (feedbackId: string, updates: Partial<Feedback>) => {
    setFeedback((prev) => 
      prev.map((f) => (f.id === feedbackId ? { ...f, ...updates } : f))
    );
  };
  
  const updateLabel = (feedbackId: string, label: string) => {
    setFeedback((prev) =>
      prev.map((f) =>
        f.id === feedbackId && !f.labels.includes(label)
          ? { ...f, labels: [...f.labels, label] }
          : f
      )
    );
  };

  return (
    <AppContext.Provider value={{ projects, feedback, addProject, addFeedback, updateFeedback, updateLabel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
