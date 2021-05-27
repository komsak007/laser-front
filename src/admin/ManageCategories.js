import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getCategories, deleteCategories } from "./apiAdmin";

const ManageProducts = ({ history }) => {
  const [categories, setCategories] = useState([]);

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
  }, []);

  return (
    <Layout
      title="Manage Products"
      description="Perform CRUD on products"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Total {categories.length} categories</h2>
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
    </Layout>
  );
};

export default ManageProducts;
