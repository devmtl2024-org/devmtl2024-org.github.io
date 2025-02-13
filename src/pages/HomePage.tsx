import About from "@/components/Home/About";
import Organizers from "@/components/Home/Organizers";
import Overview from "@/components/Home/Overview";
import Sponsors from "@/components/Home/Sponsors";
import NavbarTransparent from "@/components/Navbar/NavbarTransparent";

export default function HomePage() {
  return (
    <div>
      <NavbarTransparent />
      <div>
        <Overview />
        <About />
        <Sponsors />
        <Organizers />
      </div>
    </div>
  );
}
