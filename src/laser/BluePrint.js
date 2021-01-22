import React from "react";
import Blueprint from "react-blueprint-svg";
import PolyLine from "./PolyLine";
import makerjs from "makerjs";
import { Button } from "antd"

// import * as makerjs from 'makerjs'

const BluePrint = ({points}) => {

  const download = (data, filename, type) => {
       var file = new Blob([data], {type: type});
       if (window.navigator.msSaveOrOpenBlob) // IE10+
           window.navigator.msSaveOrOpenBlob(file, filename);
       else { // Others
           var a = document.createElement("a"),
                   url = URL.createObjectURL(file);
           a.href = url;
           a.download = filename;
           document.body.appendChild(a);
           a.click();
           setTimeout(function() {
               document.body.removeChild(a);
               window.URL.revokeObjectURL(url);
           }, 0);
       }
   }

  let model = new PolyLine({points});

  //export DXF
  const filename = "Save DXF";
  const file = makerjs.exporter.toDXF(model);

  return (
    <div className="container">
      <div>
      <Button type="primary" onClick={download(file, "output.dxf", "dxf")}>
        Save dfx
      </Button>
        <Blueprint model={model}> </Blueprint>
      </div>
    </div>
  );
}

export default BluePrint;
