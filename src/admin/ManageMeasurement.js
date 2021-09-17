import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../core/Layout";
import { getMeasure, addMeasure, delMeasure } from "./apiAdmin";

const ManageMeasurement = ({ history }) => {
  const [measure, setMeasure] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadProducts = () => {
    getMeasure().then((data) => {
      setMeasure(data.data);
    });
  };

  const destroy = (measureId) => (e) => {
    delMeasure(measureId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addMeasure(name).then(() => {
        setName("");
      });
    } catch (error) {
      setError(error);
      toast.error("Measurement name is unique", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [loading]);

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

  const measureForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setError(null)}
          value={name}
          autoFocus
          required
        />
      </div>
      <button className="btn btn-outline-primary">Add Measure</button>
    </form>
  );

  return (
    <Layout
      title="Manage Measurement Device"
      description="Add and Delete measurement device"
      className="container-fluid"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">{adminLinks()}</div>
          <div className="col-md-9">
            {measureForm()}
            <h2 className="text-center">Total {measure.length} devices</h2>
            <hr />
            <ul className="list-group ">
              {measure.map((u, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <strong>ลำดับที่: {i + 1}</strong>
                  <strong className="pl-5">รหัสเครื่อง: {u.measurement}</strong>
                  <div>
                    <span
                      onClick={destroy(u._id)}
                      className="float-right badge badge-danger badge-pill"
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </span>
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

export default ManageMeasurement;
