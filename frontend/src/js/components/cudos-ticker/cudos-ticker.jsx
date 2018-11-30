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
    delaySum: 0
  };

  addDelay = delay => {
    this.setState(prevState => ({
      delaySum: prevState.delaySum + delay
    }));
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
                  delaySum={this.state.delaySum}
                  addDelay={this.addDelay}
                  recipient={recipient}
                />
              );
            return (
              <CudosRecipientPassenger
                ref={ref => (this.cudosRecieverRefs[index] = ref)}
                key={recipient.id}
                resetNextElement={resetNextElement}
                addDelay={this.addDelay}
                recipient={recipient}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default CudosTicker;
