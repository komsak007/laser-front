import React from "react";
import Blueprint from "react-blueprint-svg";
import PolyLine from "./PolyLine";
import makerjs from "makerjs";
import { Button } from "antd"

// import * as makerjs from 'makerjs'
const BluePrint = ({points}) => {

  let model = new PolyLine({points});

  return (
    <div className="container">
      <div>
        <Blueprint model={model}> </Blueprint>
      </div>
    </div>
  );
}

export default BluePrint;
