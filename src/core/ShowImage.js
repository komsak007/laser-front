import React from 'react'
import {API} from '../config'

const ShowImage = ({item, url}) => (
  <div className='product-img'>
    <img
      className="mb-3"
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      width='200px'
      height='200px'
      style={{maxHeight: '100%', maxWidth: '100%'}} />
  </div>
)

export default ShowImage
