// 'use client';

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import BotForm from './BotFom';



// export default function BotDialog({ onSubmit, loading }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="bg-gradient-to-t cursor-pointer from-[#7856ff] to-[#9075ff] text-white hover:rounded-md transition-all duration-300">
//           Create New Bot
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[625px] bg-white rounded-2xl shadow-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-[#1b0b3b]">Create New Bot</DialogTitle>
//         </DialogHeader>
//         <BotForm onSubmit={onSubmit} loading={loading} />
//       </DialogContent>
//     </Dialog>
//   );
// }