const mongoose=require('mongoose');


const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[3,"Username should be atleast  3 character long"]
    },
    email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    unique:true,
    minlength:[13,"Email should be atleast  13 character long"] //min length in array do cheez //pass hoti hai ek min limit aur ek message
                                                                
},
password: {
    type: String,
    required: true,
    trim: true // Removes leading/trailing spaces but doesn’t alter the hash itself
}

})

const  user =mongoose.model('user',userSchema)
module.exports =user;


