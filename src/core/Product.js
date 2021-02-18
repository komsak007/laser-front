import React, { useState, useEffect, Fragment, useRef } from "react";
import { read } from "./apiCore";
import BluePrint from "../laser/BluePrint";
import { Stage, Layer, Line, Rect, Text, Tag, Label } from "react-konva";
import Menu from "../core/Menu";
import PolyLine from "../laser/PolyLine";
import makerjs from "makerjs";
import { toast } from "react-toastify";
import { DownloadOutlined } from "@ant-design/icons";
import { Affix, Select, Checkbox, Button } from "antd";

var SCENE_BASE_WIDTH = window.innerWidth;
var SCENE_BASE_HEIGHT = window.innerHeight;

const Product = ({ match }) => {
  const [lines, setLines] = useState([]);
  const [top, setTop] = useState(10);
  const [points, setPoints] = useState([]);
  const [order, setOrder] = useState("");
  const [stageX, setStageX] = useState(0);
  const [stageY] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isFinished] = useState(true);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    loadProduct();
  }, []);

  let model = new PolyLine({ points });

  //export DXF
  const filename = "Save DXF";
  const file = makerjs.exporter.toDXF(model);

  const loadProduct = () => {
    read(match.params.productId).then((res) => {
      console.log(res);
      setPoints(res.point);
      setLines(res.lines);
      setOrder(res.order);
    });
    toast.success("Load data success");
    // console.log(match.params.productId);
  };

  const clearMark = () => {
    setLines([]);
    toast.error("Clear mark");
  };

  const flattenedPoints = points
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
      let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 42 * 0.0002645833;
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

    return lpoint.map((point) => {
      return (
        <Label x={point.x} y={point.y}>
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
  };

  return (
    <Fragment>
      <Menu />
      <Affix offsetTop={top}>
        <button className="btn btn-primary mr-2 mt-2" onClick={loadProduct}>
          Open Mark
        </button>
        <button className="btn btn-danger mr-2 mt-2" onClick={clearMark}>
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
        {check ? (
<<<<<<< HEAD
          <span className='p-2'>Close Dxf: </span>
        ) : (
          <span className='p-2'>Open Dxf: </span>
=======
          <span className="p-2">Close Dxf: </span>
        ) : (
          <span className="p-2">Open Dxf: </span>
>>>>>>> 578238d28e1a4db7a12caff0571c48d8b06ad877
        )}
        <Checkbox onChange={(e) => setCheck(e.target.checked)} />
      </Affix>
      {check ? (
        <>
          <Button
            type="Dashed"
            className="mt-3 ml-2"
            shape="round"
            icon={<DownloadOutlined />}
            onClick={() => download(file, "Output.dxf", "dxf")}
          >
            Download
          </Button>
          <BluePrint points={points} />
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
            {points.length >= 2 && textLabel(points)}

            <Line
              points={flattenedPoints}
              stroke="black"
              strokeWidth={5}
              // closed={isFinished}
            />
            {points.map((point, index) => {
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
          </Layer>
        </Stage>
      )}
    </Fragment>
  );
};

export default Product;
