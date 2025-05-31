'use client';

import BotList from './_components/BotList';
import CreateBot from './_components/CreateBot';


export default function BotsPage() {

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <h3 className="text-lg font-medium leading-6 text-[#1b0b3b]">Your Bots</h3>
        <CreateBot />
      </div>
      <div className="mt-6">
        <BotList />
      </div>
    </div>
  );
}