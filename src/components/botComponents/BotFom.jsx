// // app/_components/BotComponents/BotForm.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';

// export default function BotForm({ onSubmit, loading }) {
//   const [formData, setFormData] = useState({
//     clientId: '',
//     name: '',
//     description: '',
//     status: 'ACTIVE',
//     createdAt: new Date().toISOString(),
//   });

//   // Load clientId from localStorage only once
//   useEffect(() => {
//     const storedClientId = localStorage.getItem('clientId');
//     if (storedClientId) {
//       setFormData((prev) => ({
//         ...prev,
//         clientId: storedClientId,
//       }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (value) => {
//     setFormData((prev) => ({ ...prev, status: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Error submitting bot form:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//         {/* Client ID - readonly */}
//         <div>
//           <Label htmlFor="clientId" className="text-sm font-medium text-[#1b0b3b]">
//             Client ID
//           </Label>
//           <Input
//             type="text"
//             name="clientId"
//             id="clientId"
//             value={formData.clientId}
//             readOnly
//             className="mt-1 border-[#eae6e7] bg-gray-50 cursor-not-allowed"
//           />
//         </div>

//         {/* Bot Name */}
//         <div>
//           <Label htmlFor="name" className="text-sm font-medium text-[#1b0b3b]">
//             Bot Name
//           </Label>
//           <Input
//             type="text"
//             name="name"
//             id="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div className="sm:col-span-2">
//           <Label htmlFor="description" className="text-sm font-medium text-[#1b0b3b]">
//             Description
//           </Label>
//           <Textarea
//             id="description"
//             name="description"
//             rows={3}
//             value={formData.description}
//             onChange={handleChange}
//             className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]"
//           />
//         </div>

//         {/* Status */}
//         {/* <div>
//           <Label htmlFor="status" className="text-sm font-medium text-[#1b0b3b]">
//             Status
//           </Label>
//           <Select value={formData.status} onValueChange={handleSelectChange}>
//             <SelectTrigger className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="ACTIVE">ACTIVE</SelectItem>
//               <SelectItem value="INACTIVE">INACTIVE</SelectItem>
//               <SelectItem value="DRAFT">DRAFT</SelectItem>
//             </SelectContent>
//           </Select>
//         </div> */}
//       </div>

//       <div className="flex justify-end">
//         <Button
//           type="submit"
//           disabled={loading}
//           className="bg-gradient-to-t from-[#7856ff] to-[#9075ff] text-white hover:rounded-md transition-all duration-300"
//         >
//           {loading ? 'Creating...' : 'Create Bot'}
//         </Button>
//       </div>
//     </form>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


export default function BotForm({ onSubmit, loading, defaultClientId }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    clientId: defaultClientId || '',
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  // Initialize form with clientId from props or auth context
  useEffect(() => {
    if (defaultClientId) {
      setFormData(prev => ({ ...prev, clientId: defaultClientId }));
    } else if (user?.clientId) {
      setFormData(prev => ({ ...prev, clientId: user.clientId }));
    }
  }, [defaultClientId, user?.clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting bot form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Client ID - readonly */}
        <div>
          <Label htmlFor="clientId" className="text-sm font-medium text-[#1b0b3b]">
            Client ID
          </Label>
          <Input
            type="text"
            name="clientId"
            id="clientId"
            value={formData.clientId}
            readOnly
            className="mt-1 border-[#eae6e7] bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Bot Name */}
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

        {/* Description */}
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

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium text-[#1b0b3b]">
            Status
          </Label>
          <Select value={formData.status} onValueChange={handleSelectChange}>
            <SelectTrigger className="mt-1 border-[#eae6e7] hover:border-[#7856ff] transition-all duration-300 rounded-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className=" "
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