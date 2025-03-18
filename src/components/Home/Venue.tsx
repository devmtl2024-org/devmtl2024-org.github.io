import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

function Venue() {
  return (
    <section className="bg-gray-100 py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-12">
        {/* Première Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3"
        >
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            Venue
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            Get Direction to the Event Hall
          </h3>
          <div className="w-16 h-1 bg-primary mb-6"></div>
        </motion.div>

      </div>
    </section>
  );
}

export default Venue;
