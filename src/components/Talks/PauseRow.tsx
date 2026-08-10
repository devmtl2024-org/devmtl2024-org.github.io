export default function PauseRow({
  time,
  index,
  text = "Break/Pause",
}: {
  time: string;
  index: number;
  text?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_auto] bg-gray-100 mx-auto w-full max-w-screen-xl">
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center p-4 flex flex-col justify-center w-full md:w-[150px]`}
      >
        <div className="text-lg font-semibold">{time}</div>
      </div>
      <div className="flex items-center justify-center p-4 bg-white w-full border border-dashed border-gray-400">
        <div className="text-center text-gray-600 font-medium text-lg">
          {text}
        </div>
      </div>
    </div>
  );
}
