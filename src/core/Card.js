import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import { isAuthenticated } from "../auth";
import { deleteProduct } from "../admin/apiAdmin";
import { Modal, Button, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

const Card = ({
  product,
  showViewProductButton = true,
  showRemoveProductButton = false,
  showEditButton = true,
}) => {
  const [values, setValues] = useState({
    redirectToReferrer: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { redirectToReferrer } = values;

  const { user, token } = isAuthenticated();

  const showViewButton = (showViewProductButton) => {
    if (!product.point) {
      return (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button
            style={{ color: "red" }}
            disabled
            className="btn btn-outline-dark mt-2 mb-2"
          >
            รอการวัดระยะ
          </button>
        </Link>
      );
    } else {
      return (
        showViewProductButton && (
          <Link to={`/product/${product._id}`} className="mr-2">
            <button className="btn btn-outline-primary mt-2 mb-2">
              View Product
            </button>
          </Link>
        )
      );
    }
  };

  const showEdit = (showEditButton) => {
    return (
      showEditButton && (
        <Link to={`/admin/product/update/${product._id}`}>
          <button className="btn btn-outline-warning mt-2 mb-2 ">
            Edit Product
          </button>
        </Link>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <button
          onClick={destroy(product._id)}
          className="btn btn-outline-danger mt-2 mb-2 ml-2"
        >
          Remove Product
        </button>
      )
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const destroy = (productId) => (e) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          redirectToReferrer: true,
        });
      }
    });
  };

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }
  };

  return (
    <div className="card-desk">
      <div className="card mb-3">
        <div className="card-header">Order: {product.order}</div>
        <div className="card-body">
          {/* <img
            src={images && images.length ? images[0].url : laptop}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-2"
          /> */}
          <ShowImage item={product} url="product" />
          {/* <h5 className="text-muted my-3">ผู้รับผิดชอบ: {product.name}</h5> */}
          <div className="row">
            <div className="col-10">
              <h5>สถานที่: {product.place}</h5>
            </div>

            <div className="col-1">
              <Tooltip placement="top" title="รายละเอียดงาน">
                <InfoCircleFilled
                  style={{ fontSize: 24, cursor: "pointer" }}
                  onClick={showModal}
                />
              </Tooltip>

              <Modal
                title={product.order}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={
                  <Button type="primary" onClick={handleOk}>
                    Ok
                  </Button>
                }
              >
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
                  {product.lotus === "มี"
                    ? `| ${product.lotusHeight} เมตร`
                    : ""}
                </div>
                <div className=" pt-1 pb-3">
                  <u>จมูกท็อป</u>: {product.noseTop}
                </div>
                <div className=" pt-1 pb-3">
                  <u>ยื่นจากเคาน์เตอร์</u>: {product.counter}
                </div>
              </Modal>
            </div>
          </div>
          {/* <p>
            {product.description
              ? product.description.substring(0, 50)
              : "ไม่มีรายละเอียด"}
          </p> */}
          <div>
            <span className="black-9">
              วันที: {parseInt(product.createdAt.substring(8, 10))}-
              {product.createdAt.substring(5, 7)}-
              {product.createdAt.substring(0, 4)}
            </span>
          </div>

          {showViewButton(showViewProductButton)}

          {showEdit(showEditButton)}

          {showRemoveButton(showRemoveProductButton)}

          {redirectUser()}
        </div>
      </div>
    </div>
  );
};

export default Card;
