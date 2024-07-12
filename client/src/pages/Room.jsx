import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { socket } from '../server/socket';
import { FaUserCheck } from "react-icons/fa6";
import toast from 'react-hot-toast';

const base_URL = 'http://localhost:3001';

export default function RoomPage() {
   const [name, setName] = useState('')
   const [users, setUsers] = useState([])
   const [data, setData] = useState([])
   const [search, setSearch] = useState('')
   const [myId, setMyId] = useState('')
   const [roomId, setRoomId] = useState('')
   const location = useLocation();
   const navigate = useNavigate()

   const handleSearch = (e) => {
      e.preventDefault()
      if (search) {
         const params = new URLSearchParams({ email: search });
         window.history.pushState(null, '', `/room/?${params.toString()}`);
         window.location.reload();
      } else {
         toast.error('Search cannot be empty')
      }
   }

   useEffect(() => {
      const getId = async () => {
         try {
            const params = new URLSearchParams(location.search);
            const email = params.get('email');
            const res = await axios.get(`${base_URL}/user?email=${email}`)
            setData(res.data.data)
            setName(res.data.data[0].email)
         } catch (error) {
            window.history.pushState(null, '', `/room`);
            console.log(error)
         }
      }
      getId()
   }, [location.search])

   useEffect(() => {
      const getRoom = async () => {
         try {
            const res = await axios.get(`${base_URL}/chatRoom?users=${myId}`)
            setRoomId(res.data.data[0].users)
         } catch (error) {
            console.log(error)
         }
      }
      getRoom()
   }, [myId])

   useEffect(() => {
      const getMyId = async () => {
         try {
            const myId = localStorage.getItem('username')
            const res = await axios.get(`${base_URL}/user?email=${myId}`)
            setMyId(res.data.data[0].id)
         } catch (error) {
            console.log(error)
         }
      }
      getMyId()
   }, [])

   const handleSubmit = async (e) => {
      e.preventDefault()
      try {
         if (users.length === 2) {
            const res = await axios.post(`${base_URL}/chatRoom`, { name, users })
            const chatRoom = res.data.data;
            const room = chatRoom.id;

            socket.emit('create_room', room);
            localStorage.setItem('room', room)
            navigate('/chat', { replace: true })
            toast.success('Connected successful')
         }
      } catch (error) {
         console.log(error)
      }
   }

   const handleFriend = (e) => {
      e.preventDefault()
      const newItem = `${e.target.value}`;
      const newItem2 = { myId };
      setUsers([...users, newItem, newItem2.myId]);
   }

   const handleBack = () => {
      window.history.pushState(null, '', `/room`);
      window.location.reload()
   }

   return (
      <>
         <div>
            {users.length <= 1 ? (
               <div className='flex items-center justify-center min-h-screen'>
                  {data.length === 0 && (
                     <form>
                        <div className="w-80">
                           <h2 className="text-2xl text-center mb-10">Search user</h2>
                           <div className="form-control">
                              <input
                                 value={search}
                                 onChange={(e) => setSearch(e.target.value)}
                                 placeholder="Input email"
                                 className="input input-bordered"
                                 required />
                           </div>
                           <div className='flex flex-row items-center justify-end mt-5'>
                              <div className="form-control mr-2">
                                 <button
                                    className="btn btn-primary"
                                    type="submit"
                                    onClick={handleSearch}>
                                    Search
                                 </button>
                              </div>
                              <div className="form-control">
                                 <Link to='/chat'>
                                    <button className='btn w-full btn-error'>Back</button>
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </form>
                  )}

                  {data.map(data => (
                     <div key={data} className='w-auto bg-slate-700 flex justify-between items-center px-5 py-5 rounded-lg'>
                        <div className='mr-3'>
                           <p className='text-md'>{data.email}</p>
                        </div>
                        {roomId.includes(data.id) ? (
                           <div className='flex flex-row gap-2 items-center'>
                              <p className='mt-1 ml-2'><FaUserCheck /></p>
                              <p>Connected</p>
                              <Link to='/chat'><button className='btn btn-sm btn-warning'>Back</button></Link>
                           </div>
                        ) : (
                           <div>
                              <button
                                 onChange={(e) => setUsers(e.target.value)}
                                 value={data.id}
                                 onClick={handleFriend}
                                 type='submit'
                                 className='btn btn-secondary'>
                                 <IoMdPersonAdd />
                                 Add contact
                              </button>
                              <div className="form-control mt-2">
                                 <Link to='/room'>
                                    <button onClick={handleBack} className='btn w-full btn-error'>Back</button>
                                 </Link>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            ) : (
               <div className='flex items-center justify-center min-h-screen'>
                  <form>
                     <div className="w-80 bg-slate-700 flex items-center px-5 py-5 rounded-lg flex-col gap-y-5">
                        <h2 className="text-2xl text-center">Start</h2>
                        <div className="form-control">
                           <button
                              className="btn btn-primary"
                              type="submit"
                              onClick={handleSubmit}>
                              <MdOutlineRocketLaunch />
                              Start
                           </button>
                        </div>
                     </div>
                  </form>
               </div>
            )}
         </div>
      </>
   )
}
