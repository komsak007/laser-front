import makerjs from "makerjs";

function PolyLine({ points }) {
  // console.log(points);

  let polyLine = new makerjs.models.ConnectTheDots(false, points);
  // var textModel = new makerjs.models.Text('Arial', 'Hello', 100);

  this.origin = [0, 0];

  this.models = {
    polyLine: polyLine,
    // textModel: textModel
  };
}

export default PolyLine;
