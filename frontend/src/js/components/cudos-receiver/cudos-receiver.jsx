import React from "react";

class CudosReceiver extends React.Component {
  cudosRecipientRef = React.createRef();

  componentDidMount() {
    const width = this.cudosRecipientRef.current.offsetWidth;
    this.props.storeElementData(
      width,
      this.cudosRecipientRef,
      this.props.index
    );
    this.props.animateLeft(this.props.index);
    /*setTimeout(() => {
      this.props.loadRecipient();
      this.forceUpdate();
    }, 10000);*/
  }
  componentDidUpdate() {
    //this.props.animateLeft(this.props.);
  }

  render() {
    console.log("testing");
    return (
      <div
        ref={this.cudosRecipientRef}
        className="cudos-ticker__receiver"
        style={{
          transform: `translateX(-${this.props.translate}px)`
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default CudosReceiver;
