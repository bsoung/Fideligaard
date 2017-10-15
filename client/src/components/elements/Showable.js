import React from "react";

const Showable = ({ condition, children }) =>
  condition ? <div>{children}</div> : null;

export default Showable;
