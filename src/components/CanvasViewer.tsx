import React from "react";
import Manager from "../manager/Manager";
import Wizard from "./Wizard";
import Loader from "./Loader";

interface IState {
  manager?: Manager;
  loader: number;
}

class CanvasViewer extends React.Component<{}, IState> {
  rootRef: React.RefObject<HTMLDivElement>;
  constructor(props = {}) {
    super(props);
    this.rootRef = React.createRef();
    this.state = { manager: undefined, loader: 0 };
  }
  componentDidMount(): void {
    if (!this.rootRef.current) return;
    const manager = new Manager(this.rootRef.current);
    manager.onLoaderUpdated = (loader: number) => this.setState({ loader });
    setInterval(() => manager.animate(), 100);
    this.setState({ manager });
  }

  render() {
    return (
      <div>
        <div ref={this.rootRef} id="root_canvas"></div>
        {this.state.manager && (
          <>
            <Wizard manager={this.state.manager} />
            {this.state.loader && <Loader perc={this.state.loader} />}
          </>
        )}
      </div>
    );
  }
}

export default CanvasViewer;
