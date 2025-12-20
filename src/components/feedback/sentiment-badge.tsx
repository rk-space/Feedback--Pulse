import { Badge } from '@/components/ui/badge';
import type { Sentiment } from '@/lib/definitions';
import { Smile, Frown, Meh } from 'lucide-react';

const sentimentConfig = {
  positive: {
    label: 'Positive',
    icon: Smile,
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  },
  negative: {
    label: 'Negative',
    icon: Frown,
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  },
  neutral: {
    label: 'Neutral',
    icon: Meh,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  },
};

export function SentimentBadge({ sentiment }: { sentiment: NonNullable<Sentiment> }) {
    if (!sentiment) return null;

    const config = sentimentConfig[sentiment];
    const Icon = config.icon;

    return (
        <Badge variant="outline" className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
        </Badge>
    );
}
