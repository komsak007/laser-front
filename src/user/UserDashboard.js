import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const {
    user: { name, email, role },
  } = isAuthenticated();

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group"></ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Infomation</h3>
        <ul className="list-group">
          <li className="list-group-item">ชื่อ: {name}</li>
          <li className="list-group-item">E-mail: {email}</li>
          <li className="list-group-item">
            ตำแหน่ง: {role === 1 ? "Admin" : "พนักงาน"}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-md-3">{userLinks()}</div>
        <div className="col-md-9">{userInfo()}</div>
      </div>
    </Layout>
  );
};

export default Dashboard;
