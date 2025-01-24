import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div style={{ height: "200vh" }}>
    <Navbar />
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">Hello world!</h1>
    </div>
    </div>
  );
}