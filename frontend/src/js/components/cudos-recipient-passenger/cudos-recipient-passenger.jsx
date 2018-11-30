import React from "react";
import PropTypes from "prop-types";

const timer = {
  startTime: undefined,
  start: () => {
    timer.startTime = new Date();
  },
  end: () => {
    const current = new Date();
    if (timer.startTime > current) console.log(time.startTime, current);
    return current - timer.startTime;
  }
};

class CudosRecipientPassenger extends React.Component {
  static propTypes = {
    addDelay: PropTypes.func
  };

  ref = React.createRef();

  state = {
    translate: 0,
    duration: 0
  };

  resetPassengerTransition = () => {
    const virgin = Boolean(!this.state.translate);
    let nextState = { translate: this.state.translate };

    if (virgin) {
      timer.start();
      nextState = { ...this.pendingState };
    }
    window.requestAnimationFrame(() => {
      this.setState(
        {
          translate: 0
        },

        () => {
          window.requestAnimationFrame(() => {
            this.setState(
              {
                ...nextState
              },
              () => {
                if (virgin) {
                  this.props.addDelay(timer.end());
                }

                if (this.props.resetNextElement)
                  setTimeout(() => {
                    this.props.resetNextElement();
                  }, this.state.delay);
              }
            );
          });
        }
      );
    });
  };

  componentDidMount() {
    const width = this.ref.current.offsetWidth;
    const ratio = width / window.innerWidth;
    const delay = ratio * 10000;

    const duration = ratio * 10 + 10;
    const translate = width + window.innerWidth;

    this.pendingState = {
      translate,
      delay,
      duration
    };
    this.props.addDelay(delay);
  }

  render() {
    let { translate, duration } = this.state;
    const { recipient } = this.props;
    return (
      <div
        ref={this.ref}
        className="cudos-ticker__receiver"
        style={{
          transition: `transform ${translate ? duration : 0}s linear`,
          transform: `translateX(-${translate}px)`
        }}
      >
        <p>{recipient.name}</p>
        <img
          src={`../src/assets/${recipient.cudosType}.png`}
          className="cudos-ticker__icon"
        />
      </div>
    );
  }
}

export default CudosRecipientPassenger;
