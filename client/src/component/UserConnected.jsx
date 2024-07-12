import axios from "axios"
import { useEffect, useState } from "react"
import { BsPersonCircle } from "react-icons/bs"

export default function UserDetail({ rooms, sender }) {
   const [user, setUser] = useState([])

   let user_id = [];
   for (let i = 0; i < rooms.length; i++) {
      let data = rooms[i]
      if (data !== sender) {
         user_id.push(data)
      }
   }

   useEffect(() => {
      const getUser = async () => {
         try {
            const res = await axios.get(`http://localhost:3001/user?id=${user_id[0]}`)
            setUser(res.data.data)
         } catch (error) {
            console.log(error)
         }
      }
      getUser()
   }, [])

   return (
      <div>
         {Array.isArray(user) && user.map((user => (
            <div key={user.id} className="flex flex-row items-center">
               <p className="mr-2 text-3xl"><BsPersonCircle /></p>
               <p>{user.email}</p>
            </div>
         )))}
      </div>
   )
}
