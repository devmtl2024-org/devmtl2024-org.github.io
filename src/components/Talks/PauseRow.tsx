export default function PauseRow({
  time,
  index,
}: {
  time: string;
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
      <div className="flex items-center justify-center p-6 bg-white w-full border border-dashed border-gray-400">
        <div className="text-center text-gray-600 font-medium text-xl">
          Break/Pause
        </div>
      </div>
    </div>
  );
}