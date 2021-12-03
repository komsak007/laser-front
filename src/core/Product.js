import React, { useState, useEffect, Fragment, useRef } from "react";
import { read } from "./apiCore";
import BluePrint from "../laser/BluePrint";
import {
  Stage,
  Layer,
  Line,
  Rect,
  Text,
  Tag,
  Label,
  Circle,
} from "react-konva";
import Menu from "../core/Menu";
import PolyLine from "../laser/PolyLine";
import makerjs from "makerjs";
import { toast } from "react-toastify";
import { DownloadOutlined } from "@ant-design/icons";
import { Affix, Checkbox, Button, Card, Tabs } from "antd";
import { Carousel } from "react-responsive-carousel";
import { isAuthenticated } from "../auth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import saveAs from "save-as";
import JSZip from "jszip";

var SCENE_BASE_WIDTH = window.innerWidth;
var SCENE_BASE_HEIGHT = window.innerHeight;

var anglePoint;

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [lines, setLines] = useState([]);
  const [top] = useState(10);
  const [points, setPoints] = useState([]);
  const [curves, setCurves] = useState([]);
  const [order, setOrder] = useState("");
  const [stageX] = useState(0);
  const [stageY] = useState(0);
  const [stageScale] = useState(1);
  const [curMousePos] = useState([0, 0]);
  const [isFinished] = useState(true);
  const [checkDxf, setCheckDxf] = useState(false);
  const [checkProduct, setCheckProduct] = useState(false);

  const { images } = product;

  const stageRef = useRef(null);

  useEffect(() => {
    loadProduct();
    console.log(pointFinal);
  }, []);

  let xFinal, yFinal;
  let overX = 0,
    overY = 0,
    temp = 0;
  let x = 0,
    y = 0;
  let pointFinal = [];
  let overPoint = [];
  let calPoint = 1;
  points.map((p) => {
    xFinal = p[0] / 6.67456569;
    yFinal = p[1] / 6.67456569;
    pointFinal.push([xFinal, yFinal]);
    // console.log(pointFinal);
  });

  x = 0;
  y = 0;

  for (let i = 0; i < pointFinal.length; i++) {
    // console.log(pointFinal[i][j]);
    calPoint = 1;
    if (
      pointFinal[i][0] > window.innerWidth / 2 ||
      pointFinal[i][0] + window.innerWidth / 2 < 0
    ) {
      // overX = 1;
      if (pointFinal[i][0] < 0) {
        x = 1;
        temp = pointFinal[i][0] / -(window.innerWidth / 2);
        if (temp > overX) {
          overX = temp;
          overY = overX;
        }
      } else {
        x = 1;
        temp = pointFinal[i][0] / window.innerWidth / 2;
        if (temp > overX) {
          overX = temp;
          overY = overX;
        }
      }
    }

    if (
      pointFinal[i][1] > window.innerHeight / 2 ||
      pointFinal[i][1] + window.innerHeight / 2 < 0
    ) {
      if (pointFinal[i][1] < 0) {
        y = 1;
        temp = pointFinal[i][1] / -(window.innerHeight / 2);
        if (temp > overY) {
          overY = temp;
          overX = overY;
        }
      } else {
        y = 1;
        temp = pointFinal[i][1] / window.innerHeight / 2;
        if (temp > overY) {
          overY = temp;
          overX = overY;
        }
      }
    }
  }
  // console.log("overX = ", overX, "overY = ", overY);

  // calPoint = 1;
  if (x == 1) {
    if (overX >= 0.41 || overY >= 0.41) {
      calPoint = 2;
    }
  } else if (y == 1) {
    if (overX >= 0.272 || overY >= 0.272) {
      calPoint = 2;
    }
  }

  if (calPoint == 2) {
    overPoint = pointFinal;
    pointFinal = [];

    // calPoint = 1.5;

    overPoint.map((p1) => {
      xFinal = p1[0] / calPoint;
      yFinal = p1[1] / calPoint;
      pointFinal.push([xFinal, yFinal]);
    });
  } else {
    overPoint.map((p1) => {
      xFinal = p1[0] / calPoint;
      yFinal = p1[1] / calPoint;
      pointFinal.push([xFinal, yFinal]);
    });

    if (!pointFinal[0] || !pointFinal[1]) {
      console.log("wait");
    } else {
      anglePoint =
        (Math.atan2(
          pointFinal[1][1] - pointFinal[0][1],
          pointFinal[1][0] - pointFinal[0][0]
        ) *
          180) /
        Math.PI;

      // console.log(anglePoint);
    }
  }

  // Curve
  let xCurveFinal, yCurveFinal;
  let curveFinal = [],
    curveOver = [];
  let overCurveX = 0,
    overCurveY = 0,
    tempCurve = 0;
  let xCurve = 0,
    yCurve = 0;
  let calCurve = 1;

  curves.map((p) => {
    xCurveFinal = p[0] / 6.67456569;
    yCurveFinal = p[1] / 6.67456569;
    curveFinal.push([xCurveFinal, yCurveFinal]);
  });

  // console.log(curveFinal);
  xCurve = 0;
  yCurve = 0;

  for (let i = 0; i < curveFinal.length; i++) {
    // console.log(curveFinal[i][0]);
    if (
      curveFinal[i][0] > window.innerWidth / 2 ||
      curveFinal[i][0] + window.innerWidth / 2 < 0
    ) {
      // overX = 1;
      if (curveFinal[i][0] < 0) {
        xCurve = 1;
        tempCurve = curveFinal[i][0] / -(window.innerWidth / 2);
        if (tempCurve > overCurveX) {
          overCurveX = tempCurve;
          overCurveY = overCurveX;
        }
      } else {
        xCurve = 1;
        tempCurve = curveFinal[i][0] / window.innerWidth / 2;
        if (tempCurve > overCurveX) {
          overCurveX = tempCurve;
          overCurveY = overCurveX;
        }
      }
    }

    if (
      curveFinal[i][1] > window.innerHeight / 2 ||
      curveFinal[i][1] + window.innerHeight / 2 < 0
    ) {
      if (curveFinal[i][1] < 0) {
        yCurve = 1;
        tempCurve = curveFinal[i][1] / -(window.innerHeight / 2);
        if (tempCurve > overCurveY) {
          overCurveY = tempCurve;
          overCurveX = overCurveY;
        }
      } else {
        yCurve = 1;
        tempCurve = curveFinal[i][1] / window.innerHeight / 2;
        if (tempCurve > overCurveY) {
          overCurveY = tempCurve;
          overCurveX = overCurveY;
        }
      }
    }
  }

  if (calPoint >= 2) {
    calCurve = calPoint;
  }

  // calCurve = 1;
  if (xCurve == 1) {
    if (overCurveX >= 0.41 || overCurveY >= 0.41) {
      calCurve = 2;
    }
  } else if (yCurve == 1) {
    if (overCurveX >= 0.272 || overCurveY >= 0.272) {
      calCurve = 2;
    }
  }

  if (calCurve >= 2) {
    curveOver = curveFinal;
    curveFinal = [];
    curveOver.map((p1) => {
      xCurveFinal = p1[0] / calCurve;
      yCurveFinal = p1[1] / calCurve;
      curveFinal.push([xCurveFinal, yCurveFinal]);
    });
  } else {
    curveOver.map((p1) => {
      xCurveFinal = p1[0] / calCurve;
      yCurveFinal = p1[1] / calCurve;
      curveFinal.push([xCurveFinal, yCurveFinal]);
    });
  }

  let model = new PolyLine({ points, curves, anglePoint });

  //export DXF
  const filename = "Save DXF";
  const file = makerjs.exporter.toDXF(model);

  const loadProduct = () => {
    read(match.params.productId).then((res) => {
      console.log(res.lines);
      setPoints(res.point);
      setCurves(res.curve);
      setLines(res.lines);
      setOrder(res.order);
      setProduct(res);
    });
    toast.success("Load data success");
    // console.log(match.params.productId);
  };

  const clearMark = () => {
    setLines([]);
    toast.error("Clear mark");
  };

  const flattenedPoints = pointFinal
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  const flattenedCurves = curveFinal
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  const scale = Math.min(
    window.innerWidth / SCENE_BASE_WIDTH,
    window.innerHeight / SCENE_BASE_HEIGHT
  );

  const textLabel = (points) => {
    let lpoint = [];

    for (let i = 0; i < points.length - 1; i++) {
      let dx = points[i + 1][0] - points[i][0];
      let dy = points[i + 1][1] - points[i][1];
      let x = points[i][0] + dx / 2;
      let y = points[i][1] + dy / 2;
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.006570005;
      let l =
        Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.006517005 * calPoint;
      // let l = (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))*42);
      let angle = Math.atan(Math.abs(dy) / Math.abs(dx));

      if (dy === 0 && dx >= 0);
      else if (dy >= 0 && dx <= 0) angle = Math.PI + angle;
      else if (dy <= 0 && dx <= 0) angle = Math.PI - angle;
      else if (dy <= 0 && dx >= 0) angle = 2 * Math.PI - angle;
      else;

      let direction = "none";

      if (
        (angle >= 0 && angle <= Math.PI / 4) ||
        angle >= 2 * Math.PI - Math.PI / 4
      )
        direction = "left";
      else if (angle < (3 * Math.PI) / 4) direction = "down";
      else if (angle < (5 * Math.PI) / 4) direction = "right";
      else if (angle < (7 * Math.PI) / 4) direction = "up";
      else;

      lpoint = [...lpoint, { x, y, l, angle, direction }];
    }

    //console.log(lpoint[lpoint.length - 1].direction);

    return lpoint.map((point, i) => {
      return (
        <Label
          key={i}
          x={point.x}
          y={point.y}
          rotation={
            calPoint === 1
              ? anglePoint
              : Math.atan2(
                  pointFinal[1][1] - pointFinal[0][1],
                  pointFinal[1][0] - pointFinal[0][0]
                ) + 137
          }
          offsetX={10}
          offsetY={10}
        >
          <Tag
            fill="black"
            pointerDirection={point.direction}
            pointerWidth={8}
            pointerHeight={8}
            lineJoin="round"
            offsetX={-10}
            offsetY={-10}
            shadowColor="black"
          />
          <Text
            text={point.l.toFixed(3)}
            fontFamily="Calibri"
            fontSize={10}
            padding={4}
            scaleY={-1}
            offsetY={27}
            offsetX={-10}
            fill="white"
          />
        </Label>
      );
    });
  };

  const download = (data, filename, type) => {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }

    // console.log(points);
    // console.log(pointFinal);
  };

  const downloadChapter = () => {
    var zip = new JSZip();
    var count = 0;
    images.forEach((file) => {
      axios
        .get(file.url, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response.data);
          zip.file(count + ".jpg", response.data, {
            binary: true,
          });

          ++count;

          const uri = stageRef.current.toDataURL();

          let uriLength = uri.length + 1;

          zip.file("Base" + ".jpg", uri.substr(22, uriLength), {
            base64: true,
          });

          // zip.file("Base" + ".dxf", file, {
          //   base64: true,
          // });

          if (count == images.length) {
            zip
              .generateAsync({
                type: "blob",
              })
              .then(function (content) {
                saveAs(content, product.order + ".zip");
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  return (
    <Fragment>
      <Menu />
      <div>
        <Checkbox onChange={(e) => setCheckProduct(e.target.checked)}>
          View Image
        </Checkbox>
      </div>
      {checkProduct && (
        <button
          className="btn-sm btn-warning ml-2 mt-2"
          type="submit"
          onClick={() => downloadChapter()}
        >
          Download Images
        </button>
      )}
      {checkProduct && (
        <div className="container-fluid">
          <div className="row pt-4">
            <div className="col-md-9">
              {images && images.length ? (
                <Carousel showArrows={true} autoPlay infiniteLoop>
                  {images &&
                    images.map((i) => (
                      <img
                        src={i.url}
                        key={i.public_id}
                        style={{ width: "fit", height: "500px" }}
                      />
                    ))}
                </Carousel>
              ) : (
                <Card
                  cover={
                    <img
                      src="https://www.allianceplast.com/wp-content/uploads/2017/11/no-image.png"
                      className="mb-3 card-image"
                      style={{ width: "fit", height: "500px" }}
                    />
                  }
                ></Card>
              )}
            </div>

            <div className="col-md-3">
              <h1 className="bg-info p-3">ออเดอร์: {product.order}</h1>
              <div className=" pt-1 pb-3">
                <u>ชื่อลูกค้า</u>: {product.customer}
              </div>
              <div className=" pt-1 pb-3">
                <u>สถานที่</u>: {product.place}
              </div>
              <div className=" pt-1 pb-3">
                <u>ทีมช่าง</u>: {product.team}
              </div>
              <div className=" pt-1 pb-3">
                <u>เจาะก๊อก/ท่อร้อยสายไฟ</u>: {product.glock}
              </div>
              <div className=" pt-1 pb-3">
                <u>เตา</u>: {product.stove}
              </div>
              <div className=" pt-1 pb-3">
                <u>อ่าง</u>: {product.sink}
              </div>
              <div className=" pt-1 pb-3">
                <u>เซาะร่องน้ำ</u>: {product.water}
              </div>
              <div className=" pt-1 pb-3">
                <u>บัวกันเปื้อน</u>: {product.lotus}{" "}
                {product.lotus === "มี" ? `| ${product.lotusStyle}` : ""}{" "}
                {product.lotus === "มี" ? `| ${product.lotusHeight} เมตร` : ""}
              </div>
              <div className=" pt-1 pb-3">
                <u>จมูกท็อป</u>: {product.noseTop}
              </div>
              <div className=" pt-1 pb-3">
                <u>ยื่นจากเคาน์เตอร์</u>: {product.counter}
              </div>
            </div>
          </div>
        </div>
      )}
      <Affix offsetTop={top}>
        <button className="btn-sm btn-primary mr-2 mt-2" onClick={loadProduct}>
          Open Mark
        </button>
        <button className="btn-sm btn-danger mr-2 mt-2" onClick={clearMark}>
          Close Mark
        </button>
        <span className="pl-2">Order:</span>
        <input
          type="text"
          name="name"
          className="md-3 ml-1 mr-3 mt-2"
          onChange={(e) => {
            setOrder(e.target.value);
            console.log(order);
          }}
          value={order}
          disabled
        />

        {checkDxf ? (
          <span className="p-2">Close Dxf: </span>
        ) : (
          <span className="p-2">Open Dxf: </span>
        )}
        <Checkbox onChange={(e) => setCheckDxf(e.target.checked)} />
      </Affix>
      {checkDxf ? (
        <>
          <Button
            type="Dashed"
            className="mt-3 ml-2"
            shape="round"
            icon={<DownloadOutlined />}
            onClick={() => download(file, `${product.order}.dxf`, "dxf")}
          >
            Download
          </Button>
          <BluePrint points={points} curves={curves} anglePoint={anglePoint} />
        </>
      ) : (
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          offsetX={-window.innerWidth / 2}
          offsetY={-window.innerHeight / 2}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stageX}
          y={stageY}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                x={-window.innerWidth / 2}
                y={-(window.innerHeight - 200) / 2}
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>

          <Layer
            width={window.innerWidth}
            height={window.innerHeight}
            scaleY={-1}
            rotation={anglePoint}
          >
            {pointFinal.length >= 2 && textLabel(pointFinal)}

            <Line
              points={flattenedPoints}
              stroke="black"
              strokeWidth={5}
              // closed={isFinished}
            />
            {pointFinal.map((point, index) => {
              const width = 10;
              const x = point[0] - width / 2;
              const y = point[1] - width / 2;
              const startPointAttr =
                index === 0
                  ? {
                      hitStrokeWidth: 12,
                    }
                  : null;
              return (
                <Circle
                  key={index}
                  x={x}
                  y={y}
                  offsetY={0}
                  offsetX={-8}
                  width={width / 1.2}
                  height={width / 1.2}
                  fill="white"
                  stroke="black"
                  rotation={50}
                  strokeWidth={2}
                  {...startPointAttr}
                />
              );
            })}

            <Line
              points={flattenedCurves}
              stroke="black"
              strokeWidth={5}
              // closed={isFinished}
            />

            {curveFinal.map((point, index) => {
              const width = 10;
              const x = point[0] - width / 2;
              const y = point[1] - width / 2;
              const startPointAttr =
                index === 0
                  ? {
                      hitStrokeWidth: 12,
                    }
                  : null;
            })}
          </Layer>
        </Stage>
      )}
    </Fragment>
  );
};

export default Product;
