const StudentModel = require('../../models/Student')
const CourseModel = require('../../models/Course')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dz5anoip8', 
    api_key: '689968534498441', 
    api_secret: 'RL6tp87urpCYLG6oPdZjklk7KKg',
    //secure: true
  });;

class StudentController {

    static addstudent = async (req, res) => {
        try {
            const { name, email, role, image } = req.data1
            const data = await StudentModel.find().sort({ _id: -1 })
            const course = await CourseModel.find()
            // console.log(data)
            res.render('admin/student/addstudent', { d: data, n: name, role: role, img: image, c:course, msg: req.flash('success'), msg1: req.flash('error') })
        }
        catch (error) {
            console.log(error)
        }
    }
    static studentinsert = async (req, res) => {
        try {
            // console.log(req.files.image); 
            // console.log(req.body)
            const file = req.files.image
            const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'Profile Image'
            })
            // console.log(image_upload)
            const { name, email, password, course } = req.body
            const student = await StudentModel.findOne({ email: email })
            if (student) {
                req.flash('error', 'Email already exists')
                res.redirect('/admin/addstudent')
            } else {
                if (name && email && password) {
                    const hashpassword = await bcrypt.hash(password, 10)
                    const result = new StudentModel({
                        name: name,
                        email: email,
                        password: hashpassword,
                        course: course,
                        image: {
                            public_id: image_upload.public_id,
                            url: image_upload.secure_url
                        }
                    })
                    await result.save()
                    req.flash('success', 'Student added successfully')
                    res.redirect('/admin/addstudent')
                } else {
                    req.flash('error', 'All fields are required')
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
    static studentview = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, email, role, image } = req.data1
            const data = await StudentModel.findById(req.params.id)
            // console.log(data);
            res.render('admin/student/view', { d: data, n: name, role: role, img: image })
        } catch (error) {
            console.log('error')
        }
    }
    static studentedit = async (req, res) => {
        try {
            // console.log(req.params.id);
            const { name, email, role, image } = req.data1
            const data = await StudentModel.findById(req.params.id)
            res.render('admin/student/edit', { d: data, n: name, role: role, img: image })
        } catch (error) {
            console.log(error)
        }
    }
    static studentupdate = async (req, res) => {
        try {
            // console.log(req.body);
            // console.log(req.files.image);
            const { name, email, password } = req.body
            const hashpassword = await bcrypt.hash(password, 10)
            if (req.files) {
                // first destroy old image public id
                const student = await StudentModel.findById(req.params.id)
                const imageid = student.image.public_id
                // console.log(imageid);
                await cloudinary.uploader.destroy(imageid)
                // 2nd image update
                const file = req.files.image
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'Profile Image'
                })
                var data = {
                    name: name,
                    email: email,
                    password: hashpassword,
                    image: {
                        public_id: image_upload.public_id,
                        url: image_upload.secure_url
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email,
                    password: hashpassword,
                }
            }

            const id = req.params.id
            const update = await StudentModel.findByIdAndUpdate(id, data)
            req.flash('success', 'Update Successfully')
            res.redirect('/admin/addstudent')
        } catch (error) {
            console.log(error);
        }
    }
    static studentdelete = async (req, res) => {
        try {
            await StudentModel.findByIdAndDelete(req.params.id)
            res.redirect('/admin/addstudent')
        } catch (error) {
            console.log(error);
        }
    }
    static verifylogin = async (req, res) => {
        try {
            //console.log(req.body);
            const { email, password } = req.body
            if ((email && password)) {
                const user = await StudentModel.findOne({ email: email })
                // console.log(student);
                if (user != null) {
                   const ismatched = await bcrypt.compare(password, user.password)
                     //const ismatched = true
                     //console.log(ismatched);
                    if (ismatched) {
                        if (user.role == 'admin') {
                            //generate token for security
                            const token = jwt.sign({ ID: user._id }, 'shivam123456789gangil');
                            // console.log(token)
                            //for cookies
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }
                        if (user.role == 'student') {
                            //generate token for security
                            const token = jwt.sign({ ID: user._id }, 'shivam123456789gangil');
                            // console.log(token)
                            //for cookies
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }

                    } else {
                        req.flash('error', 'Email or Password is incorrect')
                        res.redirect('/')
                    }
                } else {
                    req.flash('error', 'You are not a registered user')
                    res.redirect('/')
                }
            } else {
                req.flash('errror', 'email and password are required')
                res.redirect('/')
            }
        } catch (error) {
            console.log(error);
        }
    }

    static profile = async (req, res) => {
        try {
            const { name, email, phone, address, city, image, role, course } = req.data1
            res.render('admin/student/profile', { n: name, e: email, p: phone, c: city, a: address, img: image, role: role, co:course })
        } catch (error) {
            console.log(error);
        }
    }
    static updateprofile = async (req, res) => {
        try {
            const { name, email, id, image } = req.data1
            //  console.log(req.files.image);
            if (req.files) {
                // first find and destroy old image public id
                const student = await StudentModel.findById(id)
                const imageid = student.image.public_id
                // console.log(imageid)
                await cloudinary.uploader.destroy(imageid)
                const file = req.files.image
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, ({
                    folder: 'Profile Image'
                }))
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    city: req.body.city,
                    address: req.body.address,
                    image: {
                        public_id: image_upload.public_id,
                        url: image_upload.secure_url
                    }
                }
            } else {
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    city: req.body.city,
                    address: req.body.address
                }
            }
            // const id = req.params.id
            const update = await StudentModel.findByIdAndUpdate(id, data)
            res.redirect('/profile')
        } catch (error) {
            console.log(error);
        }
    }
    static changepassword = async (req, res) => {
        try {
            const { name, email, role, image } = req.data1
            res.render('admin/student/changepassword', { n: name, role: role, img: image, msg: req.flash('error'), msg1: req.flash('success') })
        } catch (error) {
            console.log(error);
        }
    }
    static updatepassword = async (req, res) => {
        try {
            // console.log(req.body)
            const { name, email, id, image } = req.data1
            const { oldpassword, newpassword, cpassword } = req.body
            if (oldpassword && newpassword && cpassword) {
                const user = await StudentModel.findById(id)
                // console.log(user)
                //for compare password
                const ismatched = await bcrypt.compare(oldpassword, user.password)
                if (!ismatched) {
                    req.flash('error', 'Old Password is Incorrect')//for flashing msg
                    res.redirect('/changepassword')
                } else {
                    if (newpassword != cpassword) {
                        req.flash('error', 'New Password and confirm password not matched')//for flashing msg
                        res.redirect('/changepassword')
                    } else {
                        const newhashpassword = await bcrypt.hash(newpassword, 10)
                        const result = await StudentModel.findByIdAndUpdate(id, {
                            password: newhashpassword
                        })
                        req.flash('success', 'Password Updated Successfully')//for flashing msg
                        res.redirect('/changepassword')
                    }
                }
            } else {
                req.flash('error', 'All Fields Are Required')//for flashing msg
                res.redirect('/changepassword')
            }
        } catch (error) {
            console.log(error);
        }
    }
    static logout = async (req, res) => {
        try {
            res.clearCookie("token")
            res.redirect('/')
        } catch (error) {
            console.log(error);
        }
    }

}
module.exports = StudentController;