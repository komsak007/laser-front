import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createCategory, getCategories, deleteCategories } from "./apiAdmin";

const AddCategory = ({ history }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  // destructure user and info from localstorage
  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const destroy = (categoryId) => (e) => {
    deleteCategories(categoryId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, [success]);

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
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(true);
        setName("");
      } else {
        setError("");
        setName("");
        setSuccess(true);
      }
    });
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
      <button className="btn btn-outline-primary">Create Category</button>
    </form>
  );

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category is should be unique</h3>;
    }
  };

  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Manage Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/products">
              Manage Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/user">
              Manage User
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/measurement">
              Manage Measurement
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Add a new category"
      description={`Hello ${user.name}, ready to add a new category`}
      className="container-fluid"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">{adminLinks()}</div>
          <div className="col-md-9">
            {showError()}
            {newCategoryFom()}

            <h2 className="text-center">
              Total {categories.length} categories
            </h2>
            <hr />
            <ul className="list-group">
              {categories.map((c, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <strong>{c.name}</strong>

                  <div>
                    <div className="float-right">
                      <span
                        onClick={destroy(c._id)}
                        className=" badge badge-danger badge-pill"
                        style={{ cursor: "pointer" }}
                      >
                        Delete
                      </span>
                    </div>

                    <div className="float-right mx-2">
                      <span
                        onClick={() =>
                          history.push(`/admin/category/update/${c._id}`)
                        }
                        className="badge badge-warning badge-pill"
                        style={{ cursor: "pointer" }}
                      >
                        Edit
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
