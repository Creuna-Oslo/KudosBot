import React from "react";
import FlipMotion from "react-flip-motion";

import User from "../user";

const convertToDisplayName = cudosType => {
  const cudosTypes = {
    tada: "confetti",
    unicorn_face: "unicorn",
    avocado: "avocado"
  };
  return cudosTypes[cudosType];
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
                key={user.id}
                className={`${className}__top-user`}
                placement={index + 1}
                name={user.id}
                cudos={user[className]}
                cudosType={convertToDisplayName(className)}
              />
            );
          })}
        </FlipMotion>
      </div>
    </div>
  );
};
export default TopThree;
