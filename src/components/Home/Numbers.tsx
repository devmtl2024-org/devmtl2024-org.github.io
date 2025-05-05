import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Counter({
  value,
  startFrom,
  plus,
  inView,
}: {
  value: number;
  startFrom?: number;
  plus?: boolean;
  inView: boolean;
}) {
  const [count, setCount] = useState(startFrom || 0);

  useEffect(() => {
    if (!inView) {
      return;
    } // Start counting only when in view

    let current = startFrom || 0;
    const duration = 2000;
    const interval = 60;
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
  }, [value, startFrom, inView]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className="text-5xl md:text-7xl  font-bold text-white"
    >
      {plus && "+"}
      {count}
    </motion.span>
  );
}

function Numbers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { label: "Day", value: 1 },
    { label: "Track", value: 2 },
    { label: "Talks", value: 18, startFrom: 0 },
    { label: "Attendees", value: 100, startFrom: 80, plus: true },
  ];

  return (
    <div
      ref={ref}
      className="bg-gradient-to-b from-primary-dark to-primary/80 px-4 py-24"
    >
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <Counter
              value={stat.value}
              startFrom={stat.startFrom}
              plus={stat.plus}
              inView={isInView}
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
