import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const MyAppointment = () => {
  const {backendUrl,token,getDoctorsData} = useContext(AppContext)
  const[appointments,setappointments] = useState([])

  const getUserAppointments = async () =>{
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      if(data.success){
        setappointments(data.appointments.reverse())
        console.log(data.appointments)
      }else{
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // cancel apponintment
  const cancelAppointment = async (appointmentId) =>{
try {

const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
if(data.success){
  toast.success(data.message)
  getUserAppointments()
  getDoctorsData()
}else{
  toast.error(data.message)
}
  
} catch (error) {
  console.log(error)
      toast.error(error.message)
}
  }
  useEffect(()=>{
    if(token){
getUserAppointments();
    }

  },[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div >
{
  appointments.map((item,index)=>(
    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}>
  <div>
    <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
  </div>
  <div className="flex-1 text-sm text-zinc-600">
    <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
    <p>{item.docData.speciality}</p>
    <p className='text-zinc-700 font-medium mt-1'>Address</p>
    <p className='text-xs'>{item.docData.address.line1}</p>
    <p className='text-xs'>{item.docData.address.line2}</p>
    <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium' >Date & Time:</span>{item.slotDate} | {item.slotTime}</p>
  </div>
  <div className='flex flex-col gap-2 justify-end'>
{!item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 hover:bg-primary hover:text-white transition-all duration-300 border rounded'>Pay Online</button>}
{!item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 rounded hover:text-white transition-all duration-300' onClick={()=> cancelAppointment(item._id)}>Cancel appointment</button> }
{item.cancelled && <button className='sm:min-w-48 py-3 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
  </div>
  
    </div>
  ))
}
      </div>
    </div>
  )
}

export default MyAppointment
