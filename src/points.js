import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { addLaser, getProducts } from "./admin/apiAdmin";
import BluePrint from "./laser/BluePrint";
import {
  Stage,
  Layer,
  Line,
  Text,
  Tag,
  Label,
  Image,
  Circle,
} from "react-konva";
import Swal from "sweetalert2";
import useImage from "use-image";
import Menu from "./core/Menu";
import { API } from "./config";
import { toast } from "react-toastify";
import { Affix, Button, Checkbox } from "antd";
import { isAuthenticated } from "./auth";

const { user } = isAuthenticated();

const PointsLaser = ({ history }) => {
  const [tool, setTool] = useState("none");
  const [lines, setLines] = useState([]);
  const [top] = useState(10);
  const [products, setProducts] = useState([]);
  const [getProduct, setGetProducts] = useState([]);
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
  const [lotusTop, setLotusTop] = useState([]);
  const [error, setError] = useState(null);

  const [image] = useImage(
    require("./img/shape_triangle-removebg-preview.png")
  );

  const stageRef = useRef(null);
  const isDrawing = useRef(false);

  var anglePoint;

  useEffect(() => {
    if (!window.localStorage.getItem("productId")) {
      return history.push("/productNumber");
    }
    let productId = window.localStorage.getItem("productId");
    loadProducts();

    let line = [];
    let x99;
    let y99;
    let pointFunc = setInterval(() => {
      axios.get(`${API}/laser/${productId}`).then((response) => {
        if (response.data === null) {
          toast.error("Product number is not found", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          window.localStorage.removeItem("productId");
          productId = "";
          history.push("/productNumber");
          clearInterval(pointFunc);
        } else {
          line = [];
          response.data.point.map((p) => {
            // console.log(p);
            x99 =
              (p[0] + 0.029475) *
              Math.cos(p[1] * (Math.PI / 180)) *
              150 *
              6.52746569;
            y99 =
              (p[0] + 0.029475) *
              Math.sin(p[1] * (Math.PI / 180)) *
              150 *
              6.52746569;
            // x99 = (p[0] + 0.038) * Math.cos(p[1] * (Math.PI / 180));
            // y99 = (p[0] + 0.038) * Math.sin(p[1] * (Math.PI / 180));
            // console.log(x99);
            line.push([x99, y99]);
            // console.log(line)
          });
          setPoints(line);
        }

        setError(null);

        // response.data.point.map(p => console.log(p[0]))
      });
    }, 3000);
    return () => clearInterval(pointFunc);
  }, [order, setOrder]);

  useEffect(() => {
    var curvePoint = [];
    let xCurve, yCurve;
    let curveFunc = setInterval(() => {
      axios.get(`${API}/curve`).then((response, i) => {
        curvePoint = [];
        response.data.curve.map((p) => {
          // console.log(p);
          xCurve =
            (p[0] + 0.029475) *
            Math.cos(p[1] * (Math.PI / 180)) *
            150 *
            6.52746569;
          yCurve =
            (p[0] + 0.029475) *
            Math.sin(p[1] * (Math.PI / 180)) *
            150 *
            6.52746569;

          // x99 = (p[0] + 0.038) * Math.cos(p[1] * (Math.PI / 180));
          // y99 = (p[0] + 0.038) * Math.sin(p[1] * (Math.PI / 180));
          // console.log(x99);
          curvePoint.push([xCurve, yCurve]);
          // console.log(line)
        });

        setCurves(curvePoint);
      });
    }, 3000);
    return () => clearInterval(curveFunc);
  }, []);

  // Point
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
    xFinal = p[0] / 6.52746569;
    yFinal = p[1] / 6.52746569;
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
  var calCurve = 1;

  curves.map((p) => {
    xCurveFinal = p[0] / 6.52746569;
    yCurveFinal = p[1] / 6.52746569;
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

  const loadProducts = () => {
    getProducts().then((data) => {
      // console.log(data);
      if (data.error) {
        // console.log(data.error);
      } else {
        setProducts(data);
        setGetProducts(products.filter((p) => p.order === order));
      }
    });
  };

  // console.log(curveOver, curveFinal);

  const handleMouseDown = async (e) => {
    if (tool === "pen" || tool === "eraser") {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    } else if (tool === "lotus") {
      let x = e.evt.x || e.evt.touches[0].screenX;
      let y = e.evt.y || e.evt.touches[0].screenY;
      setLotusTop([...lotusTop, { x, y }]);
      // console.log(lotusTop);
    }
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
    // console.log(lines);
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

  const textLabel = (points) => {
    let lpoint = [];

    for (let i = 0; i < points.length - 1; i++) {
      let dx = points[i + 1][0] / 150 - points[i][0] / 150;
      let dy = points[i + 1][1] / 150 - points[i][1] / 150;
      let x = points[i][0] + (dx * 150) / 2;
      let y = points[i][1] + (dy * 150) / 2;
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.0200251898;
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.020022205; // ดีที่สุด
      // let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.018014184;
      // let l =
      //   Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.006570005 * calPoint;
      let l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * calPoint;
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
          // offsetX={10}
          // offsetY={10}
        >
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
            scaleY={-1}
            offsetY={17}
            fill="white"
          />
        </Label>
      );
    });
  };

  const handleExport = () => {
    let username = user.name;
    console.log(getProduct);

    Swal.fire({
      title: "ตรวจสอบข้อมูลก่อนบันทึก",
      html: `<div>เลขงานที่: ${order}</div> <div>ชื่อลูกค้า: ${getProduct[0].customer}</div> <div>สถานที่: ${getProduct[0].place}</div>`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ย้อนกลับ",
      confirmButtonText: "ข้อมูลถูกต้อง",
    }).then((result) => {
      if (result.value) {
        // console.log(getProduct);
        addLaser({
          order,
          point: points,
          curves,
          lines: { tool, points: lines },
        }).then(() => {
          Swal.fire("สำเร็จ", "บันทึกข้อมูลสำเร็จ", "success");
          history.push("/");
        });
      }
    });
  };

  return (
    <>
      <Fragment>
        <Menu />

        <Affix offsetTop={top}>
          <Button
            type="primary"
            onClick={handleExport}
            disabled={order !== "" ? false : true}
          >
            Save
          </Button>
          <span className="pl-2">Order:</span>
          <select
            className="mx-2"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Select order"
          >
            <option value="" disabled selected>
              Select order
            </option>
            {products.map((p) => {
              if (!p.point) {
                return (
                  <option value={p.order} key={p._id}>
                    {p.order}
                  </option>
                );
              }
            })}
          </select>
          <select
            value={tool}
            onChange={(e) => {
              setTool(e.target.value);
            }}
          >
            <option value="none">None</option>
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
            <option value="lotus">Lotus</option>
          </select>

          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setLotusTop(lotusTop.slice(0, lotusTop.length - 1));
            }}
            disabled={lotusTop.length > 0 ? false : true}
          >
            Undo
          </Button>

          {check ? (
            <span className="p-2">Close Dxf: </span>
          ) : (
            <span className="p-2">Open Dxf: </span>
          )}
          <Checkbox onChange={(e) => setCheck(e.target.checked)} />

          <Button
            type="primary"
            danger
            onClick={() => {
              window.localStorage.removeItem("productId");
              history.push("/productNumber");
            }}
            style={{ display: "absolute", left: "30px" }}
          >
            Edit product
          </Button>
        </Affix>
        {check ? (
          <BluePrint
            points={points}
            curves={curves}
            anglePoint={
              calPoint === 1
                ? anglePoint
                : Math.atan2(
                    pointFinal[1][1] - pointFinal[0][1],
                    pointFinal[1][0] - pointFinal[0][0]
                  ) + 137
            }
          />
        ) : (
          <div style={{ position: "fixed" }}>
            <Stage
              width={window.innerWidth}
              height={window.innerHeight}
              offsetX={-window.innerWidth / 2}
              offsetY={-(window.innerHeight - 200) / 2}
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

              <Layer>
                {lotusTop &&
                  lotusTop.map((top) => (
                    <Image
                      x={top.x - (window.innerWidth + 45) / 2}
                      y={top.y - window.innerHeight / 2}
                      image={image}
                      width={50}
                      height={50}
                    />
                  ))}
              </Layer>

              <Layer
                width={window.innerWidth}
                height={window.innerHeight}
                scaleY={-1}
                rotation={
                  calPoint === 1
                    ? anglePoint
                    : Math.atan2(
                        pointFinal[1][1] - pointFinal[0][1],
                        pointFinal[1][0] - pointFinal[0][0]
                      ) + 137
                }
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
                          onMouseOver: handleMouseOverStartPoint,
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
                      // rotation={angle}
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
