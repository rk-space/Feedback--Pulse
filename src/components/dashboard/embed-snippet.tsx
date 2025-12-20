'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function EmbedSnippet({ projectKey }: { projectKey: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const snippet = `<script src="https://your-domain.com/widget.js" data-project-key="${projectKey}" async defer></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    toast({
      title: 'Copied to clipboard!',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Embed Script</p>
      <div className="relative">
        <pre className="text-xs bg-muted p-3 pr-12 rounded-md overflow-x-auto">
          <code>{snippet}</code>
        </pre>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
