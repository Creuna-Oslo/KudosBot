import React from "react";
import {
  getAll,
  requestLoop,
  MOCKgetAll,
  MOCKresetCudos,
  MOCKrequestLoop,
  MOCKgiveCudos
} from "../../utils/api-helper.js";

import TopThree from "../top-three";
import CudosTicker from "../cudos-ticker";

class Display extends React.Component {
  state = {
    isLoading: true,
    cudosReceivers: []
  };
  componentDidMount() {
    /*getAll().then(userLists => {
      this.setState({
        isLoading: false,
        ...userLists
      });
      requestLoop(userLists, (cudosReceiver, userLists) => {
        this.setState({ cudosReceiver, ...userLists });
      });
    });*/
    MOCKgetAll().then(userLists => {
      this.setState({
        isLoading: false,
        ...userLists
      });
      MOCKrequestLoop(userLists, (cudosReceiver, userLists) => {
        const cudosReceivers = this.state.cudosReceivers;
        cudosReceivers.push(cudosReceiver);
        this.setState({ cudosReceivers, ...userLists });
      });
    });
  }
  __giveCudos() {
    MOCKgiveCudos();
  }
  __resetCudos() {
    MOCKresetCudos();
  }
  render() {
    console.log(this.state);
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="cudos">
          <CudosTicker
            ref={ref => (this.ref = ref)}
            cudosReceivers={this.state.cudosReceivers}
          />
          <div className="cudos-display">
            <button onClick={() => this.__giveCudos()} />
            <TopThree
              className={"unicorn_face"}
              ranking={this.state.topUnicorn_face.slice(0, 3)}
            />
            <TopThree
              className={"avocado"}
              ranking={this.state.topAvocado.slice(0, 3)}
            />
            <TopThree
              className={"tada"}
              ranking={this.state.topTada.slice(0, 3)}
            />
            <button onClick={() => this.__resetCudos()} />
          </div>
        </div>
      );
    }
  }
}

export default Display;
