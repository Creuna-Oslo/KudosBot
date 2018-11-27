import React from "react";
import PropTypes from "prop-types";

import CudosReceiver from "../cudos-receiver";
import { resolve } from "url";
import { waitForPrevToMove } from "../../utils/animation";

class CudosTicker extends React.Component {
  static propTypes = {
    cudosReceivers: PropTypes.array,
    clearRecipients: PropTypes.func
  };

  readyForRecipient = true;
  pendingRecipients = [];

  cudosRecieverRefs = [];

  state = {
    recipients: [],
    delaySum: 0
  };
  /*
  componentDidUpdate() {
    if (this.props.cudosReceivers.length !== 0) {
      this.pendingRecipients = this.props.cudosReceivers;
      if (this.state.recipients.length === 0) this.addRecipients();
    }
  }
*/
  addDelay = delay => {
    this.setState(prevState => ({
      delaySum: prevState.delaySum + delay
    }));
  };

  addRecipients = () => {
    this.setState({
      recipients: this.state.recipients.concat(...this.pendingRecipients)
    });

    this.pendingRecipients = [];
    this.props.clearRecipients();
  };

  tryAddingRecipients = () => {
    if (this.readyForRecipient) {
      console.log("adding recipient");
      this.setState({
        recipients: this.state.recipients.concat(...this.pendingRecipients)
      });

      this.pendingRecipients = [];
      this.props.clearRecipients();
    }
  };

  pendRecipients = recipients => {
    this.pendingRecipients = recipients;
    this.tryAddingRecipients();
  };
  /*
  storeElementData = (width, index) => {
    const recipient = JSON.parse(JSON.stringify(this.state.recipients[index]));

    recipient.width = width;
    const ratio = width / window.innerWidth;
    const wait = ratio * 10000;
    recipient.wait = wait;
    recipient.transitionTime = wait / 1000 + 10;
    this.updateRecipients(recipient, index);
  };
*/
  updateRecipients = (recipient, index, cb) => {
    this.setState(
      prevState => ({
        recipients: [
          ...prevState.recipients.slice(0, index),
          recipient,
          ...prevState.recipients.slice(index + 1)
        ]
      }),
      () => {
        if (cb) cb();
      }
    );
  };
  /*
  resetTranslate = (recipient, index) => {
    recipient.translate = 0;
    setTimeout(() => {
      this.updateRecipients(recipient, index);
    }, recipient.transitionTime * 1000);
  };

  animateLeft = index => {
    const prevRecipient = this.state.recipients[index - 1];
    const wait = prevRecipient ? prevRecipient.wait : 0;

    const recipient = JSON.parse(JSON.stringify(this.state.recipients[index]));
    recipient.translate = recipient.width + window.innerWidth;

    setTimeout(() => {
      this.updateRecipients(recipient, index, () => {
        if (index < this.state.recipients.length - 1) {
          this.animateLeft(index + 1);
        }
        this.resetTranslate(JSON.parse(JSON.stringify(recipient)), index);
      });
    }, wait);
  };
*/
  render() {
    return (
      <div className="cudos-ticker">
        <div className="cudos-ticker__inner">
          {this.props.cudosReceivers.map((recipient, index) => {
            const animateNext = this.cudosRecieverRefs[index + 1]
              ? this.cudosRecieverRefs[index + 1].loop
              : null;
            return (
              <CudosReceiver
                ref={ref => (this.cudosRecieverRefs[index] = ref)}
                key={recipient.id}
                animateNext={animateNext}
                delaySum={this.state.delaySum}
                addDelay={this.addDelay}
                addRecipients={this.addRecipients}
                index={index}
              >
                <p>{recipient.name}</p>
                <img
                  src={`../src/assets/${recipient.cudosType}.png`}
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
