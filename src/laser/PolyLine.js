import makerjs from "makerjs";

function PolyLine({ points, curves }) {
  // console.log(points);

  let polyLine = new makerjs.models.ConnectTheDots(false, points);
  let CurveLine = new makerjs.models.ConnectTheDots(false, curves);
  // var textModel = new makerjs.models.Text('Arial', 'Hello', 100);

  this.origin = [0, 0];

  this.models = {
    polyLine: polyLine,
    CurveLine: CurveLine,
    // textModel: textModel
  };
}

export default PolyLine;
