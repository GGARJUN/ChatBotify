import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa6'

function OurCustomers() {
  const testimonials = [
    {
      image: "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 ",
      name: "Elena Mendex",
      role: "Head of Support, ShowUp.io",
      quote: "Chatbotify has transformed our customer support. The no-code builder made it easy to set up, and the AI handles 80% of inquiries automatically.",
      rating: 5,
    },
    {
      image: "https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 ",
      name: "James Carter",
      role: "CEO, TechTrend Innovations",
      quote: "The integrations with Slack and Shopify are seamless. Our team can now focus on strategy while Chatbotify handles customer queries 24/7.",
      rating: 4,
    },
    {
      image: "https://img.freepik.com/free-photo/close-up-young-caucasian-guy-with-beard-smiling-looking-happy-camera-standing-blue-background_1258-40230.jpg?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid&w=740 ",
      name: "Sophia Lee",
      role: "Marketing Lead, GrowEasy Analytics",
      quote: "Lead generation has never been easier. Chatbotify captures and qualifies leads directly from our website, boosting our conversion rates.",
      rating: 5,
    },
  ]

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

  return (
    <motion.section
      className="mx-4 md:mx-8 lg:mx-24 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      <h2 className="text-center mb-4 text-3xl font-bold text-gray-900">
        Our Customers Love Chatbotify
      </h2>
      <p className="text-sm text-gray-600 text-center">
        See how Chatbotify is transforming customer conversations for real businesses.
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 md:gap-8 mt-10"
        variants={containerVariants}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white border rounded-xl h-48 p-4 flex flex-col w-full max-w-sm"
          >
            <div className="flex items-center gap-2">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-8 h-8 object-cover rounded-full"
              />
              <div>
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-xs text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-900 font-medium italic mt-3 line-clamp-2">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <FaStar
                  key={starIndex}
                  className={`mt-2 ${
                    starIndex < testimonial.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default OurCustomers