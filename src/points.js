import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { createLaser } from "./admin/apiAdmin";
import BluePrint from "./laser/BluePrint";
import { Stage, Layer, Line, Rect, Text, Tag, Label } from "react-konva";
import Menu from "./core/Menu";
import { API } from "./config";
import { toast } from "react-toastify";
import { Affix, Button, Checkbox } from "antd";

import { isAuthenticated } from "./auth";

var SCENE_BASE_WIDTH = window.innerWidth;
var SCENE_BASE_HEIGHT = window.innerHeight;

const { user } = isAuthenticated();

const PointsLaser = ({ history }) => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [top] = useState(10);
  const [points, setPoints] = useState([]);
  const [curves, setCurves] = useState([]);
  const [order, setOrder] = useState("");
  const [stageX] = useState(0);
  const [stageY] = useState(0);
  const [stageScale] = useState(1);
  const [curMousePos] = useState([0, 0]);
  const [setMouseOverStartPoint] = useState(false);
  const [isFinished] = useState(true);
  const [check, setCheck] = useState(false);

  const stageRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    let line = [];
    let curvePoint = [];
    let xCurve, yCurve;
    let x99;
    let y99;
    setInterval(() => {
      axios.get(`${API}/laser`).then((response, i) => {
        line = [];
        response.data.point.map((p) => {
          // console.log(p);
          x99 =
            (p[0] + 0.0273575) *
            Math.cos(p[1] * (Math.PI / 180)) *
            150 *
            6.56734569;
          y99 =
            (p[0] + 0.0273575) *
            Math.sin(p[1] * (Math.PI / 180)) *
            150 *
            6.56734569;
          // x99 = (p[0] + 0.038) * Math.cos(p[1] * (Math.PI / 180));
          // y99 = (p[0] + 0.038) * Math.sin(p[1] * (Math.PI / 180));
          // console.log(x99);
          line.push([x99, y99]);
          // console.log(line)
        });
        // response.data.point.map(p => console.log(p[0]))
      });

      axios.get(`${API}/curve`).then((response, i) => {
        curvePoint = [];
        response.data.curve.map((p) => {
          // console.log(p);
          xCurve =
            (p[0] + 0.0273575) *
            Math.cos(p[1] * (Math.PI / 180)) *
            150 *
            6.56734569;
          yCurve =
            (p[0] + 0.0273575) *
            Math.sin(p[1] * (Math.PI / 180)) *
            150 *
            6.56734569;

          // x99 = (p[0] + 0.038) * Math.cos(p[1] * (Math.PI / 180));
          // y99 = (p[0] + 0.038) * Math.sin(p[1] * (Math.PI / 180));
          // console.log(x99);
          curvePoint.push([xCurve, yCurve]);
          // console.log(line)
        });
      });

      setCurves(curvePoint);
      setPoints(line);

      // console.log(curvePoint);
      //   const checkSize = () => {
      //   setSize({
      //     width: window.innerWidth,
      //     height: window.innerHeight
      //   });
      // };
      //
      // window.addEventListener("resize", checkSize);
      // return () => window.removeEventListener("resize", checkSize)
    }, 3000);
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

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove1 = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
    console.log(lines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseOverStartPoint = (event) => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setMouseOverStartPoint(true);
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
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.0200251898;
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.020022205; // ดีที่สุด
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.018014184;
      let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.006570005;
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
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
            pointerWidth={8}
            pointerHeight={8}
            lineJoin="round"
            shadowColor="black"
          />
          <Text
            text={point.l.toFixed(3) + " m "}
            fontFamily="Calibri"
            fontSize={10}
            padding={4}
            fill="white"
          />
        </Label>
      );
    });
  };

  const handleExport = () => {
    createLaser({ points, order, lines, curves }).then(() =>
      toast.success("Save data to database")
    );
  };

  return (
    <>
      <Fragment>
        <Menu />
        <Affix offsetTop={top}>
          <Button type="primary" onClick={handleExport}>
            Save
          </Button>
          <span className="pl-2">Order:</span>
          <input
            type="text"
            name="name"
            className="md-3 ml-1 mr-3"
            onChange={(e) => {
              setOrder(e.target.value);
            }}
            value={order}
            placeholder="Order number"
          />
          <select
            value={tool}
            onChange={(e) => {
              setTool(e.target.value);
            }}
          >
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
          </select>
          {check ? (
            <span className="p-2">Close Dxf: </span>
          ) : (
            <span className="p-2">Open Dxf: </span>
          )}
          <Checkbox onChange={(e) => setCheck(e.target.checked)} />
        </Affix>
        {check ? (
          <BluePrint points={points} curves={curves} />
        ) : (
          <div style={{ position: "fixed" }}>
            <Stage
              width={window.innerWidth}
              height={window.innerHeight}
              offsetX={-(window.innerWidth - 250) / 2}
              offsetY={-(window.innerHeight - 250) / 2}
              scaleX={stageScale}
              scaleY={stageScale}
              x={stageX}
              y={stageY}
              ontouchstart={handleMouseDown}
              onMouseDown={handleMouseDown}
              ontouchmove={handleMouseMove1}
              onMousemove={handleMouseMove1}
              ontouchend={handleMouseUp}
              onMouseup={handleMouseUp}
              ref={stageRef}
            >
              <Layer>
                {lines.map((line, i) => (
                  <Line
                    x={-window.innerWidth / 2}
                    y={-window.innerHeight / 2}
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

              <Layer width={window.innerWidth} height={window.innerHeight}>
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
                          onMouseOver: handleMouseOverStartPoint,
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
                          onMouseOver: handleMouseOverStartPoint,
                        }
                      : null;
                })}
              </Layer>
            </Stage>
          </div>
        )}
      </Fragment>
    </>
  );
};

export default PointsLaser;
