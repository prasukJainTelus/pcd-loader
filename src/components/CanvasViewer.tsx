import React from "react";
import Manager from "../manager/Manager";
import Wizard from "./Wizard";

interface IState {
  manager?: Manager;
}

class CanvasViewer extends React.Component<{}, IState> {
  rootRef: React.RefObject<HTMLDivElement>;
  constructor(props = {}) {
    super(props);
    this.rootRef = React.createRef();
    this.state = { manager: undefined };
  }
  componentDidMount(): void {
    if (!this.rootRef.current) return;
    const manager = new Manager(this.rootRef.current);
    setInterval(() => manager.animate(), 100);
    this.setState({ manager });
  }

  render() {
    return (
      <div>
        <div ref={this.rootRef} id="root"></div>
        {this.state.manager && <Wizard manager={this.state.manager} />}
      </div>
    );
  }
}

export default CanvasViewer;
