import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ImLeaf } from 'react-icons/im'
import { TiTick } from 'react-icons/ti'
import { GiProgression } from 'react-icons/gi'
import { SiEnterprisedb } from 'react-icons/si'

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

function Pricing() {
  const pricing = [
    {
      icon: <ImLeaf className="text-primary w-6 h-6" />,
      bgColor: 'bg-blue-200/50',
      title: 'Free',
      price: '$0',
      description: 'All core features. Perfect to explore and get started.',
      features: ['1 Chatbot', '500 Conversations/mo', 'Basic Analytics'],
    },
    {
      icon: <GiProgression className="text-primary w-6 h-6" />,
      bgColor: 'bg-blue-200/50',
      title: 'Pro',
      price: '$29',
      description:
        'For growing teams who want unlimited automation & integrations.',
      features: [
        'Unlimited Chatbots',
        '10,000 Conversations/mo',
        'All Integrations',
        'Advanced Analytics',
        'Priority Support',
      ],
    },
    {
      icon: <SiEnterprisedb className="text-primary w-6 h-6" />,
      bgColor: 'bg-blue-200/50',
      title: 'Enterprise',
      price: 'Custom',
      description:
        'For large businesses with advanced needs and dedicated support.',
      features: [
        'Everything in Pro',
        'Unlimited Conversations',
        'SLA & Onboarding',
        'Dedicated Manager',
      ],
    },
  ]

  return (
    <motion.section
      className="mx-4 md:mx-8 lg:mx-24 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      <h2 className="text-center mb-4 text-3xl font-bold text-gray-900">
        Flexible Pricing for Every Business
      </h2>
      <p className="max-w-sm mx-auto text-sm text-gray-600 text-center">
        Start for free. Upgrade as you grow—no surprises. Cancel anytime.
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 md:gap-8 mt-10"
        variants={containerVariants}
      >
        {pricing.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl border-4 border-white hover:border-primary transition-all duration-300 p-4 flex flex-col justify-center items-center w-full max-w-sm"
          >
            <div
              className={`${item.bgColor} rounded-md w-10 h-10 flex justify-center items-center`}
            >
              {item.icon}
            </div>
            <h3 className="my-4 font-bold text-primary">{item.title}</h3>
            <h3 className="text-2xl font-extrabold text-gray-950">
              {item.price}{' '}
              <span className="text-sm text-gray-500 font-normal">
                {item.price !== 'Custom' ? '/mo' : ''}
              </span>
            </h3>
            <p className="text-sm px-10 text-center font-medium text-gray-600">
              {item.description}
            </p>
            <div className="mt-4  space-y-2 w-full">
              {item.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-2 text-gray-600 font-semibold"
                >
                  <TiTick className="text-green-600" />
                  <p className="text-sm font-medium text-gray-800">{feature}</p>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full cursor-pointer">Start Free Trial</Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default Pricing