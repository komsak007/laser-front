import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";
import FileUpload from "./FileUpload";

const { user, token } = isAuthenticated();

const AddProduct = () => {
  const [values, setValues] = useState({
    name: user.name,
    order: "",
    description: "",
    place: "",
    categories: [],
    category: "",
    images: [],
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });
  const [loading, setLoading] = useState(false);

  const {
    name,
    order,
    description,
    place,
    images,
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

  const clickSubmit = (event) => {
    event.preventDefault();
    // formData.set("images", images);
    // formData.set("images", images);
    formData.set("name", user.name);
    setValues({ ...values, error: "", loading: true });

    createProduct(user._id, token, values, images).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
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
    window.scrollTo(0, 0);
  };

  const newPostForm = () => (
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

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
          disabled
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Order</label>
        <input
          onChange={handleChange("order")}
          type="text"
          className="form-control"
          value={order}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Place</label>
        <input
          onChange={handleChange("place")}
          type="text"
          className="form-control"
          value={place}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          type="text"
          className="form-control"
          value={description}
        />
      </div>

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
