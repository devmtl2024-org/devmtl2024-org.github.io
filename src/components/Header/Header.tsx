import overviewImage from "../../assets/overview.jpg";

function Header({ children }: React.PropsWithChildren) {
  return (
    <section
      className="relative bg-cover bg-center h-96 flex items-center justify-center text-center w-full"
      style={{
        backgroundImage: `url(${overviewImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary opacity-70"></div>
      {children}
    </section>
  );
}

export default Header;
