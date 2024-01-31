import Manager from "../manager/Manager";
export default function Wizard({ manager }: { manager: Manager }) {
  return (
    <div className="wizard">
      <button className="addBtn" onClick={() => manager.loadPCDFile()}>
        Add PCD file
      </button>
    </div>
  );
}
