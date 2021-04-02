import React, { useState, useEffect, Fragment, useRef } from "react";
import { read } from "./apiCore";
import BluePrint from "../laser/BluePrint";
import { Stage, Layer, Line, Rect, Text, Tag, Label } from "react-konva";
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
  let pointFinal = [];
  points.map((p) => {
    xFinal = p[0] / 6.56734569;
    yFinal = p[1] / 6.56734569;
    pointFinal.push([xFinal, yFinal]);
  });

  let xCurveFinal,
    yCurveFinal,
    curveFinal = [];
  curves.map((p) => {
    xCurveFinal = p[0] / 6.56734569;
    yCurveFinal = p[1] / 6.56734569;
    curveFinal.push([xCurveFinal, yCurveFinal]);
  });

  let model = new PolyLine({ points, curves });

  //export DXF
  const filename = "Save DXF";
  const file = makerjs.exporter.toDXF(model);

  const loadProduct = () => {
    read(match.params.productId).then((res) => {
      // console.log(res);
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
      let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.006570005;
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
        direction = "down";
      else if (angle < (3 * Math.PI) / 4) direction = "right";
      else if (angle < (5 * Math.PI) / 4) direction = "up";
      else if (angle < (7 * Math.PI) / 4) direction = "left";
      else;

      lpoint = [...lpoint, { x, y, l, angle, direction }];
    }

    //console.log(lpoint[lpoint.length - 1].direction);

    return lpoint.map((point, i) => {
      return (
        <Label key={i} x={point.x} y={point.y}>
          <Tag
            fill="black"
            pointerDirection={point.direction}
            pointerWidth={10}
            pointerHeight={10}
            lineJoin="round"
            shadowColor="black"
          />
          <Text
            text={point.l.toFixed(3) + " m "}
            fontFamily="Calibri"
            fontSize={18}
            padding={5}
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
                        style={{ width: "fit", height: "fit" }}
                      />
                    ))}
                </Carousel>
              ) : (
                <Card
                  cover={
                    <img
                      src="https://www.allianceplast.com/wp-content/uploads/2017/11/no-image.png"
                      className="mb-3 card-image"
                    />
                  }
                ></Card>
              )}
            </div>

            <div className="col-md-3">
              <h1 className="bg-info p-3">ผู้รับผิดชอบ: {product.name}</h1>
              <div className=" pt-1 pb-3">ออเดอร์: {product.order}</div>
              <div className=" pt-1 pb-3">
                รายละเอียด: {product.description}
              </div>
              <div className=" pt-1 pb-3">สถานที่: {product.place}</div>
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
          <BluePrint points={points} curves={curves} />
        </>
      ) : (
        <Stage
          width={2000}
          height={1500}
          offsetX={-2000 / 2}
          offsetY={-1500 / 2}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stageX}
          y={stageY}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                x={-1000}
                y={-750}
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

          <Layer width={2000} height={1500}>
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
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={width / 1.2}
                  height={width / 1.2}
                  fill="white"
                  stroke="black"
                  strokeWidth={2}
                  draggable
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
