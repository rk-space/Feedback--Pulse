'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { labelSchema } from '@/lib/schemas';
import { addLabelToFeedback } from '@/lib/actions';

const initialState = { message: '' };

export function AddLabelPopover({ feedbackId }: { feedbackId: string }) {
  const [state, formAction] = useActionState(addLabelToFeedback, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useForm<z.infer<typeof labelSchema>>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      label: '',
      feedbackId: feedbackId,
    },
  });

  useEffect(() => {
    if (state?.message) {
        form.reset({ label: '', feedbackId });
    }
  }, [state, form, feedbackId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <Form {...form}>
            <form 
                ref={formRef}
                action={formAction}
                onSubmit={form.handleSubmit(() => formRef.current?.requestSubmit())}
                className="flex gap-2"
            >
                <input type="hidden" name="feedbackId" value={feedbackId} />
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input placeholder="New label..." className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>Add</Button>
            </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
