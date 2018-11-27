import React from "react";
import PropTypes from "prop-types";

class CudosReceiver extends React.Component {
  static propTypes = {
    delaySum: PropTypes.number,
    addDelay: PropTypes.func,
    index: PropTypes.number
  };

  ref = React.createRef();

  state = {
    translate: 0,
    duration: 0,
    restartAnimation: 0
  };

  loop = cb => {
    const nextState = this.state.translate
      ? { translate: this.state.translate }
      : { ...this.pendingState };
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
                setTimeout(() => {
                  if (this.props.animateNext) this.props.animateNext();
                }, this.state.delay);

                if (cb) {
                  cb();
                }
              }
            );
          });
        }
      );
    });
  };

  getAdditionalDelay = recieversDidCoverScreen => {
    const recieversCoverScreen = Boolean(
      this.props.delaySum + this.state.delay > this.state.duration * 1000
    );
    if (!recieversDidCoverScreen && recieversCoverScreen) {
    }
  };

  animationController = () => {
    const transitionDuration = this.state.duration * 1000;
    const delaySum = this.props.delaySum + this.state.delay;
    const resetTime = Math.max(transitionDuration, delaySum);

    const delayAnimation = delay => {
      const recieversCoverScreen = Boolean(
        this.props.delaySum + this.state.delay > this.state.duration * 1000
      );

      const delaySum = this.props.delaySum;

      setTimeout(() => {
        this.getAdditionalDelay(recieversCoverScreen);
        const additionalDelay = recieversCoverScreenAfterTimeout
          ? this.props.delaySum - delaySum
          : null;

        console.log("timeout, delay", additionalDelay);

        console.log("timeout, delay + props", delaySum, this.props.delaySum);
        if (additionalDelay) return delayAnimation(additionalDelay);

        this.loop(this.animationController);
      }, delay);
    };
    delayAnimation(resetTime);
  };

  componentDidMount() {
    const width = this.ref.current.offsetWidth;
    const ratio = width / window.innerWidth;
    const delay = ratio * 10000;
    this.props.addDelay(delay);
    const duration = ratio * 10 + 10;
    const translate = width + window.innerWidth;

    if (this.props.index === 0) {
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
    } else {
      this.pendingState = {
        translate,
        delay,
        duration
      };
    }
  }

  render() {
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
        {this.props.children}
      </div>
    );
  }
}

export default CudosReceiver;
