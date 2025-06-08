


'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function BotForm({ onSubmit, loading, defaultClientId }) {
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (defaultClientId) {
      setFormData(prev => ({ ...prev, clientId: defaultClientId }));
    }
  }, [defaultClientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-[#1b0b3b]">
            Bot Name *
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium text-[#1b0b3b]">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#7856ff] hover:bg-[#5e3dff]"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : 'Create Bot'}
        </Button>
      </div>
    </form>
  );
}