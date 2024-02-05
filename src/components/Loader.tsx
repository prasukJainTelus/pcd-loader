export default function Loader({ perc }: { perc: number }) {
  return (
    <div className="offset">
      <div className="loading">{perc}% loaded</div>
    </div>
  );
}
