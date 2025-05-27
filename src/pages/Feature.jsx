import React from 'react'
import { motion } from 'framer-motion'
import { FaPlug } from 'react-icons/fa6'
import { ImPower } from 'react-icons/im'
import { MdOutlineSupportAgent } from 'react-icons/md'
import { FaMagnet } from 'react-icons/fa6'
import { TbDeviceAnalytics } from 'react-icons/tb'
import { IoIosColorPalette } from 'react-icons/io'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      damping: 12,
    },
  },
}

function Feature() {
  const features = [
    {
      icon: <ImPower className="text-blue-600 w-6 h-6" />,
      bgColor: 'bg-blue-200/50',
      title: 'No-Code Automation',
      description:
        'Build and launch chatbots in minutes with our intuitive drag-and-drop builder. No technical skills required.',
    },
    {
      icon: <MdOutlineSupportAgent className="text-green-600 w-6 h-6" />,
      bgColor: 'bg-green-200/50',
      title: '24/7 Instant Support',
      description:
        'Deliver real-time answers and solve common questions automatically—any time, any channel.',
    },
    {
      icon: <FaPlug className="text-violet-600 w-6 h-6" />,
      bgColor: 'bg-violet-200/50',
      title: 'Seamless Integrations',
      description:
        'Connect with WhatsApp, Messenger, Slack, Shopify, and more. Deploy your bots everywhere your users are.',
    },
    {
      icon: <TbDeviceAnalytics className="text-yellow-600 w-6 h-6" />,
      bgColor: 'bg-yellow-200/50',
      title: 'Powerful Analytics',
      description:
        'Track conversations, engagement, and customer satisfaction with real-time analytics and actionable insights.',
    },
    {
      icon: <FaMagnet className="text-pink-600 w-6 h-6" />,
      bgColor: 'bg-pink-200/50',
      title: 'Lead Generation',
      description:
        'Qualify, nurture, and capture leads directly from chat-then send them to your CRM automatically.',
    },
    {
      icon: <IoIosColorPalette className="text-blue-600 w-6 h-6" />,
      bgColor: 'bg-blue-200/50',
      title: 'Fully Customizable',
      description:
        'Personalize your chatbots look, tone, and workflows to match your brand and business goals',
    },
  ]

  return (
    <motion.div
      className="py-20 overflow-x-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-4 md:mx-24 bg-white rounded-2xl shadow-xl px-6 md:px-10 py-10">
        <h2 className="text-center mb-4 text-3xl font-bold text-gray-900">
          Everything You Need to supercharge Conversations
        </h2>
        <p className="max-w-md mx-auto text-sm text-gray-600 text-center">
          Chatbotify empowers you to automate customer interactions, deliver instant support, and
          capture more leads—all with zero coding.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 md:gap-8 mt-10"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-100 rounded-xl h-48 p-4 flex flex-col w-full max-w-xs"
            >
              <div
                className={`${feature.bgColor} rounded-md w-10 h-10 flex justify-center items-center`}
              >
                {feature.icon}
              </div>
              <h3 className="my-4 font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Feature