import { Footer } from "@/components/Footer/Footer";
import About from "@/components/Home/About";
import CFP from "@/components/Home/CFP";
import Meetups from "@/components/Home/Meetups";
import Numbers from "@/components/Home/Numbers";
import Organizers from "@/components/Home/Organizers";
import Overview from "@/components/Home/Overview";
import Sponsors from "@/components/Home/Sponsors";
import Venue from "@/components/Home/Venue";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div>
        <Overview />
        <About />
        <Numbers />
        <CFP />
        <Meetups />
        <Venue />
        <Sponsors />
        <Organizers />
      </div>
      <Footer />
    </div>
  );
}
