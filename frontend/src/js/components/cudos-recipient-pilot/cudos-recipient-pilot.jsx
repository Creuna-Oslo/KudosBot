import React from 'react';
import PropTypes from 'prop-types';

class CudosRecipientPilot extends React.Component {
  static propTypes = {
    animationTimeout: PropTypes.number,
    resetNextElement: PropTypes.func,
    animationTimeout: PropTypes.number,
    addDelay: PropTypes.func,
    recipient: PropTypes.shape({
      name: PropTypes.string,
      cudosType: PropTypes.string,
      id: PropTypes.string
    }),
    additionalTimeout: PropTypes.number,
    clearAdditionalTimeout: PropTypes.func,
    setTransitionDuration: PropTypes.func
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
                  if (this.props.resetNextElement) {
                    this.props.resetNextElement();
                  }
                }, this.state.delay);
                cb();
              }
            );
          });
        }
      );
    });
  };

  delayAnimation = (timeout, duration, totalTimeout = timeout) => {
    this.props.clearAdditionalTimeout();
    this.timeout = setTimeout(() => {
      if (this.props.additionalTimeout) {
        return this.delayAnimation(
          this.props.additionalTimeout,
          duration,
          this.props.additionalTimeout + totalTimeout
        );
      }
      this.resetPilotTransition(this.animationController);
    }, timeout);
  };

  animationController = () => {
    const duration = this.state.duration * 1000;
    const animationTimeout = this.props.animationTimeout;
    const resetTime = Math.max(duration, animationTimeout);

    this.delayAnimation(resetTime, duration);
  };

  waitForImageRender = resolve => {
    const imageWidth = this.ref.current.childNodes[1].offsetWidth;
    if (imageWidth > 0) resolve();
    else setTimeout(() => this.waitForImageRender(resolve), 10);
  };

  componentDidMount() {
    new Promise(this.waitForImageRender).then(() => {
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
      this.props.setTransitionDuration(duration * 1000);
      this.props.addDelay(delay);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
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
