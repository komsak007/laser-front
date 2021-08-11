import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

// import Signup from "./user/Signup";
// import Signin from "./user/Signin";
// import Home from "./core/Home";
// import PrivateRoute from "./auth/PrivateRoute";
// import Dashboard from "./user/UserDashboard";
// import AdminRoute from "./auth/AdminRoute";
// import AdminDashboard from "./user/AdminDashboard";
// import AddCategory from "./admin/AddCategory";
// import AddProduct from "./admin/AddProduct";
// import PointsLaser from "./points";
// import Product from "./core/Product";
// import ManageProducts from "./admin/ManageProducts";
// import UpdateProduct from "./admin/UpdateProduct";
// import UpdateUser from "./admin/UpdateUser";
// import ManageUser from "./admin/ManageUser";

const Signup = lazy(() => import("./user/Signup"));
const Signin = lazy(() => import("./user/Signin"));
const Home = lazy(() => import("./core/Home"));
const PrivateRoute = lazy(() => import("./auth/PrivateRoute"));
const Dashboard = lazy(() => import("./user/UserDashboard"));
const AdminRoute = lazy(() => import("./auth/AdminRoute"));
const AdminDashboard = lazy(() => import("./user/AdminDashboard"));
const AddCategory = lazy(() => import("./admin/AddCategory"));
const AddProduct = lazy(() => import("./admin/AddProduct"));
const PointsLaser = lazy(() => import("./points"));
const Product = lazy(() => import("./core/Product"));
const ManageCategories = lazy(() => import("./admin/ManageCategories"));
const UpdateCategory = lazy(() => import("./admin/UpdateCategory"));
const ManageProducts = lazy(() => import("./admin/ManageProducts"));
const UpdateProduct = lazy(() => import("./admin/UpdateProduct"));
const UpdateUser = lazy(() => import("./admin/UpdateUser"));
const ManageUser = lazy(() => import("./admin/ManageUser"));
const Estimate = lazy(() => import("./estimate/estimate"));

// import Signup from "./user/Signup";
// import Signin from "./user/Signin";
// import Home from "./core/Home";
// import PrivateRoute from "./auth/PrivateRoute";
// import Dashboard from "./user/UserDashboard";
// import AdminRoute from "./auth/AdminRoute";
// import AdminDashboard from "./user/AdminDashboard";
// import AddCategory from "./admin/AddCategory";
// import AddProduct from "./admin/AddProduct";
// import PointsLaser from "./points";
// import Product from "./core/Product";
// import ManageProducts from "./admin/ManageProducts";
// import UpdateProduct from "./admin/UpdateProduct";
// import UpdateUser from "./admin/UpdateUser";
// import ManageUser from "./admin/ManageUser";

const Routes = () => {
  return (
    <Suspense
      fallback={<div className="col text-center p-5">__ LASER REACT __</div>}
    >
      <BrowserRouter>
        <ToastContainer />
        <Switch>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
          <AdminRoute
            path="/admin/dashboard"
            exact
            component={AdminDashboard}
          />
          <AdminRoute path="/create/category" exact component={AddCategory} />
          <PrivateRoute path="/create/product" exact component={AddProduct} />
          <PrivateRoute path="/laser" exact component={PointsLaser} />
          <Route path="/product/:productId" exact component={Product} />
          <PrivateRoute
            path="/admin/product/update/:productId"
            exact
            component={UpdateProduct}
          />
          <AdminRoute
            path="/admin/categories"
            exact
            component={ManageCategories}
          />

          <AdminRoute path="/admin/products" exact component={ManageProducts} />

          <AdminRoute path="/admin/user" exact component={ManageUser} />

          <AdminRoute
            path="/admin/user/update/:userId"
            exact
            component={UpdateUser}
          />

          <AdminRoute
            path="/admin/category/update/:categoryId"
            exact
            component={UpdateCategory}
          />

          <PrivateRoute path="/estimate" exact component={Estimate} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Routes;
