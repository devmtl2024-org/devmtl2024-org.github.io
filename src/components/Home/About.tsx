import { Speaker } from "@/type/speakers";
import { loadSpeakers } from "@/utils/loadSpeakers";
import { useEffect, useState } from "react";

function About() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    loadSpeakers(4).then((speakers) => {
      setSpeakers(speakers);
    });
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Numbers Section */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        {/* 100 Attendees */}
        <div>
          <h2 className="text-6xl font-extrabold text-black mb-2">100</h2>
          <div className="w-16 h-1 bg-secondary mb-2"></div>
          <p className="text-lg font-medium text-gray-700">Attendees</p>
        </div>

        {/* 1 Day */}
        <div>
          <h2 className="text-6xl font-extrabold text-black mb-2">1</h2>
          <div className="w-16 h-1 bg-secondary mb-2"></div>
          <p className="text-lg font-medium text-gray-700">Day</p>
        </div>

        {/* 18 Sessions */}
        <div>
          <h2 className="text-6xl font-extrabold text-black mb-2">18</h2>
          <div className="w-16 h-1 bg-secondary mb-2"></div>
          <p className="text-lg font-medium text-gray-700">Sessions</p>
        </div>

        {/* 2 Tracks */}
        <div>
          <h2 className="text-6xl font-extrabold text-black mb-2">2</h2>
          <div className="w-16 h-1 bg-secondary mb-2"></div>
          <p className="text-lg font-medium text-gray-700">Tracks</p>
        </div>
      </div>

      {/* Speakers Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-secondary mb-6">Speakers</h3>

        {/* Speakers List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {speakers.map((speaker, index) => (
            <div key={index} className="flex flex-col items-start">
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <p className="text-lg font-medium text-gray-700">
                {speaker.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* View All Speakers Button */}
      <div>
        <a
          href="/speakers"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition duration-200"
        >
          View all speakers
        </a>
      </div>
    </section>
  );
}

export default About;
