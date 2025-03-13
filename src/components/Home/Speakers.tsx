import { Speaker } from "@/type/speakers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    loadData<Speaker>("speakers", 4).then((speakers) => {
      setSpeakers(speakers);
    });
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12 text-center bg-white bg-[url('/path/to/your/mouchet-pattern.png')] bg-repeat"
    >
      {/* Speakers Section */}
      <div className="mb-12">
        <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">Listen to the</h3>
        <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
          Event Speakers
        </h3>
        <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
      </div>

      {/* Speakers List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {speakers.map((speaker, index) => (
          <div key={index} className="relative flex flex-col items-center group">
            <div className="relative w-36 h-36 rounded-full overflow-hidden">
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
              />
              {/* Hover effect */}
              <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
                <FiPlus className="text-white text-3xl" onClick={() => console.log(`Speaker: ${speaker.name}`)} />
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700 mt-2">{speaker.name}</p>
          </div>
        ))}
      </div>

      {/* View All Speakers Button */}
      <div className="mt-8">
        <a
          href="/speakers"
          className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition duration-200"
        >
          View all speakers
        </a>
      </div>
    </motion.section>
  );
}

export default Speakers;
