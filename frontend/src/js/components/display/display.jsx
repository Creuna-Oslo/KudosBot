import React from 'react';
import {
  getAll,
  requestLoop,
  MOCKgetAll,
  MOCKresetCudos,
  MOCKrequestLoop,
  MOCKgiveCudos
} from '../../utils/api-helper.js';

import TopThree from '../top-three';
import CudosTicker from '../cudos-ticker';

class Display extends React.Component {
  state = {
    isLoading: true,
    cudosRecipients: []
  };
  componentDidMount() {
    MOCKgetAll().then(data => {
      this.setState({
        isLoading: false,
        ...data.userLists,
        cudosRecipients: data.cudosRecipients
      });
      MOCKrequestLoop((userLists, cudosRecipients) => {
        this.setState({
          cudosRecipients,
          ...userLists
        });
      });
    });
  }
  __giveCudos() {
    MOCKgiveCudos();
  }
  __resetCudos() {
    MOCKresetCudos();
  }
  clearRecipients = () => {
    this.setState({
      cudosRecipients: []
    });
  };
  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="cudos">
          <CudosTicker
            ref={ref => (this.ref = ref)}
            cudosRecipients={this.state.cudosRecipients}
          />
          <div className="cudos-display">
            <button onClick={() => this.__giveCudos()} />
            <TopThree
              className={'unicorn_face'}
              ranking={this.state.topUnicorn_face.slice(0, 3)}
            />
            <TopThree
              className={'avocado'}
              ranking={this.state.topAvocado.slice(0, 3)}
            />
            <TopThree
              className={'tada'}
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
