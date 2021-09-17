import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Menu from "./Menu";

import "../styles/css/style.css";

function ProductNumber({ history }) {
  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("productId")) {
      history.push("/laser");
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!productId) {
      return toast.error("Device Id is required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    window.localStorage.setItem("productId", productId);

    history.push("/laser");
  };

  return (
    <>
      <Menu />
      <div className="page">
        <div className="cardProduct">
          <div>
            <h2>Product Number</h2>
            <div className="underline"></div>
          </div>
          <div className="inputName">
            <label className="textField">Device Id</label>
            <input
              type="text"
              onChange={(e) => {
                setProductId(e.target.value);
              }}
              value={productId}
              required
            />
          </div>
          <button onClick={submitHandler}>Submit</button>
        </div>
      </div>
    </>
  );
}

export default ProductNumber;
