import { motion } from "framer-motion";
import { Speaker } from "@/type/speakers";
import { loadData } from "@/utils/loadData";
import { useState, useEffect } from "react";

function TalkCard({ speaker }: { speaker: Speaker }) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 mx-auto mb-6 w-[700px]">
      {/* Left section: Time and Track */}
      <div className="bg-secondary text-white text-center md:text-left p-4 w-[200px] mb-4 md:mb-0 flex flex-col justify-center">
        <div className="text-lg font-semibold">
          {new Date(speaker.time)
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            .toUpperCase()}
        </div>
        <div className="text-sm">{`Track ${speaker.track}`}</div>
      </div>

      {/* Right section: Speaker's Info */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-8 bg-white w-full border border-dashed border-gray-400 border-l-0">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <img
            src={speaker.image}
            alt={speaker.name}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col max-w-xs">
          <div className="text-sm text-gray-600 truncate">{speaker.name}</div>
          <div className="text-xl font-semibold truncate">{speaker.title}</div>
          <p className="text-sm mt-2 text-gray-600 line-clamp-2">
            {speaker.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Schedule() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    loadData<Speaker>("speakers", 3, true).then((speakers) => {
      setSpeakers(speakers);
    });
  }, []);

  return (
    <section className="bg-gray-100 py-24 px-6 overflow-hidden items-center gap-12 flex flex-col">
      <div className="max-w-5xl mx-auto items-center gap-12 flex flex-col">
        {/* First Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center"
        >
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            Schedule details
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            Event Schedules
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </motion.div>

        {/* Date Card */}
        <div className="bg-secondary text-white rounded-lg p-8 shadow-md w-64 text-center">
          <h4 className="text-2xl font-semibold mb-2">November 27th</h4>
          <p className="text-xl">Wednesday</p>
        </div>
      </div>

      {/* Schedule */}
      {speakers.map((speaker, index) => (
        <div key={index}>
          <TalkCard speaker={speaker} />
        </div>
      ))}

      <button className="px-12 py-5 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase">
        See more
      </button>
    </section>
  );
}

export default Schedule;
