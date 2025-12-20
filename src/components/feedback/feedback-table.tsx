'use client';

import { useState, useTransition, useMemo } from 'react';
import { format } from 'date-fns';
import type { Feedback, FeedbackType, Sentiment } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { getSentimentAnalysis } from '@/lib/actions';
import { SentimentBadge } from './sentiment-badge';
import { AddLabelPopover } from './add-label-popover';
import { useAppContext } from '@/context/app-provider';

const typeIcons = {
  bug: '🐞',
  feature: '💡',
  other: '💬',
};

export function FeedbackTable({ initialFeedback }: { initialFeedback: Feedback[] }) {
  const { updateFeedback, updateLabel } = useAppContext();
  const [filter, setFilter] = useState<FeedbackType | 'all'>('all');
  const [isPending, startTransition] = useTransition();
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const filteredFeedback = useMemo(() => {
    if (filter === 'all') {
      return initialFeedback;
    }
    return initialFeedback.filter((f) => f.type === filter);
  }, [filter, initialFeedback]);

  const handleAnalyzeSentiment = (feedbackId: string, comment: string) => {
    setAnalyzingId(feedbackId);
    startTransition(async () => {
      const result = await getSentimentAnalysis(feedbackId, comment);
      if (result.sentiment) {
        updateFeedback(feedbackId, { sentiment: result.sentiment as Sentiment });
      }
      setAnalyzingId(null);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>Feedback Submissions</CardTitle>
                <CardDescription>View and manage all feedback for this project.</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="bug">Bug</TabsTrigger>
                <TabsTrigger value="feature">Feature</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feedback</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-sm">
                    <p className="truncate">{item.comment}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {typeIcons[item.type]} {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {item.labels.map((label) => (
                            <Badge key={label} variant="outline">{label}</Badge>
                        ))}
                        <AddLabelPopover feedbackId={item.id} onLabelAdded={(label) => updateLabel(item.id, label)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.sentiment ? (
                      <SentimentBadge sentiment={item.sentiment} />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending && analyzingId === item.id}
                        onClick={() => handleAnalyzeSentiment(item.id, item.comment)}
                        style={{'--accent-color': 'hsl(183 100% 75%)'} as React.CSSProperties}
                        className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-primary"
                      >
                        {isPending && analyzingId === item.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Analyze
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(item.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No feedback of this type yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
