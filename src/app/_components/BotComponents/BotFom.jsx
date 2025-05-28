'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BotForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    description: '',
    status: 'ACTIVE',
    billing: {
      billingType: 'MONTHLY',
      priceInCents: 2999,
      billingStartDate: new Date().toISOString(),
      billingEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      isBillingActive: true,
      stripeSubscriptionId: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: value,
      },
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: date ? date.toISOString() : '',
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="clientId" className="text-sm font-medium text-[#1b0b3b]">
            Client ID
          </Label>
          <Input
            type="text"
            name="clientId"
            id="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="name" className="text-sm font-medium text-[#1b0b3b]">
            Bot Name
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
            required
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
          />
        </div>

        <div>
          <Label htmlFor="status" className="text-sm font-medium text-[#1b0b3b]">
            Status
          </Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="billingType" className="text-sm font-medium text-[#1b0b3b]">
            Billing Type
          </Label>
          <Select
            value={formData.billing.billingType}
            onValueChange={(value) => handleBillingSelectChange('billingType', value)}
          >
            <SelectTrigger className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
              <SelectItem value="ONE_TIME">One Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priceInCents" className="text-sm font-medium text-[#1b0b3b]">
            Price (in cents)
          </Label>
          <Input
            type="number"
            name="priceInCents"
            id="priceInCents"
            value={formData.billing.priceInCents}
            onChange={handleBillingChange}
            className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="billingStartDate" className="text-sm font-medium text-[#1b0b3b]">
            Billing Start Date
          </Label>
          <DatePicker
            selected={new Date(formData.billing.billingStartDate)}
            onChange={(date) => handleDateChange('billingStartDate', date)}
            className="mt-1 block w-full border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px] px-3 py-2"
            wrapperClassName="w-full"
          />
        </div>

        <div>
          <Label htmlFor="billingEndDate" className="text-sm font-medium text-[#1b0b3b]">
            Billing End Date
          </Label>
          <DatePicker
            selected={new Date(formData.billing.billingEndDate)}
            onChange={(date) => handleDateChange('billingEndDate', date)}
            minDate={new Date(formData.billing.billingStartDate)}
            className="mt-1 block w-full border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px] px-3 py-2"
            wrapperClassName="w-full"
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            id="isBillingActive"
            name="isBillingActive"
            checked={formData.billing.isBillingActive}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                billing: { ...prev.billing, isBillingActive: checked },
              }))
            }
            className="border-[#eae6e7]"
          />
          <Label htmlFor="isBillingActive" className="ml-2 text-sm font-medium text-[#1b0b3b]">
            Billing Active
          </Label>
        </div>

        <div>
          <Label htmlFor="stripeSubscriptionId" className="text-sm font-medium text-[#1b0b3b]">
            Stripe Subscription ID
          </Label>
          <Input
            type="text"
            name="stripeSubscriptionId"
            id="stripeSubscriptionId"
            value={formData.billing.stripeSubscriptionId}
            onChange={handleBillingChange}
            className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-t from-[#7856ff] to-[#9075ff] text-white hover:rounded-md transition-all duration-300"
        >
          {loading ? 'Creating...' : 'Create Bot'}
        </Button>
      </div>
    </form>
  );
}