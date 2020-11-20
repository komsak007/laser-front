import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import ShowImage from './ShowImage'
import {isAuthenticated} from '../auth'
import {getProducts, deleteProduct} from '../admin/apiAdmin'

const Card = ({
  product,
  showViewProductButton = true,
  showRemoveProductButton = false,
  showEditButton = true
}) => {

    const [values, setValues] = useState({
      redirectToReferrer: false
    })

    const {redirectToReferrer} = values

    const {user, token} = isAuthenticated()

    const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className='mr-2'>
        <button className="btn btn-outline-primary mt-2 mb-2">View Product</button>
        </Link>
      )
    )
  }

  const showEdit = (showEditButton) => {
  return showEditButton && (
      <Link to={`/admin/product/update/${product._id}`}>
        <button className="btn btn-outline-warning mt-2 mb-2 ">Edit Product</button>
      </Link>
    )
  }

  const showRemoveButton = (showRemoveProductButton) => {

  return showRemoveProductButton && (
    <button onClick={destroy(product._id)} className="btn btn-outline-danger mt-2 mb-2 ml-2">
      Remove Product
    </button>
  )
}

    const destroy = (productId) => e => {
      deleteProduct(productId, user._id, token).then(data => {
        if(data.error) {
          console.log(data.error);
        } else {
          setValues({
            ...values,
            redirectToReferrer: true
          })
        }
      })
    }

    const redirectUser = () => {
      if(redirectToReferrer) {
          return <Redirect to='/' />
          }
      }



    return (
        <div className='card-desk'>
          <div className='card mb-3'>
            <div className='card-header'>Order: {product.order}</div>
            <div className='card-body'>
              <ShowImage item={product} url='product' />
              <h5 className="text-muted my-3">ผู้รับผิดชอบ: {product.name.substring(0, 6)}</h5>
              <p>สถานที่: {product.place}</p>
              <p>{product.description}</p>
              <div>
                <span className='black-9'>วันที: {parseInt(product.createdAt.substring(8, 10))}-
                  {product.createdAt.substring(5, 7)}-
                  {product.createdAt.substring(0, 4)}
                </span>
              </div>

                {showViewButton(showViewProductButton)}

                {showEdit(showEditButton)}

                {showRemoveButton(showRemoveProductButton)}

                {redirectUser()}
            </div>
          </div>
        </div>
    )
  }

export default Card
