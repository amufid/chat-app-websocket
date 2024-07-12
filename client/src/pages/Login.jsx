import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
   const [formUser, setFormUser] = useState({
      email: '',
      password: ''
   })
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post('http://localhost:3001/user/login', formUser)
         localStorage.setItem('username', formUser.email)
         localStorage.setItem('x-token', res.data.token)
         navigate('/chat')
         toast.success('Login successful')
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <div className="flex justify-center items-center">
         <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
               <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                  <form className="card-body" onSubmit={handleSubmit}>
                     <h2 className="text-2xl text-center">Login</h2>
                     <div className="form-control">
                        <label className="label">
                           <span className="label-text">Email</span>
                        </label>
                        <input
                           value={formUser.email}
                           onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                           placeholder="Input email"
                           type="text"
                           className="input input-bordered" required />
                     </div>
                     <div className="form-control">
                        <label className="label">
                           <span className="label-text">Password</span>
                        </label>
                        <input
                           value={formUser.password}
                           onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                           placeholder="Input password"
                           type="password"
                           className="input input-bordered" required />
                     </div>
                     <div className="form-control mt-6">
                        <button className="btn btn-primary">Login</button>
                     </div>
                     <div className="form-control mt-4 w-full">
                        <Link to='/register'>
                           <button className="btn btn-secondary w-full">Register</button>
                        </Link>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}
