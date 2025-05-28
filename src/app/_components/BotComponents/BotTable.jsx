'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function BotTable({ bots }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-slate-500 font-bold">NAME</TableHead>
          <TableHead className="text-slate-500 font-bold ">TYPE</TableHead>
          <TableHead className="text-slate-500 font-bold ">STATUS</TableHead>
          <TableHead className="text-slate-500 font-bold ">CREATED</TableHead>
          <TableHead className="text-slate-500 font-bold ">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bots && bots.length > 0 ? (
          bots.map((bot) => (
            <TableRow key={bot.id} >
              <TableCell className="text-slate-600 font-medium ">{bot.name}</TableCell>
              <TableCell>{bot.type}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-md text-sm font-medium ${bot.status === 'ACTIVE'
                      ? 'bg-green-300/30 text-green-500'
                      : bot.status === 'DRAFT'
                        ? 'bg-yellow-300/30 text-yellow-500'
                        : 'bg-red-300/30 text-red-500'
                    }`}
                >
                  {bot.status}
                </span>
              </TableCell>
              <TableCell className='text-slate-500 font-semibold text-md '>
                {new Date(bot.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-6">
                    <span className='text-primary font-semibold text-md '>Edit</span>
                    <span className=' font-semibold text-md text-slate-500 '>View</span>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500">
              No bots found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}