'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSingleBot } from '@/lib/api/bots';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function BotDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Get bot ID from URL
  const [botData, setBotData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        const token = localStorage.getItem('idToken');
        if (!token || !user) {
          toast.error('Authentication required. Please log in.');
          router.push('/auth/login');
          return;
        }

        const data = await getSingleBot(id, token, true); // includeDocs = true
        console.log(id);
        
        setBotData(data);
      } catch (error) {
        console.error('Error fetching bot:', error.message);
        toast.error('Failed to load bot details');
        router.push('/dashboard');
      }
    };

    fetchBotDetails();
  }, [id, user]);

  if (!botData) {
    return <div className="p-6">Loading...</div>;
  }

  const { bot, documents = [] } = botData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{bot.name}</h1>
      <p className="text-sm text-gray-500 mb-6">{bot.description}</p>

      <div className="mb-6">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
          bot.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : bot.status === 'DRAFT'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          Status: {bot.status}
        </span>
      </div>

      {/* Bot Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Created At:</strong> {new Date(bot.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Last Updated:</strong> {new Date(bot.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Documents</h2>
        {documents.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="text-sm">
                <a
                  href={doc.s3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No documents associated with this bot.</p>
        )}
      </div>
    </div>
  );
}