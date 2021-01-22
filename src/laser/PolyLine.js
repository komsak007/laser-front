import makerjs from "makerjs";

function PolyLine({points}) {
  console.log(points);

  let polyLine = new makerjs.models.ConnectTheDots(points);

  this.origin = [0, 0];

  this.models = {
    polyLine: polyLine
  };
}


export default PolyLine;
