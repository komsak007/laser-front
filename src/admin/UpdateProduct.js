import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    order: "",
    description: "",
    place: "",
    categories: [],
    category: "",
    photo: "",
    loading: "",
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });

  const { user, token } = isAuthenticated();
  const {
    name,
    order,
    description,
    place,
    categories,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // console.log(data);
        //populate the state
        if (name === "") {
          setValues({
            ...values,
            name: user.name,
            order: data.order,
            place: data.place,
            description: data.description,
            formData: new FormData(),
          });
        } else {
          setValues({
            ...values,
            name: data.name,
            order: data.order,
            place: data.place,
            description: data.description,
            formData: new FormData(),
          });
        }
        //load categories
        initCategories();
      }
    });
  };

  // Load categories and set formdata
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);

    setValues({ ...values, error: "", createdProduct: "", [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    if (name === "") {
      formData.set("name", user.name);
    } else {
      formData.set("name", user.name);
    }

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            order,
            description: "",
            place,
            photo: "",
            loading: false,
            createdProduct: data.order,
          });
        }
      }
    );
    window.scrollTo(0, 0);
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
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
          disabled
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
      <button className="btn btn-outline-primary">Update Product</button>
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
      <h2>Order number {`${createdProduct} `} is Updated!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to="/" />;
      }
    }
  };

  return (
    <Layout
      title="Update a product"
      description={`G'day ${user.name}, ready to add a new product`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
