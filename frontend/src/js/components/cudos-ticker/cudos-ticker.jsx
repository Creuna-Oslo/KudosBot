import React from "react";

import CudosReceiver from "../cudos-receiver";
import { resolve } from "url";

class CudosTicker extends React.Component {
  prevRecipientsTimeToMove = 0;
  readyForRecipient = true;
  pendingRecipients = [];
  recipients = [];

  componentDidUpdate() {
    if (this.props.cudosReceivers.length !== 0) {
      this.pendRecipients(this.props.cudosReceivers);
    }
  }
  tryAddingRecipients = () => {
    if (this.readyForRecipient) {
      this.recipients.push(...this.pendingRecipients);
      this.pendingRecipients = [];
      this.props.clearRecipients();
    }
  };

  pendRecipients = recipients => {
    this.pendingRecipients = recipients;
    this.tryAddingRecipients();
  };

  storeElementData = (width, ref, index) => {
    this.recipients[index].translate = width * window.innerWidth;
    this.recipients[index].ref = ref;
  };
  animateLeft = index => {
    const ratio = eleWidth / windowWidth;
    const wait = ratio / 10000;

    setTimeout(() => this.forceUpdate(), this.prevRecipientsTimeToMove);
    this.prevRecipientsTimeToMove = wait;
  };
  waitForPrevToMove = (wait, index, cb) => {
    if (recipientsTimeToMove[index] !== wait) recipientsTimeToMove.push();
    recipientsTimeToMove.map(ms => {
      const promise = new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), ms);
      });
    });
  };
  render() {
    console.log(this.recipients);
    return (
      <div className="cudos-ticker">
        <div className="cudos-ticker__inner">
          {this.recipients.map((recipient, index) => {
            return (
              <CudosReceiver
                key={recipient.id}
                index={index}
                storeElementData={this.storeElementData}
                loadRecipient={this.loadRecipient}
                animateLeft={this.animateLeft}
                translate={recipient.translate}
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
