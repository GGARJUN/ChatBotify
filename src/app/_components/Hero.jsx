import FQA from '@/pages/FQA';
import Pricing from '@/pages/Pricing';
import OurCustomers from '@/pages/OurCustomers';
import HowWork from '@/pages/HowWork';
import Feature from '@/pages/Feature';
import Home from '@/pages/Home';

function Hero() {

  return (
    <div className='bg-blue-100/40'>
      <Home />
      <Feature />
      <HowWork />
      <OurCustomers />
      <Pricing />
      <FQA />
      <div className='bg-primary w-full  mt-10 flex justify-center items-center '>
        <p className='text-white py-5'>© 2025 recrute, All Rights Reserved. Design By Chatbotify</p>
      </div>
    </div >
  );
}

export default Hero;