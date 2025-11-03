import { Speaker } from "@/type/speakers";
import { Link, useNavigate } from "react-router-dom";

export default function TalkRow({
  time,
  speakers,
  index,
}: {
  time: string;
  speakers: (Speaker | null)[];
  index: number;
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_auto] bg-gray-100 mx-auto w-full max-w-screen-lg">
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center p-4 flex flex-col justify-center w-full md:w-[200px]`}
      >
        <div className="text-lg font-semibold">{time.toUpperCase()}</div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-6 bg-white w-full border border-dashed border-gray-400`}
      >
        {speakers.map(
          (speaker, idx) =>
            speaker && (
              <div
                key={idx}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                  <img
                    src={`${import.meta.env.BASE_URL}${speaker.image}`}
                    alt={speaker.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => {
                      window.scrollTo({ top: 0 });
                      navigate(
                        `/speaker/${speaker.name
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/ /g, "-")}`,
                      );
                    }}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <div className="text-sm text-gray-600 mb-2">
                    {speaker.name}
                  </div>
                  <Link
                    to={`/speaker/${speaker.name
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    className="text-xl font-semibold whitespace-normal cursor-pointer"
                  >
                    {speaker.title}
                  </Link>
                  <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                    {speaker.description}
                  </p>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
