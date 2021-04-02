import React from "react";
import Blueprint from "react-blueprint-svg";
import PolyLine from "./PolyLine";

// import * as makerjs from 'makerjs'
const BluePrint = ({ points, curves }) => {
  let model = new PolyLine({ points, curves });

  return (
    <div className="container">
      <div>
        <Blueprint model={model}> </Blueprint>
      </div>
    </div>
  );
};

export default BluePrint;
