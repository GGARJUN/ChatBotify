import { Button } from '@/components/ui/button'
import { CircleDotDashed } from 'lucide-react';
import Link from 'next/link';
import { ImFire } from "react-icons/im";

function Header() {
    return (
        <div className='flex items-center justify-between p-4 px-20 border-b border-gray-200 shadow-sm'>
            <Link href="/">
                <div className='flex items-center gap-2 hover:text-primary cursor-pointer transition-all duration-300'>
                    {/* <ImFire size={16} /> */}
                    <CircleDotDashed />
                    <h2 className='font-bold text-xl '>Chatbotify</h2>
                </div>
            </Link>
            <ul className='hidden md:flex items-center gap-14 font-semibold text-sm'>
                <li className='hover:text-primary cursor-pointer transition-all duration-300'>Features</li>
                <li className='hover:text-primary cursor-pointer transition-all duration-300'>How it Works</li>
                <li className='hover:text-primary cursor-pointer transition-all duration-300'>Pricing</li>
                <li className='hover:text-primary cursor-pointer transition-all duration-300'>FAQ</li>
            </ul>
            <div className='flex items-center gap-5'>
                <h2 className='text-primary font-semibold cursor-pointer'>Sign In</h2>
                <Link href="/auth/pages/login">
                    <Button className="cursor-pointer">Get Started</Button>
                </Link>
            </div>
        </div>
    )
}

export default Header