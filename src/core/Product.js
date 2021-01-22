import React, { useState, useEffect, Fragment, useRef } from "react";
import { read } from "./apiCore";
import BluePrint from "../laser/BluePrint"
import { Stage, Layer, Group, Line, Rect, Text, Tag, Label } from "react-konva";
import Menu from "../core/Menu";
import { toast } from "react-toastify";
import { Affix, Select, Checkbox } from "antd";

var SCENE_BASE_WIDTH = window.innerWidth;
var SCENE_BASE_HEIGHT = window.innerHeight;
const { Option } = Select;

const Product = ({ match }) => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [top, setTop] = useState(10);
  const [bottom, setBottom] = useState(10);
  const [polar, setPolar] = useState({ theta: "", radius: "" });
  const [rectangular, setRectangular] = useState({ x: "", y: "" });
  const [points, setPoints] = useState([]);
  const [order, setOrder] = useState("");
  const [mesurement, setMesurement] = useState([]);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setMouseOverStartPoint] = useState(false);
  const [isFinished, setFinished] = useState(true);
  const [check, setCheck] = useState(false)
  const [xypoint, setxypoint] = useState({ x1: "", y1: "", re: "" });
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stageRef = useRef(null);
  const isDrawing = useRef(false);
  const [container, setContainer] = useState(null);

  const getMousePos = (stage) => {
    return [
      stage.getPointerPosition().x - 2000 / 2,
      stage.getPointerPosition().y - 1500 / 2,
    ];
  };

  useEffect(() => {
    loadProduct();
  }, []);

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

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    setStageScale(stageScale, newScale);
    setStageX(
      stageX,
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale
    );
    setStageX(
      stageX,
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    );
    // onWheel={handleWheel}
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
        <span className='pl-2'>Order:</span>
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
        {check ? (<span className='p-2'>Close Dxf: </span>) : (<span className='p-2'>Open Dxf: </span>)}
        <Checkbox onChange={(e) => setCheck(e.target.checked)} />
      </Affix>
      {check ? <BluePrint points={points} /> :
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
      </Stage>}
    </Fragment>
  );
};

export default Product;
