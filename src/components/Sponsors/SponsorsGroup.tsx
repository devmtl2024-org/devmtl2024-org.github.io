import { Sponsor } from "@/type/sponsors";
import { motion } from "framer-motion";

function SponsorsGroup({
  sponsors,
  className,
}: {
  sponsors: Sponsor[];
  className: string;
}) {
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-8 justify-center items-end"
    >
      {sponsors.map((sponsor, index) => (
        <motion.div
          key={`${sponsor.level}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <a
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <img
              src={`${import.meta.env.BASE_URL}${sponsor.logo}`}
              alt={sponsor.name}
              className={`${className} object-contain mx-auto transition duration-300 group-hover:scale-110 bg-white p-4`}
            />
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default SponsorsGroup;
