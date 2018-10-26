import React from "react";
import cn from "class-names";
const User = ({ placement, name, cudos, cudosType }) => (
  <div className={cn("user", { "top-user": placement === 1 })}>
    <div className="user__placement">{placement}</div>
    <div className="user__name">{name.toUpperCase()}</div>
    <div className="user__score">{`${cudos} ${cudosType}`}</div>
  </div>
);

export default User;
