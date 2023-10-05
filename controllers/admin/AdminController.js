const AdminModel = require('../../models/Admin')
const ComplaintModel = require('../../models/Complaint')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


class AdminController {
    static dashboard = async (req, res) => {
        try {
            // console.log(req.data1)
            const{name,email,role,image}=req.data1
            res.render('admin/dashboard',{n:name,role:role,img:image})
        } catch (error) {
            console.log(error);
        }
    }
    static login = async (req, res) => {
        try {
            res.render('admin/login')
        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render('admin/register')
        } catch (error) {
            console.log(error)
        }
    }
    static admininsert = async (req, res) => {
        try {
            const { name, email, password } = req.body
            const hashpassword = await bcrypt.hash(password, 10)
            //console.log(req.body)
            const result = new AdminModel({
                name: name,
                email: email,
                password: hashpassword
            })
            await result.save()
             res.redirect('/admin/login')
        } catch (error) {
            console.log(error);
        }
    }
    // static verifylogin = async (req, res) => {
    //     try {
    //         // console.log(req.body)
    //         const { email, password } = req.body
    //         if (email && password) {
    //             const admin = await AdminModel.findOne({ email: email })
    //             // console.log(admin) 
    //             if (admin != null) {
    //                 const ismatched = await bcrypt.compare(password, admin.password)
    //                 if (ismatched) {
    //                     //generate token for security
    //             const token = jwt.sign({ID: admin._id},'shivam123456789singh');
    //             // console.log(token)
    //             //for cookies
    //             res.cookie('token',token)
    //                     res.redirect('/dashboard')
    //                 } else {
    //                     res.redirect('/admin/login')
    //                 }
    //             } else {
    //                 res.redirect('/admin/login')
    //             }
    //         } else {
    //             res.redirect('/admin/login')
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    static complaintdisplay = async(req,res)=>{
        try{
            const{name,email,role,image}=req.data1
            const cdata = await ComplaintModel.find()
            res.render('admin/displaycomplaint',{n:name,role:role,img:image,c:cdata})
        }catch(error){
            console.log(error);
        }
    }
    static viewcomplaint = async(req,res)=>{
        try{
            // console.log(req.params.id);
            const{name,email,role,image}=req.data1
            const cdata = await ComplaintModel.findById(req.params.id)
            res.render('admin/view',{n:name,role:role,img:image,c:cdata})
        }catch(error){
            console.log(error);
        }
    }
    static deletecomplaint = async(req,res)=>{
        try{
            await ComplaintModel.findOneAndDelete(req.params.id)
            res.redirect('/displaycomplaint')
        }catch(error){
            console.log(error);
        }
    }
}
module.exports = AdminController