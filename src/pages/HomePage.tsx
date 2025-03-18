import { Footer } from "@/components/Footer/Foorter";
import About from "@/components/Home/About";
import Meetups from "@/components/Home/Meetups";
import Numbers from "@/components/Home/Numbers";
import Organizers from "@/components/Home/Organizers";
import Overview from "@/components/Home/Overview";
import Schedule from "@/components/Home/Schedule";
import Speakers from "@/components/Home/Speakers";
import Sponsors from "@/components/Home/Sponsors";
import Venue from "@/components/Home/Venue";
import NavbarTransparent from "@/components/Navbar/NavbarTransparent";

export default function HomePage() {
  return (
    <div>
      <NavbarTransparent />
      <div>
        <Overview />
        <About />
        <Numbers />
        <Speakers />
        <Meetups />
        <Schedule />
        <Sponsors />
        <Venue />
        <Organizers />
      </div>
      <Footer />
    </div>
  );
}
