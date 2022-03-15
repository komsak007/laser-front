import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";
import FileUpload from "./FileUpload";

const { user, token } = isAuthenticated();

const AddProduct = ({ history }) => {
  const [values, setValues] = useState({
    order: "",
    customer: "",
    dayjob: "",
    contact: "",
    Appointment: "",
    team: "",
    place: "",
    category: "",
    images: [],
    glock: "",
    stove: "",
    sink: "",
    water: "",
    lotus: "",
    lotusHeight: "",
    lotusStyle: "ไม่มี",
    noseTop: "",
    noseTopHeight: "",
    noseTopStyle: "",
    counter: "",
    counterHeight: "",
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    categories: [],
    formData: "",
  });
  const [loading, setLoading] = useState(false);

  const {
    name,
    order,
    description,
    place,
    dayjob,
    images,
    glock,
    stove,
    sink,
    water,
    lotus,
    lotusHeight,
    lotusStyle,
    noseTop,
    noseTopHeight,
    noseTopStyle,
    counter,
    counterHeight,
    categories,
    error,
    createdProduct,
    formData,
  } = values;

  // Load categories and set formdata
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    formData.set(name, value);
    setValues({ ...values, error: "", createdProduct: "", [name]: value });
  };

  const clickSubmit = async (event) => {
    event.preventDefault();
    // formData.set("images", images);
    // formData.set("images", images);
    setValues({ ...values, error: "", loading: true });

    console.log(values);

    await createProduct(user._id, token, values, images).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          photo: "",
          order: "",
          description: "",
          place: "",
          images: "",
          loading: false,
          createdProduct: data.order,
        });
      }
    });
    await history.push("/");
  };

  const newPostForm = () => (
    <>
      <form className="mb-3" onSubmit={clickSubmit}>
        <h4>Post Photo</h4>
        <div className="form-group">
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
        </div>

        <h3>1. ข้อมูลเบื้องต้น</h3>
        <hr />
        <div className="form-group">
          <label className="text-muted">Order</label>
          <input
            onChange={handleChange("order")}
            type="text"
            className="form-control"
            value={order}
          />
        </div>

        <div className="form-group row">
          <div className="col">
            <label className="text-muted">ชื่อลูกค้า</label>
            <input
              onChange={handleChange("customer")}
              type="text"
              className="form-control"
              value={name}
            />
          </div>

          <div className="col">
            <label className="text-muted">วันที่ทำเอกสาร</label>
            <input
              onChange={handleChange("dayjob")}
              type="date"
              className="form-control"
              value={dayjob}
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="col">
            <label className="text-muted">ติดต่อ</label>
            <input
              onChange={handleChange("contact")}
              type="text"
              className="form-control"
              value={name}
            />
          </div>

          <div className="col">
            <label className="text-muted">วันที่นัดหมาย</label>
            <input
              onChange={handleChange("Appointment")}
              min={dayjob}
              type="date"
              className="form-control"
              value={name}
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="col">
            <label className="text-muted">ทีมช่าง</label>
            <input
              onChange={handleChange("team")}
              type="text"
              className="form-control"
              value={name}
            />
          </div>

          <div className="col">
            <label className="text-muted">ไซต์</label>
            <input
              onChange={handleChange("place")}
              type="text"
              className="form-control"
              value={name}
            />
          </div>
        </div>
      </form>

      <hr />
      <h3>2. รายละเอียดเบื้องต้น</h3>
      <hr />
      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">เจาะก๊อก/ท่อร้อยสายไฟ</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("glock")}
                value="มี"
                checked={glock === "มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("glock")}
                value="ไม่มี"
                checked={glock === "ไม่มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ไม่มี
              </label>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">เตา</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("stove")}
                value="มี"
                checked={stove === "มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("stove")}
                value="ไม่มี"
                checked={stove === "ไม่มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ไม่มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("stove")}
                value="วางบนท็อป"
                checked={stove === "วางบนท็อป" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                วางบนท็อป
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("stove")}
                value="วางใต้ท็อป"
                checked={stove === "วางใต้ท็อป" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                วางใต้ท็อป
              </label>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">อ่าง</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("sink")}
                value="มี"
                checked={sink === "มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("sink")}
                value="ไม่มี"
                checked={sink === "ไม่มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ไม่มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("sink")}
                value="วางบนท็อป"
                checked={sink === "วางบนท็อป" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                วางบนท็อป
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("sink")}
                value="วางใต้ท็อป"
                checked={sink === "วางใต้ท็อป" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                วางใต้ท็อป
              </label>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">เซาะร่องน้ำ</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("water")}
                value="มี"
                checked={water === "มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("water")}
                value="ไม่มี"
                checked={water === "ไม่มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ไม่มี
              </label>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">บัวกันเปื้อน</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotus")}
                value="มี"
                checked={lotus === "มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                มี
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotus")}
                value="ไม่มี"
                checked={lotus === "ไม่มี" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ไม่มี
              </label>
            </div>
            {lotus === "มี" ? (
              <>
                <label className="text-muted col-sm-1">ความสูง</label>
                <input
                  onChange={handleChange("lotusHeight")}
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px dotted gray",
                    textAlign: "center",
                  }}
                  className="col-sm-2"
                  value={lotusHeight}
                  placeholder="กรุณากรอกความสูง"
                />
                <label className="text-muted col-sm-1">ซม.</label>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="แบบวางตั้งเป็นมุมโค้ง"
                checked={lotusStyle === "แบบวางตั้งเป็นมุมโค้ง" ? true : false}
              />
              <img
                src={require("../img/Picture1.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                แบบวางตั้งเป็นมุมโค้ง
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="แบบวางตั้งเป็นมุมฉาก"
                checked={lotusStyle === "แบบวางตั้งเป็นมุมฉาก" ? true : false}
              />
              <img
                src={require("../img/Picture2.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                แบบวางตั้งเป็นมุมฉาก
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="บัวเหลี่ยม"
                checked={lotusStyle === "บัวเหลี่ยม" ? true : false}
              />
              <img
                src={require("../img/Picture3.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                บัวเหลี่ยม
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="บัวปาดเหลี่ยม"
                checked={lotusStyle === "บัวปาดเหลี่ยม" ? true : false}
              />
              <img
                src={require("../img/Picture4.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                บัวปาดเหลี่ยม
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="บัวสเตป"
                checked={lotusStyle === "บัวสเตป" ? true : false}
              />
              <img
                src={require("../img/Picture5.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                บัวสเตป
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="บัวครึ่งวงกลม"
                checked={lotusStyle === "บัวครึ่งวงกลม" ? true : false}
              />
              <img
                src={require("../img/Picture6.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                บัวครึ่งวงกลม
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("lotusStyle")}
                value="บัวหลุยส์"
                checked={lotusStyle === "บัวหลุยส์" ? true : false}
              />
              <img
                src={require("../img/Picture7.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                บัวหลุยส์
              </label>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">จมูกท็อป</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTop")}
                value="แบบมาตรฐาน"
                checked={noseTop === "แบบมาตรฐาน" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                แบบมาตรฐาน
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTop")}
                value="ขอบครอบความหนา"
                checked={noseTop === "ขอบครอบความหนา" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบครอบความหนา
              </label>
            </div>
            {noseTop !== "" ? (
              <>
                <label className="text-muted col-sm-1">ความสูง</label>
                <input
                  onChange={handleChange("noseTopHeight")}
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px dotted gray",
                    textAlign: "center",
                  }}
                  className="col-sm-2"
                  value={noseTopHeight}
                  placeholder="กรุณากรอกความสูง"
                />
                <label className="text-muted col-sm-1">ซม.</label>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบเหลี่ยม1"
                checked={noseTopStyle === "ขอบเหลี่ยม1" ? true : false}
              />
              <img
                src={require("../img/1.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบเหลี่ยม1
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบปาดเหลี่ยม1"
                checked={noseTopStyle === "ขอบปาดเหลี่ยม1" ? true : false}
              />
              <img
                src={require("../img/2.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบปาดเหลี่ยม1
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบเหลี่ยม2"
                checked={noseTopStyle === "ขอบเหลี่ยม2" ? true : false}
              />
              <img
                src={require("../img/3.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบเหลี่ยม2
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบปาดเฉียง"
                checked={noseTopStyle === "ขอบปาดเฉียง" ? true : false}
              />
              <img
                src={require("../img/4.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบปาดเฉียง
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบกลม1"
                checked={noseTopStyle === "ขอบกลม1" ? true : false}
              />
              <img
                src={require("../img/5.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบกลม1
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบกลม2"
                checked={noseTopStyle === "ขอบกลม2" ? true : false}
              />
              <img
                src={require("../img/6.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบกลม2
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบหลุยส์"
                checked={noseTopStyle === "ขอบหลุยส์" ? true : false}
              />
              <img
                src={require("../img/7.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบหลุยส์
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("noseTopStyle")}
                value="ขอบปาดเหลี่ยม2"
                checked={noseTopStyle === "ขอบปาดเหลี่ยม2" ? true : false}
              />
              <img
                src={require("../img/8.png")}
                alt=""
                width="30px"
                height="30px"
              />
              <label class="form-check-label" for="inlineRadio1">
                ขอบปาดเหลี่ยม2
              </label>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">
            ยื่นจากเคาน์เตอร์ (ข้างเคาน์เตอร์)
          </label>
          <div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("counter")}
                value="เสมอเคาน์เตอร์"
                checked={counter === "เสมอเคาน์เตอร์" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                เสมอเคาน์เตอร์
              </label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                onChange={handleChange("counter")}
                value="ยื่นมาจากเคาน์เตอร์"
                checked={counter === "ยื่นมาจากเคาน์เตอร์" ? true : false}
              />
              <label class="form-check-label" for="inlineRadio1">
                ยื่นมาจากเคาน์เตอร์
              </label>
            </div>
            {counter === "ยื่นมาจากเคาน์เตอร์" ? (
              <>
                <label className="text-muted col-sm-1">ความสูง</label>
                <input
                  onChange={handleChange("counterHeight")}
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px dotted gray",
                    textAlign: "center",
                  }}
                  className="col-sm-2"
                  value={counterHeight}
                  placeholder="กรุณากรอกความสูง"
                />
                <label className="text-muted col-sm-1">ซม.</label>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </form>

      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">Category</label>
          <select onChange={handleChange("category")} className="form-control">
            <option>Please select</option>
            {categories &&
              categories.map((c, i) => (
                <option value={c._id} key={i}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        <button className="btn btn-outline-primary">Create Product</button>
      </form>
    </>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>Order number {`${createdProduct} `} is created!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <Layout
      title="Add a new product"
      description={`Hello ${user.name}, ready to add a new product`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
