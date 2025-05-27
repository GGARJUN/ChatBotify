import { Button } from '@/components/ui/button'
import React from 'react'
import { FaRocket } from 'react-icons/fa6'
import { motion } from 'framer-motion'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const imageVariant = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

function HowWork() {
  return (
    <motion.section
      className="flex flex-col lg:flex-row justify-center items-center px-4 md:px-24 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Image Section */}
      <motion.div
        className="w-full lg:w-[60%] flex justify-center mb-8 lg:mb-0"
        variants={imageVariant}
      >
        <img
          src="/home/ai.png"
          alt="AI Illustration"
          className="w-72 h-60 sm:w-80 sm:h-72 md:w-96 md:h-80 object-cover rounded-xl"
        />
      </motion.div>

      {/* Text & Steps Section */}
      <motion.div className="w-full lg:w-[40%] space-y-6" variants={containerVariants}>
        <h2 className="text-3xl font-bold text-gray-900 text-center lg:text-left">
          How Chatbotify Works
        </h2>

        {/* Step 1 */}
        <motion.div className="flex items-start gap-4" variants={itemVariants}>
          <span className="bg-primary px-[15px] py-2 font-bold rounded-full text-white">1</span>
          <div>
            <h3 className="font-semibold">Design Your Bot</h3>
            <p className="max-w-md text-sm text-gray-600 mt-1">
              Use our visual builder to create conversational flows tailored to your needs.
            </p>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div className="flex items-start gap-4" variants={itemVariants}>
          <span className="bg-primary px-[15px] py-2 font-bold rounded-full text-white">2</span>
          <div>
            <h3 className="font-semibold">Connect Channels & Integrations</h3>
            <p className="max-w-md text-sm text-gray-600 mt-1">
              Link to your website, apps, or favorite tools with one click.
            </p>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div className="flex items-start gap-4" variants={itemVariants}>
          <span className="bg-primary px-[15px] py-2 font-bold rounded-full text-white">3</span>
          <div>
            <h3 className="font-semibold">Deploy & Engage</h3>
            <p className="max-w-md text-sm text-gray-600 mt-1">
              Start chatting with your visitors and customers, instantly and automatically.
            </p>
          </div>
        </motion.div>

        {/* Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <Button className="w-full sm:w-auto">
            <FaRocket className="mr-2" /> Get Started Free
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default HowWork