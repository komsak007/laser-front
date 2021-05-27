import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { UpdateCategoryId, getCategory } from "./apiAdmin";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // destructure user and info from localstorage
  const { user, token } = isAuthenticated();

  const init = (categoryId) => {
    getCategory(categoryId).then((c) => {
      setName(c.name);
    });
  };

  useEffect(() => {
    // console.log(match.params);
    init(match.params.categoryId);
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess(false);
    setName(e.target.value);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // make request to api to create category
    UpdateCategoryId(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
        }
      }
    );
  };

  const newCategoryFom = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
          required
        />
      </div>
      <button className="btn btn-outline-primary">Update Category</button>
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is updated</h3>;
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category is should be unique</h3>;
    }
  };

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link
          to="/admin/categories"
          className=" btn btn-secondary text-warning"
        >
          Back to Categories
        </Link>
      </div>
    );
  };

  return (
    <Layout
      title="Edit Category name"
      description={`Hello ${user.name}, ready to edit a category`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCategoryFom()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateCategory;
