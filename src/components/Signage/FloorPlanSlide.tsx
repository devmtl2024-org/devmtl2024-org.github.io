import { Slide, SlideHeader } from "./Slide";
import { trackLabel } from "./trackLabel";

// Traced from Concordia's floor plan, in its own pixel coordinates (1830×1230), then tidied up:
// rooms touch the hallway they open on, so the map has no gap to puzzle over.
// Attendees know the rooms by track: Concordia's names (9A, 9B-C, 9D) stay off the map,
// and the rooms are drawn equal so every track gets the same weight.
const TRACK_ROOMS = [
  { x: 670, width: 380 },
  { x: 1050, width: 380 },
  { x: 1430, width: 380 },
];
// On both sides of the hallway that leads to them
const ELEVATORS = [
  { x: 180, width: 240 },
  { x: 515, width: 230 },
];
// Rooms share their edges: one white stroke keeps those edges from looking doubled or shifted
const STROKE = 6;

export function FloorPlanSlide() {
  return (
    <Slide id="plan" reel="infos" seconds={15}>
      <SlideHeader fr="Plan des lieux" en="Venue map" />
      <div className="flex flex-1 items-center justify-center px-16 pb-14">
        <svg
          viewBox="0 0 1830 1230"
          className="h-[860px] w-auto shrink-0"
          fontFamily="Archivo"
        >
          <polygon
            points="55,450 1810,450 1810,560 515,560 515,910 420,910 420,560 55,560"
            className="fill-primary-light stroke-white"
            strokeWidth={STROKE}
          />
          <text
            x="1200"
            y="518"
            className="fill-white text-[30px]"
            textAnchor="middle"
          >
            Couloir · Hallway
          </text>

          <Room x={315} y={65} width={355} height={385} variant="amenity">
            <tspan x={492} y={160} className="text-[50px] font-black">
              Lobby
            </tspan>
            <tspan x={492} y={250} className="text-[36px] font-semibold">
              Accueil
            </tspan>
            <tspan x={492} y={310} className="text-[36px] font-semibold">
              Café
            </tspan>
            <tspan x={492} y={370} className="text-[36px] font-semibold">
              Commanditaires
            </tspan>
          </Room>

          {TRACK_ROOMS.map((room, index) => {
            const { track, audience } = trackLabel(index);
            const center = room.x + room.width / 2;

            return (
              <Room
                key={track}
                x={room.x}
                y={65}
                width={room.width}
                height={385}
                variant="track"
              >
                <tspan x={center} y={230} className="text-[64px] font-black">
                  {track}
                </tspan>
                <tspan
                  x={center}
                  y={310}
                  className="fill-secondary-dark text-[44px] font-bold"
                >
                  {audience}
                </tspan>
              </Room>
            );
          })}

          {TRACK_ROOMS.slice(1).map((room) => (
            <line
              key={room.x}
              x1={room.x}
              y1={65 + STROKE / 2}
              x2={room.x}
              y2={450 - STROKE / 2}
              className="stroke-primary-dark"
              strokeWidth={STROKE}
            />
          ))}

          {ELEVATORS.map((elevator) => (
            <Room
              key={elevator.x}
              x={elevator.x}
              y={560}
              width={elevator.width}
              height={350}
              variant="utility"
            >
              <tspan
                x={elevator.x + elevator.width / 2}
                y={725}
                className="text-[30px]"
              >
                Ascenseurs
              </tspan>
              <tspan
                x={elevator.x + elevator.width / 2}
                y={770}
                className="text-[30px]"
              >
                Elevators
              </tspan>
            </Room>
          ))}
          <Room x={55} y={560} width={125} height={260} variant="amenity">
            <tspan x={117} y={705} className="text-[40px] font-black">
              WC
            </tspan>
          </Room>

          <polygon
            points="915,560 1385,560 1385,910 1625,910 1625,1110 915,1150"
            className="fill-secondary stroke-white"
            strokeWidth={STROKE}
          />
          <text
            textAnchor="middle"
            className="fill-primary-dark text-[72px] font-black"
          >
            <tspan x={1150} y={725}>
              Repas
            </tspan>
            <tspan x={1150} y={805}>
              Lunch
            </tspan>
          </text>
        </svg>
      </div>
    </Slide>
  );
}

type RoomProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  variant: "track" | "amenity" | "utility";
  children: React.ReactNode;
};

// Talks in white (split by navy lines), amenities (lobby, WC, lunch) in orange, utilities in blue
const ROOM_STYLES = {
  track: "fill-white stroke-white",
  amenity: "fill-secondary stroke-white",
  utility: "fill-primary-light stroke-white",
};

const TEXT_STYLES = {
  track: "fill-primary-dark",
  amenity: "fill-primary-dark",
  utility: "fill-white",
};

function Room({ x, y, width, height, variant, children }: RoomProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className={ROOM_STYLES[variant]}
        strokeWidth={STROKE}
      />
      <text textAnchor="middle" className={TEXT_STYLES[variant]}>
        {children}
      </text>
    </g>
  );
}
