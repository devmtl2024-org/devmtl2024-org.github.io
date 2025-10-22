import { Footer } from "@/components/Footer/Footer";
import About from "@/components/Home/About";
import Meetups from "@/components/Home/Meetups";
import Numbers from "@/components/Home/Numbers";
import Organizers from "@/components/Home/Organizers";
import Overview from "@/components/Home/Overview";
import Schedule from "@/components/Home/Schedule";
import Speakers from "@/components/Home/Speakers";
import Sponsors from "@/components/Home/Sponsors";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div>
        <Overview />
        <About />
        <Numbers />
        <Speakers />
        <Meetups />
        <Schedule />
        <Sponsors />
        <Organizers />
      </div>
      <Footer />
    </div>
  );
}
