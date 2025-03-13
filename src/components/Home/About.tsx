import { motion } from "framer-motion";
import {
  FaUsers,
  FaHandshake,
  FaRegGrinStars,
  FaRegSurprise,
} from "react-icons/fa";

function About() {
  return (
    <section className="bg-gray-100 py-16 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-12">
        {/* First Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3"
        >
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            About
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            Why you should <br /> Join Event
          </h3>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="text-sm text-gray-800 mb-6">
            Enjoy a day of learning, networking, and sharing with the local tech
            communities!
          </p>
          <button className="px-6 py-2 bg-secondary text-white font-medium rounded-md shadow-md">
            Buy Ticket
          </button>
        </motion.div>

        {/* Second Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaRegSurprise className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              Celebrate Tech Innovation
            </h4>
            <p className="text-gray-700 text-sm">
              Join the biggest tech gathering in Montreal and experience the
              best innovations.
            </p>
          </div>
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaHandshake className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              Network with Experts
            </h4>
            <p className="text-gray-700 text-sm">
              Meet professionals and make connections that can boost your
              career.
            </p>
          </div>
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaUsers className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              Join the Community
            </h4>
            <p className="text-gray-700 text-sm">
              Connect with like-minded tech enthusiasts from all over Montreal.
            </p>
          </div>
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaRegGrinStars className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              Fun and Inspiration
            </h4>
            <p className="text-gray-700 text-sm">
              Enjoy a vibrant atmosphere and leave feeling inspired!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
