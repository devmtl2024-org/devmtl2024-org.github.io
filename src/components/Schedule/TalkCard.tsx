import { Speaker } from "@/type/speakers";

export default function TalkCard({
  time,
  speakers,
  index,
}: {
  time: string;
  speakers: (Speaker | null)[];
  index: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_auto] bg-gray-100 mx-auto w-full max-w-screen-lg">
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center p-4 flex flex-col justify-center w-full md:w-[200px]`}
      >
        <div className="text-lg font-semibold">{time.toUpperCase()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-6 bg-white w-full border border-dashed border-gray-400">
        {speakers.every((speaker) => speaker === null) ? (
          <div className="text-center text-gray-500 font-medium w-full col-span-2">
            Break
          </div>
        ) : (
          speakers.map(
            (speaker, idx) =>
              speaker && (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="text-sm text-gray-600 truncate mb-2">
                      {speaker.name}
                    </div>
                    <div className="text-xl font-semibold whitespace-normal cursor-pointer">
                      {speaker.title}
                    </div>
                    <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                      {speaker.description}
                    </p>
                    <div className="mt-4 text-xs font-medium uppercase text-white px-2 py-1 rounded bg-primary w-fit mx-auto">
                      {`Track ${speaker.track}`}
                    </div>
                  </div>
                </div>
              )
          )
        )}
      </div>
    </div>
  );
}
