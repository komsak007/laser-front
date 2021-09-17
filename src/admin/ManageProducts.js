import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProducts, deleteProduct } from "./apiAdmin";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => (e) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
      title="Manage Products"
      description="Perform CRUD on products"
      className="container-fluid"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">{adminLinks()}</div>
          <div className="col-md-9">
            <h2 className="text-center">Total {products.length} products</h2>
            <hr />
            <ul className="list-group">
              {products.reverse().map((p, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <strong>{p.order}</strong>
                  <span
                    onClick={destroy(p._id)}
                    className="badge badge-danger badge-pill"
                    style={{ cursor: "pointer" }}
                  >
                    Delete
                  </span>
                </li>
              ))}
              <br />
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
