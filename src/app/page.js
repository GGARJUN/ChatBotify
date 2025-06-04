'use client'
import Feature from "@/pages/Feature";
import HowWork from "@/pages/HowWork";
import OurCustomers from "@/pages/OurCustomers";
import Pricing from "@/pages/Pricing";
import FQA from "@/pages/FQA";
import Hero from "@/pages/Hero";
import Header from "@/components/homeComponents/Header";


export default function Home() {
  return (
    <div className="bg-blue-100/40">
      <Header />
      <Hero />
      <Feature />
      <HowWork />
      <OurCustomers />
      <Pricing />
      <FQA />
      <div className='bg-primary w-full  mt-10 flex justify-center items-center '>
        <p className='text-white py-5'>© 2025 Chatbotify, All Rights Reserved. Design By Chatbotify</p>
      </div>
    </div>
  );
}
