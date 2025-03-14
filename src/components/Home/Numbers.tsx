import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Counter({
  value,
  startFrom,
  plus,
}: {
  value: number;
  startFrom?: number;
  plus?: boolean;
}) {
  const [count, setCount] = useState(startFrom || 0);

  useEffect(() => {
    let current = startFrom || 0;
    const duration = 2000;
    const interval = 30;
    const step = Math.ceil((value - current) / (duration / interval));

    const counter = setInterval(() => {
      current += step;
      if (current >= value) {
        current = value;
        clearInterval(counter);
      }
      setCount(current);
    }, interval);

    return () => clearInterval(counter);
  }, [value, startFrom]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="text-7xl font-bold text-white"
    >
      {plus && "+"}
      {count}
    </motion.span>
  );
}

function Numbers() {
  const stats = [
    { label: "Day", value: 1 },
    { label: "Track", value: 2 },
    { label: "Talks", value: 18, startFrom: 0 },
    { label: "Attendees", value: 100, startFrom: 80, plus: true },
  ];

  return (
    <div className="bg-gradient-to-b from-primary-dark to-primary/80 px-4 py-24">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <Counter
              value={stat.value}
              startFrom={stat.startFrom}
              plus={stat.plus}
            />
            <p className="text-white text-lg mt-4 mb-3">{stat.label}</p>
            <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Numbers;
