import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { getUser, updateUser } from "./apiAdmin";
import { toast } from "react-toastify";

const UpdateUser = ({ match, history }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    role: "",
  });
  const { name, email, role } = values;
  // const { user, token } = isAuthenticated();

  const init = (userId) => {
    getUser(userId).then((user) => {
      setValues({
        ...values,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    });
  };

  useEffect(() => {
    init(match.params.userId);
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    updateUser(match.params.userId, { name, email, role });
    toast.success("Update user success");
    history.push("/admin/user");
  };

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <label className="text-muted">Role</label>
      <select onChange={handleChange("role")} className="form-control">
        <option>Please select</option>
        <option value="0">Technical</option>
        <option value="2">Draft</option>
      </select>

      <button onClick={clickSubmit} className="btn btn-primary my-3">
        Submit
      </button>
    </form>
  );

  return (
    <Layout
      title="Signup Page"
      description="Signup to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      {updateForm()}
      {/* {JSON.stringify(values)} */}
    </Layout>
  );
};

export default UpdateUser;
