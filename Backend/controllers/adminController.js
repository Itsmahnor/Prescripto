import doctorModel from '../models/doctorModel.js'
import vallidator from 'validator'
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
// API for adding doctor
const addDoctor = async (req,res) =>{
    try {
      const {name,email,password,speciality,degree,experience,about,fee,address} = req.body;
const imageFile = req.file;
// checking for all data to add doctor
console.log(name,email,password,speciality,degree,experience,about,fee,address,imageFile)
if(!name||!email,!password||!speciality||!degree||!experience|| !about || !fee || !address || !imageFile){
return res.json({success:false,message:"Missing Details"})
}
// validate email format
if(!vallidator.isEmail(email)){
  return res.json({success:false,message:"Please Enter a valid Email"})  
}
// validating strong password
if(password.length<8){
    return res.json({success:false,message:"Please Enter a Strong Password"})
}
// hashing doctor password
const salt = await bycrypt.genSalt(10);
const hashedPassword = await bycrypt.hash(password,salt)

// upload image to cloudinary
const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
const imageUrl = imageUpload.secure_url

const doctorData = {
    name,email,image:imageUrl,password:hashedPassword,
    speciality,degree,experience,about,fee,address:JSON.parse(address),
    date:Date.now()
}

const newDoctor = new doctorModel(doctorData)
await newDoctor.save()
res.json({success:true,message:"Doctor Added"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// api for admin login
const loginAdmin = async (req,res) =>{
  try {
    const {email,password} = req.body
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
   const token = jwt.sign(
  { email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

     res.json({success:true,token})
    }else{
        res.json({success:false,message:"Invalid Credentials"})
    }
  } catch (error) {
    res.json({success:false,message:error.message})
    }
  }

// api to get all doctor

  const allDoctors = async (req,res)=>{
try {
  const doctors= await doctorModel.find({}).select('-password');
  res.json({success:true,doctors})
} catch (error) {
  res.json({success:false,message:error.message})
}
  }

  //  Api to get all appointments list
  const appointmentAdmin = async (req,res) =>{
try {
  const appointments = await appointmentModel.find({})
  res.json({success:true,appointments})
} catch (error) {
   res.json({success:false,message:error.message})
}
  }

const appointmentCancel = async (req,res) =>{
try {
  
   const {appointmentId} = req.body
   const appointmentData = await appointmentModel.findById(appointmentId)

   await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
  //  releasing doctor slot
  const {docId,slotDate,slotTime} = appointmentData
  const doctorData = await doctorModel.findById(docId)
  let slots_booked = doctorData.slots_booked
  slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e!=slotTime)
  await doctorModel.findByIdAndUpdate(docId,{slots_booked})

  res.json({success:true,message:"Appointment canceled"})
  
} catch (error) {
   return res.json({ success: false, message: error.message });
}
}

// api to get dashboard data for admin panel
const adminDashboard =  async(req,res) =>{
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})
    const dashData = {
      doctors: doctors.length,
      appointments : appointments.length,
      patients : users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
    
  } catch (error) {
     return res.json({ success: false, message: error.message });
  }
}

export {loginAdmin,addDoctor,allDoctors, appointmentAdmin, appointmentCancel, adminDashboard}