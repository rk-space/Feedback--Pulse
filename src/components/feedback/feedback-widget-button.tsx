'use client';

import { useState, useTransition } from 'react';
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
import { useAppContext } from '@/context/app-provider';

export function FeedbackWidgetButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { addFeedback } = useAppContext();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'feature',
      comment: '',
      projectId: projectId,
    },
  });
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = (values: z.infer<typeof feedbackSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('type', values.type);
      formData.append('comment', values.comment);
      formData.append('projectId', values.projectId);

      const result = await submitFeedback(null, formData);

      if (result.errors) {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      } else if (result.feedback) {
        toast({ title: 'Success', description: result.message });
        addFeedback(result.feedback);
        setOpen(false);
        form.reset();
      }
    });
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
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
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
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
