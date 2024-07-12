import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
   const [formUser, setFormUser] = useState({
      username: '',
      email: '',
      password: '',
   })
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await axios.post('http://localhost:3001/user/register', formUser)
         navigate('/login')
         toast.success('Registration successful')
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
                     <h2 className="text-2xl text-center">Register</h2>
                     <div className="form-control">
                        <label className="label">
                           <span className="label-text">Username</span>
                        </label>
                        <input
                           value={formUser.username}
                           onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
                           placeholder="Input username"
                           type="text"
                           className="input input-bordered" required />
                     </div>
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
                           placeholder="Input room"
                           type="password"
                           className="input input-bordered" required />
                     </div>
                     <div className="form-control mt-6">
                        <button className="btn btn-primary">Register</button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}
