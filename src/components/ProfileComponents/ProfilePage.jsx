'use client'
import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/lib/api/users';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { FaKey, FaUserCircle } from 'react-icons/fa';

function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        accountCreated: '',
        status: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            if (!user?.userId) {
                toast.error('User not authenticated.');
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('idToken');
            if (!token) {
                toast.error('Session expired. Please login again.');
                setIsLoading(false);
                return;
            }

            const userProfile = await getUserProfile(user.userId, token);
            console.log(userProfile);

            const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
            setFormData({
                fullName: fullName || 'Not provided',
                email: userProfile.email || 'Not provided',
                status: userProfile.status || 'Pro', // Default to Pro to match screenshot
                accountCreated: userProfile.createdAt || new Date().toISOString(),
            });
        } catch (error) {
            toast.error('Failed to load profile. Please try again.');
            console.error('Profile fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user profile on mount
    useEffect(() => {
        fetchUserProfile();
    }, [user]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('idToken');
            if (!user?.userId || !token) {
                toast.error('User not authenticated.');
                return;
            }

            // Split fullName back into firstName and lastName
            const [firstName, ...lastNameParts] = formData.fullName.split(' ');
            const lastName = lastNameParts.join(' ') || '';
            const updatedData = {
                firstName,
                lastName,
                email: formData.email,
            };

            await updateUserProfile(user.userId, updatedData, token);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile. Please try again.');
            console.error('Profile update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <FaUserCircle /> Profile
                    </h1>
                    <p className="text-gray-500">
                        Manage your personal information and account settings.
                    </p>
                </div>
                <Button
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                        />
                    </svg>
                    Edit
                </Button>
            </div>

            {/* Skeleton Loading State */}
            {isLoading ? (
                <div className="mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Full Name</p>
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Email</p>
                            <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Account Created</p>
                            <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Status</p>
                            <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ) : (
                /* View Mode */
                <div className="mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Full Name</p>
                            <p className="text-lg font-semibold">{formData.fullName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Email</p>
                            <p className="text-lg font-semibold">{formData.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Account Created</p>
                            <p className="text-lg font-semibold">{formatDate(formData.accountCreated)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase">Status</p>
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 mt-1 rounded-md text-xs font-medium">
                                    {formData.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Mode Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="accountCreated">Account Created</Label>
                            <Input
                                id="accountCreated"
                                name="accountCreated"
                                value={formatDate(formData.accountCreated)}
                                disabled
                                className="mt-2 bg-gray-100"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" /> Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProfilePage;