const ComplaintModel = require('../models/Complaint')
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer')

cloudinary.config({ 
    cloud_name: 'dz5anoip8', 
    api_key: '689968534498441', 
    api_secret: 'RL6tp87urpCYLG6oPdZjklk7KKg',
    //secure: true
  });;

class ComplaintController {

    static addcomplaint = async (req, res) => {
        try {
            const { name, email, role, image, id } = req.data1
            const cdata = await ComplaintModel.find({user_id:id})
            res.render('complaint/addcomplaint', { c: cdata, n: name, role: role, img: image, user_id: id })
        } catch (error) {
            console.log(error)
        }
    }
    static complaintinsert = async (req, res) => {
        try {
            const { name, email, role, image, id } = req.data1
            // console.log(req.body);
            // console.log(req.files.image);
            const { ctype, semester, subject, cdetail, user_id } = req.body
            const complaint = await ComplaintModel.findById(id)
            // console.log(id);
            const file = req.files.image
            const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'complaint Image'
            })
            const r = new ComplaintModel({
                name: name,
                email: email,
                ctype: ctype,
                cdetail: cdetail,
                semester: semester,
                subject: subject,
                user_id: id,
                image: {
                    public_id: image_upload.public_id,
                    url: image_upload.secure_url
                }
            })
            await r.save()
            this.sendEmail1(name, email,ctype)
            // console.log(r);
            res.redirect('/addcomplaint')
        } catch (error) {
            console.log(error);
        }
    }

    static complaintview = async (req, res) => {
        try {
            // console.log(req.params.id);
            const { name, email, role, image, id } = req.data1
            //    console.log(req.params.id)
            const cdata = await ComplaintModel.findById(req.params.id)
            // console.log(cdata);
            res.render('complaint/view', { c: cdata, n: name, role: role, img: image, user_id: id })
        } catch (error) {
            console.log(error);
        }
    }
    static complaintedit = async (req, res) => {
        try {
            // console.log(req.params.id);
            const { name, email, role, image, id } = req.data1
            const cdata = await ComplaintModel.findById(req.params.id)
            // console.log(cdata);
            res.render('complaint/edit', { c: cdata, n: name, role: role, img: image, user_id: id })
        } catch (error) {
            console.log(error);
        }
    }
    static complaintupdate = async (req, res) => {
        try {
            // console.log(req.body);
            // console.log(req.files.image);
            const { name, email, role, image, id } = req.data1
            // const { ctype, semester, subject, cdetail, user_id} = req.body
            if (req.files) {
                const complaint = await ComplaintModel.findById(req.params.id)//find image id
                // console.log(id);
                const imageid = complaint.image.public_id
                // console.log(imageid);
                await cloudinary.uploader.destroy(imageid)//1st destroy image id
                const file = req.files.image
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, ({
                    folder: 'complaint Image'
                }))
                var cdata = {
                    ctype: req.body.ctype,
                    semester: req.body.semester,
                    subject: req.body.semester,
                    cdetail: req.body.cdetail,
                    image: {
                        public_id: image_upload.public_id,
                        url: image_upload.secure_url
                    }
                }
                // console.log(cdata);

            } else {
                var cdata = {
                    ctype: req.body.ctype,
                    semester: req.body.semester,
                    subject: req.body.semester, 
                    cdetail: req.body.cdetail,
                }
            }
            const user_id = req.params.id
            const update = await ComplaintModel.findByIdAndUpdate(user_id, cdata)
            // console.log(cdata);
            res.redirect('/addcomplaint')

        } catch (error) {
            console.log(error);
        }
    }
    static complaintdelete = async(req,res)=>{
        try{
            await ComplaintModel.findByIdAndDelete(req.params.id)
            res.redirect('/addcomplaint')
        }catch(error){
            console.log(error);
        }
    }
    static updatestatus = async(req,res)=>{
        try{
            const {name, email, comment, status} = req.body
            // console.log(req.body);
            await ComplaintModel.findByIdAndUpdate(req.params.id,{
                comment:comment,
                status:status
            })
            this.sendEmail(name,email, comment, status)
            res.redirect('/displaycomplaint')
        }catch(error){
            console.log(error);
        }
    }
    // static sendEmail = async(name, email, comment, status)=> {
    //     //console.log("email sending")
    //     //console.log("propertyName")
    //     // console.log(name,email, comment, status)

    //     // connect with the smtp server

    //     let transporter = await nodemailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 587,

    //         auth: {
    //             user: "shivambhd30@gmail.com",
    //             pass: "RMX3085",
    //         },
    //     });
    //     let info = await transporter.sendMail({
    //         from:"test@gmail.com", //sender address
    //         to: email, //list of receivers
    //         subject: `Complaint ${status} Succesfully`, //Subject line
    //         text: "hello", //plain text body
    //         html: `<b>${name}</b> Complaint <b>${status}</b> successfully !Complaint <b>${comment}</b>`, // html body
    //     });
    //      console.log("Message sent: %s", info.messageId);
    // }

    // static sendEmail1 = async(name, email, ctype)=> {
    //     //console.log("email sending")
    //     //console.log("propertyName")
    //     console.log(name,email,ctype)

    //     // connect with the smtp server

    //     let transporter = await nodemailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 587,

    //         auth: {
    //             user: "iamshivambhd30@gmail.com",
    //             pass: "",
    //         },
    //     });
    //     let info = await transporter.sendMail({
    //         from:"iamshivambhd30@gmail.com", //sender address
    //         to: email, //list of receivers
    //         subject: `Complaint send Succesfully`, //Subject line
    //         text: "hello", //plain text body
    //         html: `<b>${name}</b> Complaint <b>${ctype}</b> successfully !Please Wait for response`, // html body
    //     });
    //      console.log("Message sent: %s", info.messageId);
    // }

}



module.exports = ComplaintController