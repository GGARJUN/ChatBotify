'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { useRef } from 'react';

export default function TestBotDialog({
  open,
  onOpenChange,
  botId,
  botName,
  onCopy,
}) {
  const scriptTag = `<script src="http://localhost:3000/inject.js" data-project-id="${botId}"></script>`;
  const inputRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag);
      toast.success('Script tag copied to clipboard!');
      onCopy(); // Trigger callback to open Widget and close dialog
    } catch (error) {
      console.error('Failed to copy script tag:', error);
      toast.error('Failed to copy script tag');
    }
  };

  const handleClose = () => {
    onCopy(); // Trigger callback to open Widget and close dialog
    onOpenChange(false); // Explicitly close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Test {botName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Copy this script tag to test your bot:</p>
          <div className="flex items-center">
            <Textarea
              ref={inputRef}
              value={scriptTag}
              readOnly
              className="flex-1 bg-gray-100 text-sm font-mono min-h-[60px]"
            />
            <Button
              onClick={handleCopy}
              className="ml-2"
              variant="outline"
              size="icon"
              aria-label="Copy script tag"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}