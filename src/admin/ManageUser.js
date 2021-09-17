import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../core/Layout";
import { listUser, deleteUser } from "./apiAdmin";

const ManageUser = ({ history }) => {
  const [users, setUsers] = useState([]);

  const loadProducts = () => {
    listUser().then((data) => {
      setUsers(data);
    });
  };

  const destroy = (userId) => (e) => {
    deleteUser(userId).then((data) => {
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
      title="Manage User"
      description="Edit and Delete user"
      className="container-fluid"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">{adminLinks()}</div>
          <div className="col-md-9">
            <span
              onClick={() => history.push(`/signup`)}
              className="float-right badge-lg badge-primary badge-pill"
              style={{ cursor: "pointer" }}
            >
              Add User
            </span>
            <h2 className="text-center">Total {users.length} users</h2>
            <hr />
            <ul className="list-group ">
              {users.map((u, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <strong>{u.name}</strong>
                  {u.role === 1 && <strong className="pl-5">Admin</strong>}
                  {u.role === 0 && <strong className="pl-5">Technical</strong>}
                  {u.role === 2 && <strong className="pl-5">Draft</strong>}
                  <span
                    onClick={() => history.push(`/admin/user/update/${u._id}`)}
                    className="float-right badge badge-warning badge-pill"
                    style={{ cursor: "pointer" }}
                  >
                    Edit
                  </span>
                  <span
                    onClick={destroy(u._id)}
                    className="float-right badge badge-danger badge-pill"
                    style={{ cursor: "pointer" }}
                  >
                    Delete
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageUser;
