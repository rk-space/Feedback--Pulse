'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquarePlus } from 'lucide-react';
import { feedbackSchema } from '@/lib/schemas';
import { submitFeedback } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Feedback } from '@/lib/definitions';
import { useAppContext } from '@/context/app-provider';

type SubmitFeedbackState = {
    message: string;
    errors?: {
        type?: string[];
        comment?: string[];
        projectId?: string[];
    } | null;
    feedback?: Feedback;
};

const initialState: SubmitFeedbackState = {
    message: '',
    errors: null,
};

export function FeedbackWidgetButton({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(submitFeedback, initialState);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const { addFeedback } = useAppContext();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'feature',
      comment: '',
      projectId: projectId,
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else if (state.feedback) {
        toast({ title: 'Success', description: state.message });
        addFeedback(state.feedback);
        setOpen(false);
        form.reset();
      }
    }
  }, [state, toast, form, addFeedback]);


  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
      // Reset action state if dialog is closed
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Test Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
          <DialogDescription>
            Let us know what you think. Your feedback is valuable!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form 
                ref={formRef}
                action={formAction}
                className="space-y-4"
                onSubmit={form.handleSubmit(() => formRef.current?.requestSubmit())}
            >
                <input type="hidden" {...form.register('projectId')} value={projectId} />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>What kind of feedback is this?</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            name={field.name}
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="bug" />
                                </FormControl>
                                <FormLabel className="font-normal">🐞 Bug Report</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="feature" />
                                </FormControl>
                                <FormLabel className="font-normal">💡 Feature Request</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">💬 Other</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Your Comment</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Tell us more about your experience..."
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Submit Feedback
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
