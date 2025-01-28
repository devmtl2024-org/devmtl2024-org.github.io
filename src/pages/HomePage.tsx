import About from "@/components/Home/About";
import Overview from "@/components/Home/Overview";
import Sponsors from "@/components/Home/Sponsors";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div>
        <Overview />
        <About />
        <Sponsors />
      </div>
    </div>
  );
}
