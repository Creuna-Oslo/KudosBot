import React from "react";
import PropTypes from "prop-types";

import CudosRecipientPassenger from "../cudos-recipient-passenger";
import CudosRecipientPilot from "../cudos-recipient-Pilot";

class CudosTicker extends React.Component {
  static propTypes = {
    cudosReceivers: PropTypes.array
  };

  cudosRecieverRefs = [];

  state = {
    recipients: [],
    animationTimeout: 0,
    additionalTimeout: 0,
    transitionDuration: 0
  };

  addDelay = (delay, cb) => {
    let newTimeout;
    this.setState(
      prevState => {
        newTimeout = prevState.animationTimeout + delay;

        return {
          animationTimeout: newTimeout
        };
      },
      () => {
        if (cb) cb(newTimeout);
      }
    );
  };

  addAdditionalTimeout = additionalTimeout => {
    this.setState(prevState => ({
      additionalTimeout: prevState.additionalTimeout + additionalTimeout
    }));
  };

  clearAdditionalTimeout = () => {
    this.setState({
      additionalTimeout: 0
    });
  };

  setTransitionDuration = duration => {
    this.setState({ transitionDuration: duration });
  };

  render() {
    return (
      <div className="cudos-ticker">
        <div className="cudos-ticker__inner">
          {this.props.cudosReceivers.map((recipient, index) => {
            const resetNextElement = this.cudosRecieverRefs[index + 1]
              ? this.cudosRecieverRefs[index + 1].resetPassengerTransition
              : null;
            if (index === 0)
              return (
                <CudosRecipientPilot
                  key={recipient.id}
                  resetNextElement={resetNextElement}
                  animationTimeout={this.state.animationTimeout}
                  addDelay={this.addDelay}
                  recipient={recipient}
                  additionalTimeout={this.state.additionalTimeout}
                  clearAdditionalTimeout={this.clearAdditionalTimeout}
                  setTransitionDuration={this.setTransitionDuration}
                />
              );
            return (
              <CudosRecipientPassenger
                ref={ref => (this.cudosRecieverRefs[index] = ref)}
                key={recipient.id}
                resetNextElement={resetNextElement}
                addDelay={this.addDelay}
                recipient={recipient}
                addAdditionalTimeout={this.addAdditionalTimeout}
                transitionDuration={this.state.transitionDuration}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default CudosTicker;
