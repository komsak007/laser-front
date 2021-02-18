import React, {useState, useEffect} from 'react'
import Layout from '../core/Layout'
import {listUser, deleteUser} from './apiAdmin'

const ManageUser = ({history}) => {
  const [users, setUsers] = useState([])

  const loadProducts = () => {
    listUser().then(data => {
        setUsers(data)
    })
  }

  const destroy = (userId) => e => {
    deleteUser(userId).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        loadProducts()
      }
    })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <Layout title='Manage User' description='Edit and Delete user' className='container-fluid'>
      <div className='row'>
          <div className='col-12'>
          <span onClick={() => history.push(`/signup`)}  className='float-right badge-lg badge-primary badge-pill' style={{cursor: 'pointer'}}>Add User</span>
            <hr/>
            <ul className="list-group ">
              {users.map((u, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                  <strong>{u.name}</strong>
                  {u.role === 1 && <strong className='pl-5'>ตำแหน่ง: Admin</strong>}
                  {u.role === 0 && <strong className='pl-5'>ตำแหน่ง: Technical</strong>}
                  {u.role === 2 && <strong className='pl-5'>ตำแหน่ง: Draft</strong>}
                  <span onClick={() => history.push(`/admin/user/update/${u._id}`)}  className='float-right badge badge-warning badge-pill' style={{cursor: 'pointer'}}>Edit</span>
                  <span onClick={destroy(u._id)}  className='float-right badge badge-danger badge-pill' style={{cursor: 'pointer'}}>Delete</span>
                </li>
              ))}
            </ul>
          </div>
      </div>

    </Layout>
  )
}

export default ManageUser
