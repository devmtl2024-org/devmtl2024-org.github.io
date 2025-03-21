import BuyTicketButton from "../BuyTicket/BuyTicketButton";

import overviewImage from "../../assets/overview.jpg";

function Overview() {
  return (
    <section
      className="relative bg-cover bg-center h-screen flex items-center justify-center text-center w-full"
      style={{
        backgroundImage: `url(${overviewImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-4 text-white">
        {/* Title */}
        <h1 className="text-xl lg:text-xl mb-4">
          November 27th, 2024 - ETS Formation, Montréal, QC
        </h1>
        <h1 className="text-4xl lg:text-6xl font-bold mb-4">/dev/mtl 2024</h1>
        <div className="w-16 h-1 bg-white mx-auto mb-6"></div>

        {/* Subtitle */}
        <p className="text-xl lg:text-2xl font-medium mb-8">
          Share the passion. Discover the innovation.
        </p>

        <BuyTicketButton />
      </div>
    </section>
  );
}

export default Overview;
