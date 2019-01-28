import React from 'react';
import PropTypes from 'prop-types';
import FlipMotion from 'react-flip-motion';

import User from '../user';

const cudosTypes = {
  tada: 'confetti',
  unicorn_face: 'unicorn',
  avocado: 'avocado'
};

const TopThree = ({ className, ranking }) => {
  return (
    <div className={`top-three__container`}>
      <div className={className}>
        <img src={`../src/assets/${className}.png`} className="icon" />
        <FlipMotion>
          {ranking.map((user, index) => {
            return (
              <User
                key={user._id}
                className={`${className}__top-user`}
                placement={index + 1}
                name={user.id}
                cudos={user[className]}
                cudosType={cudosTypes[className]}
              />
            );
          })}
        </FlipMotion>
      </div>
    </div>
  );
};

TopThree.propTypes = {
  className: PropTypes.string,
  ranking: PropTypes.array
};

export default TopThree;
