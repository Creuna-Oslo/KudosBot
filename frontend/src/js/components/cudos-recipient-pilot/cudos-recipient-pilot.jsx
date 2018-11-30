import React from "react";
import PropTypes from "prop-types";

class CudosRecipientPilot extends React.Component {
  static propTypes = {
    delaySum: PropTypes.number,
    addDelay: PropTypes.func
  };

  ref = React.createRef();

  state = {
    translate: 0,
    duration: 0
  };

  resetPilotTransition = cb => {
    const translate = this.state.translate;
    window.requestAnimationFrame(() => {
      this.setState(
        {
          translate: 0
        },

        () => {
          window.requestAnimationFrame(() => {
            this.setState(
              {
                translate
              },
              () => {
                setTimeout(() => {
                  if (this.props.resetNextElement)
                    this.props.resetNextElement();
                }, this.state.delay);
                cb();
              }
            );
          });
        }
      );
    });
  };

  getAdditionalDelay = (delay, startDelaySum, duration) => {
    if (this.props.delaySum < duration) return null;
    if (startDelaySum < duration) return this.props.delaySum - duration;
    return this.props.delaySum - delay;
  };

  delayAnimation = (delay, duration, totalDelay = delay) => {
    const startDelaySum = this.props.delaySum;
    setTimeout(() => {
      const additionalDelay = this.getAdditionalDelay(
        totalDelay || delay,
        startDelaySum,
        duration
      );
      if (additionalDelay) {
        return this.delayAnimation(
          additionalDelay,
          duration,
          additionalDelay + totalDelay
        );
      }

      this.resetPilotTransition(this.animationController);
    }, delay);
  };

  animationController = () => {
    const duration = this.state.duration * 1000;
    const delaySum = this.props.delaySum;
    const resetTime = Math.max(duration, delaySum);

    this.delayAnimation(resetTime, duration);
  };

  componentDidMount() {
    const width = this.ref.current.offsetWidth;
    const ratio = width / window.innerWidth;
    const delay = ratio * 10000;

    const duration = ratio * 10 + 10;
    const translate = width + window.innerWidth;

    this.setState(
      {
        translate,
        delay,
        duration
      },
      () => {
        this.animationController();
      }
    );
    this.props.addDelay(delay);
  }

  render() {
    const { recipient } = this.props;
    return (
      <div
        ref={this.ref}
        className="cudos-ticker__receiver"
        style={{
          transition: `transform ${
            this.state.translate ? this.state.duration : 0
          }s linear`,
          transform: `translateX(-${this.state.translate}px)`
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

export default CudosRecipientPilot;
