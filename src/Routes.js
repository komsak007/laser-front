import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Home from './core/Home'
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './user/UserDashboard'
import AdminRoute from './auth/AdminRoute'
import AdminDashboard from './user/AdminDashboard'
import AddCategory from './admin/AddCategory'
import AddProduct from './admin/AddProduct'
import PointsLaser from './points'
import Product from './core/Product'
import ManageProducts from './admin/ManageProducts'
import UpdateProduct from './admin/UpdateProduct'

const Routes = () => {
  return (
    <BrowserRouter>
        <Switch>
          <PrivateRoute path='/' exact component={Home} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <PrivateRoute path='/user/dashboard' exact component={Dashboard} />
          <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
          <AdminRoute path='/create/category' exact component={AddCategory} />
          <PrivateRoute path='/create/product' exact component={AddProduct} />
          <Route path="/laser" exact component={PointsLaser} />
          <Route path="/product/:productId" exact component={Product} />
          <PrivateRoute path='/admin/product/update/:productId' exact component={UpdateProduct} />
          <AdminRoute path='/admin/categories' exact component={ManageProducts} />
        </Switch>
    </BrowserRouter>
  )
}

export default Routes
