import { Button } from '@/components/ui/button'
import { ArrowDownIcon } from 'lucide-react'
import React from 'react'
import { FaRobot } from 'react-icons/fa6'
import { motion } from 'framer-motion'

// Individual animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const badgeVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

function Home() {
  return (
    <div>
      <motion.section
        className="flex overflow-hidden flex-col md:flex-row justify-between items-center px-4 md:px-16 lg:px-24 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Text Section */}
        <div className="flex-1 max-w-lg mb-8 md:mb-0 text-center md:text-left">
          {/* Badge */}
          <motion.div
            className="flex gap-2 items-center bg-[#5e27cd25] w-fit rounded-full px-4 py-2 mx-auto md:mx-0 mb-6"
            variants={badgeVariants}
          >
            <FaRobot className="w-5 h-5 text-[#5f27cd] transition-colors duration-300" />
            <p className="text-[#5f27cd] font-semibold text-sm">Next-Gen AI ChatBot Platform</p>
          </motion.div>

          {/* Headings and Description */}
          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold tracking-tighter text-gray-900 leading-tight">
            Elevate Your Customer
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold tracking-tighter text-gray-900 leading-tight">
            Experience with
          </motion.h2>
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-5xl font-extrabold tracking-tighter text-[#5f27cd] leading-tight mb-4"
          >
            Chatbotify
          </motion.h3>
          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-600 mb-6">
            Instantly deploy AI-powered chatbots anywhere—websites, apps, or social—without code.
            Automate, capture leads, and boost engagement 24/7.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mt-6"
          >
            <Button className="bg-[#5f27cd] hover:bg-[#4a1ea6] text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300">
              Try Chatbotify Free
            </Button>
            <span className="flex items-center gap-2 text-[#5f27cd] hover:text-[#4a1ea6] cursor-pointer transition-colors duration-300">
              <ArrowDownIcon className="w-5 h-5" />
              <p className="font-medium">See Features</p>
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center md:justify-start gap-2 mt-8 text-gray-400 font-semibold"
          >
            <img
              src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 "
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <img
              src="https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 "
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <img
              src="https://img.freepik.com/free-photo/close-up-young-caucasian-guy-with-beard-smiling-looking-happy-camera-standing-blue-background_1258-40230.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 "
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <p className="text-xs">Trusted by 2,000+ businesses</p>
          </motion.div>
        </div>

        {/* Image Section */}
        <motion.div variants={imageVariants} className="flex justify-center">
          <div className="bg-white w-[350px] h-64 md:h-[350px] rounded-2xl shadow-2xl flex items-center justify-center">
            <img
              src="https://img.freepik.com/free-vector/chat-bot-concept-illustration_114360-5522.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 "
              alt="Chatbot Illustration"
              className="w-48 h-48 md:w-64 md:h-64 rounded-xl object-cover p-4"
            />
          </div>
        </motion.div>
      </motion.section>

      <div className="flex justify-center items-center gap-5 pb-20">
        <p className="text-sm text-gray-400 font-semibold">Loved by teams at</p>
        <img src="/home/social.png" alt="" />
        <img src="/home/spotify.png" alt="" />
        <img src="/home/box.png" alt="" />
        <img src="/home/slack.png" alt="" />
        <img src="/home/shopify.png" alt="" />
      </div>
    </div>
  )
}

export default Home