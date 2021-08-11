import makerjs from "makerjs";

function PolyLine({ points, curves, anglePoint }) {
  // console.log(angle);

  let polyLine = new makerjs.models.ConnectTheDots(false, points);
  let CurveLine = new makerjs.models.ConnectTheDots(false, curves);
  var star = new makerjs.model.rotate(polyLine, 360 - anglePoint);
  // var textModel = new makerjs.models.Text('Arial', 'Hello', 100);

  this.origin = [0, 0];

  this.models = {
    // polyLine: polyLine,
    CurveLine: CurveLine,
    star: star,
    // textModel: textModel
  };
}

export default PolyLine;
