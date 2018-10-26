import React from "react";
import styled from "styled-components";

const StyledCudosReceiver = styled.div`
  animation: ${props => props.rollingText} 10s linear infinite;
`;

class CudosReceiver extends React.Component {
  componentDidMount() {
    setTimeout(() => this.props.addCudosReceiverPadding(), 500);
  }

  render() {
    return (
      <StyledCudosReceiver
        rollingText={this.props.rollingText}
        className={this.props.className}
      >
        {this.props.children}
      </StyledCudosReceiver>
    );
  }
}

export default CudosReceiver;
