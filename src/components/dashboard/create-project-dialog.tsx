'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
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

const initialState = {
  message: '',
  errors: {},
  resetKey: '',
};

export function CreateProjectDialog() {
  const [state, formAction] = useFormState(createProject, initialState);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({ title: 'Success', description: state.message });
      setOpen(false);
      form.reset();
    } else if (state.message && state.errors) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            onSubmit={form.handleSubmit(() => formRef.current?.submit())}
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
