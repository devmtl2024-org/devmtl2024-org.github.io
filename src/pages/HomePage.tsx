import About from "@/components/Home/About";
import Overview from "@/components/Home/Overview";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div>
        <Overview />
        <About />
      </div>
    </div>
  );
}
