'use client'
import { useAuth } from '@/context/AuthContext';
import { checkSubscriptionStatus } from '@/lib/api/payment';
import { getBots } from '@/lib/api/bots';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaRobot } from 'react-icons/fa';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import CreateBot from '../botComponents/CreateBot';

function Subscription() {
    const { user } = useAuth();
    const [isPro, setIsPro] = useState(false);
    const [checkingSub, setCheckingSub] = useState(true);
    const [loading, setLoading] = useState(true); // Added for fetchBots loading state
    const [bots, setBots] = useState([]);
    const [botsUsed, setBotsUsed] = useState(0); // Will be calculated from bots length
    const botsAllowed = isPro ? 3 : 1; // 1 for Basic, 3 for Pro

    const fetchBots = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('idToken');
            if (!token) {
                throw new Error('No authentication token found.');
            }
            const response = await getBots(token);
            const fetchedBots = Array.isArray(response) ? response : [];
            setBots(fetchedBots);
        } catch (error) {
            console.error('Error fetching bots:', error.message);
            toast.error('Failed to load bots');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        if (!user) {
            setCheckingSub(false);
            return;
        }

        try {
            const token = localStorage.getItem('idToken');
            if (!token) {
                throw new Error('No authentication token found.');
            }

            const isSubscribed = await checkSubscriptionStatus(token);
            setIsPro(isSubscribed);
            console.log('Updated isPro state:', isSubscribed);
        } catch (error) {
            console.error('Error fetching subscription status:', error.message);
            setIsPro(false);
        } finally {
            setCheckingSub(false);
        }
    };

    // Fetch subscription and bots on mount
    useEffect(() => {
        fetchSubscription();
        fetchBots();
    }, []);

    // Calculate botsUsed based on bots length
    useEffect(() => {
        setBotsUsed(bots.length);
    }, [bots]);

    // Calculate the width of the progress bar (dynamic slider)
    const progressWidth = (botsUsed / botsAllowed) * 100;

    // Show skeleton if either subscription or bots are loading
    const isLoadingState = checkingSub || loading;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-10">
            <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                <FaCreditCard />
                Subscription & Usage
            </h3>

            <div className="flex items-center">
                {/* Left Section: Plan Info */}
                <div className="w-[50%]">
                    {isLoadingState ? (
                        <div className="mt-5 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">PLAN :</span>
                                <div className="h-6 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
                            </div>
                            <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse mt-3"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mt-5">
                                <span className="font-semibold">PLAN :</span>
                                <p
                                    className={`text-sm font-medium px-2 rounded-sm ${isPro ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}
                                >
                                    {isPro ? 'Pro' : 'Basic'}
                                </p>
                            </div>
                            <div className="mt-3">
                                {!isPro && (
                                    <Link href={`/clients/${user?.clientId}/pricing`}>
                                        <Button variant="outline" size="sm" className="mt-2 cursor-pointer">
                                            Upgrade to Pro
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Divider */}
                <div className="w-[1px] h-40 bg-slate-200"></div>

                {/* Right Section: Bots Info */}
                <div className="pl-20 flex-1">
                    {isLoadingState ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-44 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse mt-3"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <FaRobot className="w-5 h-5 text-primary" />
                                <p className="font-semibold">
                                    Bots Allowed: <span className="text-primary font-bold">{botsAllowed}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-5">
                                <div className="w-44 h-3 bg-slate-300 rounded-full relative">
                                    <div
                                        className="absolute left-0 top-0 h-3 bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${progressWidth}%` }}
                                    ></div>
                                </div>
                                <p className="font-semibold text-sm text-slate-500">
                                    {botsUsed}/{botsAllowed} Used
                                </p>
                            </div>
                            <div className="mt-3">
                                <CreateBot />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Subscription;