import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../Context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DocotorContext } from '../Context/DoctorContext'

const Navbar = () => {
    const {aToken,setAToken} = useContext(AdminContext)
    const {dToken,setDToken} = useContext(DocotorContext)
    const navigate = useNavigate()
    const logout = () =>{
        navigate('/')
aToken && setAToken('')
dToken && setDToken('')
aToken && localStorage.removeItem('aToken')
dToken && localStorage.removeItem('dToken')
    }
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white ">
      <div className="flex items-center  gap-2 text-sm">
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2 rounded-full border-gray-500 text-gray-600'>{aToken?'Admin':'Doctor'}</p>
      </div>
      <button onClick={logout}  className='bg-blue-500 text-white text-sm px-10
      py-2 rounded-full '>Logout</button>
    </div>
  )
}

export default Navbar
