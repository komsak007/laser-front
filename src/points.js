import React, { useState, useEffect  } from "react";
import ReactDOM from "react-dom";
import { render } from "react-dom";
import axios from 'axios'
import { Stage, Layer, Group, Line, Rect, Text, Tag, Label} from "react-konva";
import {saveAs} from 'file-saver'
import Menu from './core/Menu'
import {API} from './config'

var SCENE_BASE_WIDTH = window.innerWidth;
var SCENE_BASE_HEIGHT = window.innerHeight;

const PointsLaser = () => {
  const [polar, setPolar] = useState({ theta: "", radius: "" });
  const [rectangular, setRectangular] = useState({ x: "", y: "" });
  const [points, setPoints] = useState([]);
  const [mesurement, setMesurement] = useState([]);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [b] = useState();
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setMouseOverStartPoint] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [xypoint,setxypoint] = useState({x1:"",y1:"",re:""});
  const [size, setSize] = useState({width: window.innerWidth,
                                  height: window.innerHeight})

  const getMousePos = stage => {
    return [((stage.getPointerPosition().x)-((window.innerWidth*2)/2)), ((stage.getPointerPosition().y)-((window.innerHeight*2)/2))];
  };

  useEffect(() => {setInterval(() =>{
    axios.get(`${API}/laser`)
      .then(response => {
        setPoints(response.data.point)
      })
  },2000)

      const checkSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize)
    }, []);


  const handleClick = event => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    // console.log(mousePos);
    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) {
      setFinished(true);
    } else {
      setPoints([...points, mousePos]);
      // console.log(points);
    }
  };

  const handleMouseMove = event => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos(mousePos);
  };

  const handleMouseOverStartPoint = event => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    setMouseOverStartPoint(false);
  };

  const handleDragStartPoint = event => {
    console.log("start", event);
  };

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    console.log(event.target);
    const pos = [event.target.attrs.x, event.target.attrs.y];
    console.log("move", event);
    console.log(pos);
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  const handleDragOutPoint = event => {
    console.log("end", event);
  };

  const handleDragEndPoint = event => {
    console.log("end", event);
  };

  const handleChange = event => {
    if (event.target.name === "theta") {
      setPolar({ ...polar, theta: event.target.value });
      console.log(polar.theta);
    } else {
      setPolar({ ...polar, radius: event.target.value });
    }
    // console.log(polar);
  };

  const handleChangeRectangular = event => {
    if (event.target.name === "x") {
      setRectangular({ ...rectangular, x: event.target.value });
    } else {
      setRectangular({ ...rectangular, y: event.target.value });
    }
    // console.log(rectangular);
  };

  const handleButtonClick = event => {
    event.preventDefault();

    // console.log(parseFloat(polar.radius));
    // console.log(parseFloat(polar.theta));
    console.log(parseFloat(polar.theta));

    // only a quarter (0-90 degrees)
    let x =
      parseFloat(polar.radius*100) *
      Math.cos((parseFloat(polar.theta) * Math.PI) / 180);
    let y =
      parseFloat(polar.radius*100) *
      Math.sin((parseFloat(polar.theta) * Math.PI) / 180);
      //แปลงเรเดียนเป็นเซต้า
      // x = Math.abs(x)
      // y = Math.abs(y)
    console.log(x);
    console.log(y);

    setPoints([...points, [x, y]]);

    console.log(points);
  };

  const handleButtonClickRectangular = event => {
    event.preventDefault();


    // console.log(parseFloat(rectangular.x));
    // console.log(parseFloat(rectangular.y));
    //
    // // only a quarter (0-90 degrees)
    let x = parseFloat(rectangular.x)
    let y = parseFloat(rectangular.y)
    //
    // console.log(x);
    // console.log(y);
    setPoints([...points, [x,y]]);
    console.log(points);

    // setPoints([points, data]);
    console.log(size.width);

    setxypoint({...xypoint, x1:x,y2:y,re:x-y})


  };

  const flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

    const scale = Math.min(
      window.innerWidth / SCENE_BASE_WIDTH,
      window.innerHeight / SCENE_BASE_HEIGHT
    );

    const submitData = event =>{
      event.preventDefault();
      for (let i = 0; i < points.length-1; i++) {
        let x1 = points[i][0]
        let y1 = points[i][1]
        let x2 = points[i+1][0]
        let y2 = points[i+1][1]
        // console.log("x1 = " + x1 + " " + "y1 = " + y1);
        if (x1===x2 && y1!==y2) {
          let resultx = x1
          let resulty = (y1+y2)/2
          let length = y1-y2
          length = Math.abs(length)
          setMesurement([...mesurement,[{x:resultx,y:resulty,len:length}]])
        }
        else if (x1!==x2 && y1===y2) {
          let resultx = (x1+x2)/2
          let resulty = y1
          let length = x1-x2
          length = Math.abs(length)
          setMesurement([...mesurement,[{x:resultx,y:resulty,len:length}]])
        }
        else if (x1!==x2 && y1!==y2) {
          let resultx = (((x1 + x2) / 2) + 5)
          let resulty = (((y1 + y2) / 2) + 5)
          let length = ((x1-x2)**2 + (y1-y2)**2)**0.5
          // length = Math.abs(length)
          setMesurement([...mesurement,[{x:resultx,y:resulty,len:length}]])
        }
      }
      console.log(mesurement);
    }

    const handleExportClick = (e) => {
    e.preventDefault()
    saveAs(b.getStage().toDataURL(), "Project.jpg");

    console.log(b);
  };

  const textLabel = (points) => {
    let lpoint = [];

    for (let i = 0; i < points.length - 1; i++) {
      let dx = points[i + 1][0] - points[i][0];
      let dy = points[i + 1][1] - points[i][1];
      let x = points[i][0] + dx / 2;
      let y = points[i][1] + dy / 2;
      let l = ((Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))*42)*0.0002645833);
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
            text={point.l.toFixed( 3 )+" m "}
            fontFamily="Calibri"
            fontSize={18}
            padding={5}
            fill="white"
          />
        </Label>
      );
    });
  };

  const handleWheel = e => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

      setStageScale(stageScale,newScale)
      setStageX(stageX,-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale)
      setStageX(stageX,-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale)
      // onWheel={handleWheel}
  };

  return (
    <>
      <Menu />
        <Stage
          width={window.innerWidth*1.5}
          height={window.innerHeight*2}
          offsetX = {(-size.width*1.5)/2}
          offsetY = {(-size.height*2)/2}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stageX}
          y={stageY}
          onMouseDown={handleClick}
          onMouseMove={handleMouseMove}
        >
          <Layer
            width={window.innerWidth*2}
            height={window.innerHeigh*2}
            scaleX={stageScale}
            scaleY={stageScale}
          >
          {points.length >= 2 && textLabel(points)}


            <Line

              points={flattenedPoints}
              stroke="black"
              strokeWidth={5}
              closed={isFinished}
            />
            {points.map((point, index) => {
              const width = 10;
              const x = point[0] - width / 2;
              const y = point[1] - width / 2;
              const startPointAttr =
                index === 0
                  ? {
                      hitStrokeWidth: 12,
                      onMouseOver: handleMouseOverStartPoint,
                      onMouseOut: handleMouseOutStartPoint
                    }
                  : null;
              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={width/1.2}
                  height={width/1.2}
                  fill="white"
                  stroke="black"
                  strokeWidth={2}
                  onDragStart={handleDragStartPoint}
                  onDragMove={handleDragMovePoint}
                  onDragEnd={handleDragEndPoint}
                  draggable
                  {...startPointAttr}
                />
              );
            })}
          </Layer>
        </Stage>
    </>
  );
}

export default PointsLaser
