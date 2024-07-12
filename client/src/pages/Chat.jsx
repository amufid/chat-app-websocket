import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Link } from 'react-router-dom';
import { socket } from '../server/socket';
import axios from 'axios';
import { IoMdSend } from "react-icons/io";
import convertDate from '../lib/convertDateTime';
import UserConnected from '../component/UserConnected';;

const base_URL = 'http://localhost:3001';

function ChatPage() {
   const [messages, setMessages] = useState([])
   const [chats, setChats] = useState([])
   const [message, setMessage] = useState('')
   const [username, setUsername] = useState(localStorage.getItem('username'))
   const [room, setRoom] = useState(localStorage.getItem('room'))
   const [showEmojis, setShowEmojis] = useState(false)
   const [sender, setSender] = useState('')
   const [rooms, setRooms] = useState([])
   const [isActive, setIsActive] = useState(null)

   useEffect(() => {
      socket.on('receive_message', (message) => {
         setMessages((prev) => [...prev, message]);
      })

      return () => {
         socket.off('receive_message');
      }
   }, [])

   const fetchMessages = async () => {
      try {
         const storageRoom = localStorage.getItem('room')
         const res = await axios.get(`${base_URL}/messages?chatRoom=${storageRoom}`)
         setChats(res.data)
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      fetchMessages()
   }, [])

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const res = await axios.get(`${base_URL}/user?email=${username}`)
            setSender(res.data.data[0].id)
         } catch (error) {
            console.log(error)
         }
      }
      fetchUser()
   }, [username])

   useEffect(() => {
      const fetchRoom = async () => {
         try {
            const res = await axios.get(`${base_URL}/chatRoom?users=${sender}`)
            setRooms(res.data.data)
         } catch (error) {
            console.log(error)
         }
      }
      fetchRoom()
   }, [sender])

   const sendMessage = () => {
      if (message) {
         const formData = { room, sender, message, time: new Date() }
         socket.emit('join_room', room)
         socket.emit('send_message', formData);
         setMessage('');
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         sendMessage();
      }
   };

   const handleRoom = (e) => {
      e.preventDefault();
      localStorage.setItem('room', e.currentTarget.value);
      fetchMessages();
   }

   const listRef = useRef(null);

   // watch for when new items are added
   useEffect(() => {
      listRef.current?.lastElementChild?.scrollIntoView()
   }, [messages]);

   const addEmoji = (emoji) => {
      setMessage(message + emoji.native);
   };

   return (
      <div className='flex flex-row min-h-screen max-h-screen bg-slate-100 text-slate-200'>
         <div className='w-[400px] hidden sm:flex'>
            <div className='w-full bg-sky-950 h-full'>
               <div className='flex flex-row justify-between bg-slate-800 py-4 items-center px-3'>
                  <div className='flex flex-row'>
                     <div>
                        <p className='text-xl'>ChatApps</p>
                     </div>
                     {messages.length > 0 &&
                        <div className='bg-green-600 rounded-full w-6 h-6 flex items-center justify-center ml-1'>
                           <span className='text-white text-xs'>
                              {messages.length}
                           </span>
                        </div>
                     }
                  </div>
                  <div>
                     <Link to='/room'>
                        <button className='btn btn-sm btn-info'>+ Contact</button>
                     </Link>
                  </div>
               </div>
               {rooms.map((room => (
                  <div className={room.id === isActive ? 'bg-sky-900' : 'bg-sky-950 hover:bg-sky-900'} key={room.id}>
                     <div className='py-5 px-2' >
                        <div className='text-lg mx-3 flex items-center justify-between'>
                           <UserConnected rooms={room.users} sender={sender} />
                           <div
                              onClick={() => setIsActive(room.id)} >
                              <button
                                 onClick={handleRoom}
                                 value={room.id}
                                 type='submit'
                                 className='btn btn-sm btn-success ml-3'>
                                 Open
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )))}
            </div>
         </div>
         <div className='w-full'>
            <div className='flex flex-col w-full h-full bg-slate-800 mx-auto'>
               <div className='scrollbar min-h-[93%] pt-16'>
                  <div className='flex fixed z-50 bg-slate-800 py-5 mt-[-64px] w-full sm:w-[80%] h-[64px] mb-10'>
                     {/* <h3 className='text-xl ml-3 flex sm:hidden'>Room: {room}</h3> */}
                     <div className='flex w-full justify-end mx-7'>
                        <div className='flex'>
                           <Link to='/login'>
                              <button
                                 onClick={() => localStorage.removeItem('x-token')}
                                 className='btn btn-sm btn-error'>
                                 Logout
                              </button>
                           </Link>
                        </div>
                     </div>
                  </div>
                  <div ref={listRef}>
                     {chats.map((msg, index) => (
                        <div className={`chat ${sender === msg.sender ? 'chat-end' : 'chat-start'}`} key={index}>
                           <div className="chat-header text-green-500">
                              {sender !== msg.sender && '~'} {convertDate(msg.createdAt)}
                           </div>
                           <div className="chat-bubble">{msg.message}</div>
                        </div>
                     ))}
                     {messages.map((msg, index) => (
                        <div className={`chat ${sender === msg.sender ? 'chat-end' : 'chat-start'}`} key={index}>
                           <div className="chat-header text-green-500">
                              {sender !== msg.sender && '~'} {convertDate(msg.time)}
                           </div>
                           <div className="chat-bubble">{msg.message}</div>
                        </div>
                     ))}
                  </div>
               </div>

               {showEmojis && (
                  <div className="fixed z-10 bottom-[60px]">
                     <Picker data={data} onEmojiSelect={addEmoji} />
                  </div>
               )}

               <div className='flex w-full bg-black justify-between'>
                  <div>
                     <button className="btn px-1" onClick={() => setShowEmojis(!showEmojis)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                        </svg>
                     </button>
                  </div>
                  <div className='w-full mr-1'>
                     <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='type message'
                        className="input input-bordered input-info w-full" />
                  </div>
                  <div>
                     <button onClick={sendMessage} className='btn btn-success px-7 flex flex-row justify-between items-center w-28'>
                        <IoMdSend /> Send
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div >
   );
}

export default ChatPage;
