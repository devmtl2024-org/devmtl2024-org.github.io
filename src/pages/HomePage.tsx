import { Footer } from "@/components/Footer/Foorter";
import About from "@/components/Home/About";
import Organizers from "@/components/Home/Organizers";
import Overview from "@/components/Home/Overview";
import Speakers from "@/components/Home/Speakers";
import Sponsors from "@/components/Home/Sponsors";
import NavbarTransparent from "@/components/Navbar/NavbarTransparent";

export default function HomePage() {
  return (
    <div>
      <NavbarTransparent />
      <div>
        <Overview />
        <About />
        <Speakers />
        <Sponsors />
        <Organizers />
      </div>
      <Footer />
    </div>
  );
}
