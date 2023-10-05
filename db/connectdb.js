const mongoose = require ('mongoose')
const Db_liveurl = 'mongodb+srv://shivambhd30:shivam8839336599@cluster0.jy77ono.mongodb.net/itmgrievanceportal?retryWrites=true&w=majority&appName=AtlasApp'
const local_url = 'mongodb://127.0.0.1:27017/itmgrievanceportal'

const connectDb =()=>{
    return mongoose.connect(Db_liveurl)
    .then(()=>{
        console.log('connection successfully')
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports= connectDb