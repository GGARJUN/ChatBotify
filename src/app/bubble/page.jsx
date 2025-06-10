// "use client";

// import Widget from '@/components/botComponents/Widget';
// import React, { useState } from 'react'

// function Bubble() {
//       const [isOpen, setIsOpen] = useState(false);
    
//       const toggleChat = () => {
//         setIsOpen((prev) => !prev);
//       };
//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Chat Bubble */}
//       {!isOpen && (
//         <button
//           onClick={toggleChat}
//           className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 animate-bobble"
//           aria-label="Open chat"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//             />
//           </svg>
//         </button>
//       )}

//       {/* Chat Box */}
//       {isOpen && (
//         <div className="animate-slide-in">
//           <Widget onClose={() => setIsOpen(false)} />
//         </div>
//       )}

//       {/* CSS for Animations */}
//       <style jsx>{`
//         @keyframes bobble {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }
//         .animate-bobble {
//           animation: bobble 2s ease-in-out infinite;
//         }
//         @keyframes slide-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default Bubble

"use client";

import React, { useState } from 'react';
import Widget from '@/components/botComponents/Widget';


const Bubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 animate-bobble shadow-lg"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="animate-slide-in">
          <Widget/>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes bobble {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bobble {
          animation: bobble 2s ease-in-out infinite;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Bubble;