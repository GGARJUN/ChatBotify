'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditBotDialog({ bot, open, onOpenChange, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bot && open) {
      setFormData({
        name: bot.name || '',
        description: bot.description || '',
        status: bot.status || 'ACTIVE',
      });
    }
  }, [bot, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Bot name is required');
      return;
    }
    setIsLoading(true);
    console.log('Submitting bot update:', formData); // Debug log
    try {
      await onUpdate(bot.id, formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bot: {bot?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Enter bot name"
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter bot description"
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="status" className="mb-1">
                Status
              </Label>
              <Select value={formData.status} onValueChange={handleSelectChange} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}