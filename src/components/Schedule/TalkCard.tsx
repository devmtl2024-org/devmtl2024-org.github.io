import { Speaker } from "@/type/speakers";
import React from "react";

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
    <div className="flex flex-col md:flex-row bg-gray-100 mx-auto w-full">
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center p-4 w-full md:w-[200px] flex flex-col justify-center`}
      >
        <div className="text-lg font-semibold">{time.toUpperCase()}</div>
      </div>

      {/* Speaker Cards */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-6 bg-white w-full border border-dashed border-gray-400">
        {speakers.every((speaker) => speaker === null) ? (
          <div className="text-center text-gray-500 font-medium w-full">
            Break
          </div>
        ) : (
          speakers.map(
            (speaker, idx) =>
              speaker && (
                <React.Fragment key={idx}>
                  {/* Separator between speakers (vertical on desktop, horizontal on mobile) */}
                  {idx !== 0 && (
                    <div className="w-full h-[1px] bg-gray-300 my-2 md:hidden"></div> // Mobile separator
                  )}
                  {idx !== 0 && (
                    <div className="hidden md:block w-[1px] bg-gray-300 h-full"></div> // Desktop separator
                  )}

                  <div className="flex flex-col items-center text-center w-full">
                    {/* Speaker Image */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Speaker Info */}
                    <div className="flex flex-col w-full">
                      <div className="text-sm text-gray-600 truncate">
                        {speaker.name}
                      </div>
                      <div className="text-xl font-semibold truncate">
                        {speaker.title}
                      </div>
                      <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                        {speaker.description}
                      </p>

                      {/* Track Tag */}
                      <div className="mt-4 text-xs font-medium uppercase text-white px-2 py-1 rounded bg-primary w-fit mx-auto">
                        {`Track ${speaker.track}`}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
          )
        )}
      </div>
    </div>
  );
}
