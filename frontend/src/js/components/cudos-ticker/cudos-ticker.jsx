import React from "react";
import { rollingText } from "../../utils/keyframes";

import CudosReceiver from "../cudos-receiver";

class CudosTicker extends React.Component {
  state = {
    paddingLeft: []
  };
  cudosReceiverRef = React.createRef();

  addCudosReceiverPadding = () => {
    console.log(this.cudosReceiverRef.current);
    /*this.setState({
      paddingLeft: paddingLeft.concat(this.cudosReceiverRef.current)
    });*/
  };

  componentDidMount() {
    setTimeout(() => console.log(this.cudosReceiverRef.current), 300);
  }
  addReceiver = user => {
    const cudosReceivers = this.state.cudosReceivers;
    cudosReceivers.push(user);
    this.setState({
      cudosReceivers
    });
  };
  __Add = () => {
    const user = {
      name: "ATLE!!",
      cudosType: "avocado"
    };
    this.addReceiver(user);
  };
  render() {
    console.log(this.state.paddingLeft);
    return (
      <div className="cudos-ticker">
        <div className="cudos-ticker__inner">
          {this.props.cudosReceivers.map((receiver, index) => {
            return (
              <CudosReceiver
                className="cudos-ticker__receiver"
                key={index}
                ref={this.cudosReceiverRef}
                addCudosReceiverPadding={this.addCudosReceiverPadding}
                rollingText={rollingText(window.innerWidth)}
              >
                <p>{receiver.name}</p>
                <img
                  src={`../src/assets/${receiver.cudosType}.png`}
                  className="cudos-ticker__icon"
                />
              </CudosReceiver>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CudosTicker;
