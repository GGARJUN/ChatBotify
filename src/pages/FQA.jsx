import React from 'react'
import { motion } from 'framer-motion'
import { FaRegQuestionCircle } from 'react-icons/fa'

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
  hidden: { y: 30, opacity: 0 },
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

function FQA() {
  const faqs = [
    {
      question: 'Is there a free trial?',
      answer:
        'Yes, we offer a 14-day free trial with access to all features. No credit card required.',
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        'Absolutely! You can cancel your subscription at any time with no hidden fees.',
    },
    {
      question: 'Do you offer support during the trial?',
      answer:
        'Yes, our team is available to help you set up and use Chatbotify during your trial period.',
    },
    {
      question: 'What happens after my trial ends?',
      answer:
        'After your trial, you can choose a plan that suits your business or continue with limited free features.',
    },
  ]

  return (
    <motion.section
      className="mx-4 md:mx-10 lg:mx-40 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      <h2 className="text-center mb-4 text-3xl font-bold text-gray-900">
        Frequently Asked Questions
      </h2>
      <p className="max-w-sm mx-auto text-sm text-gray-600 text-center">
        Have more questions?{' '}
        <span className="text-primary cursor-pointer hover:underline">Contact us</span> anytime.
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={itemVariants}>
            <div className="flex items-center gap-2 mt-6">
              <FaRegQuestionCircle className="text-primary flex-shrink-0" />
              <h3 className="text-md font-bold text-gray-900">{faq.question}</h3>
            </div>
            <p className="text-sm text-gray-600 font-medium mt-2">{faq.answer}</p>
            <div className="h-[1px] bg-gray-300 w-full mt-6"></div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default FQA