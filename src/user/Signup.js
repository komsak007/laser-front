import React, {useState} from 'react'
import Layout from '../core/Layout'
import {signup} from '../auth'
import {toast} from 'react-toastify'

const Signup = ({history}) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role: 1,
    error: '',
    success: false
  })

  const {name, email, password, role} = values

  const handleChange = name => event => {
    setValues({...values, error:false, [name]:event.target.value})
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, error: false });
    signup({name, email, password, role})
    .then(data => {
      if(data.error) {
        setValues({...values, error: data.error, success: false})
      } else {
        setValues({...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true
        })
      }
    })
    toast.success("Add user success")
    setTimeout(() => {
      history.push('/admin/user')
    },1000)
  }

  const signUpForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input onChange={handleChange('name')} type='text' className='form-control' value={name} />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input onChange={handleChange('email')} type='email' className='form-control' value={email} />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input onChange={handleChange('password')} type='password' className='form-control' value={password} />
      </div>

      <select onChange={handleChange("role")} className="form-control">
        <option>Please select</option>
        <option value="0">Technical</option>
        <option value="2">Draft</option>
      </select>

      <button onClick={clickSubmit} className='btn btn-primary'>Submit</button>
    </form>
  )


  return (
    (
      <Layout
        title='Signup Page'
        description='Signup to Node React E-commerce App'
        className='container col-md-8 offset-md-2'
        >
        {signUpForm()}
      </Layout>
    )
  )
}

export default Signup
