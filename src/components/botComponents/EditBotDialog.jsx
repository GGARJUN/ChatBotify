// app/dashboard/bots/EditBotDialog.tsx
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

export default function EditBotDialog({ bot, open, onOpenChange, onUpdate }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE',
    });

    // Update form data when bot prop changes
    useEffect(() => {
        if (bot) {
            setFormData({
                name: bot.name || '',
                description: bot.description || '',
                status: bot.status || 'ACTIVE',
            });
        }
    }, [bot]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const handleSubmit = () => {
        onUpdate(bot.id, formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Bot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="name">Bot Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}