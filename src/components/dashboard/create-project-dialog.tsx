'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { projectSchema } from '@/lib/schemas';
import { createProject } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/definitions';

type CreateProjectState = {
  message: string;
  errors?: { name?: string[] } | null;
  project?: Project;
  resetKey?: string;
};

const initialState: CreateProjectState = {
  message: '',
  errors: null,
};

export function CreateProjectDialog({ onProjectCreated }: { onProjectCreated: (project: Project) => void }) {
  const [state, formAction] = useActionState(createProject, initialState);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const lastResetKey = useRef<string | undefined>(undefined);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '' },
  });
  
  useEffect(() => {
    if (state.resetKey && state.resetKey !== lastResetKey.current) {
        lastResetKey.current = state.resetKey;
        if (state.errors) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        } else if (state.project) {
            toast({ title: 'Success', description: state.message });
            onProjectCreated(state.project);
            setOpen(false);
            form.reset();
        }
    }
  }, [state, toast, form, onProjectCreated]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Give your new project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {state.errors?.name && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.name[0]}
              </p>
            )}
             <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    Create Project
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
