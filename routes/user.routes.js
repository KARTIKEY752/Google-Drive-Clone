const express =require('express');

const router =express.Router();
const { body,validationResult } = require('express-validator');
const userModel=require('../models/user.model.js')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')






router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async(req,res)=>{

        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                error:errors.array(),
                message:"invalid data"
            })
        }
        const {username , password}=req.body;
        const user= await  userModel.findOne({
            username:username,
            
            
        })
        
        if(!user){
            return res.status(400).json(
                {
                message:"username or password is incorrect"
            }
        )
        }
       
        const isMatch= await bcrypt.compare(password, user.password) ;//password is the value enterd in login  //user.password is the value in the user database
                                                              

                                                                



            if(!isMatch){
                return res.status(400).json(
                    {
                    message:" username or password is incorrect"   
                    }
                    
            )

            } 
        
          
            const token =jwt.sign({
                userId:user._id,
                email:user.email,
                username:user.username,


            },
        process.env.JWT_SECRET,
    )

    res.cookie('token',token)
    res.redirect('/home');
    
       
  

    }


);
router.get('/register',(req,res)=>{  
    res.render('register');
})
router.post('/register',
    body('email').trim().isEmail().isLength({min:13}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
      async (req,res)=>{

        const errors=validationResult(req);
        
    console.log(req.body)
    
    if(!errors.isEmpty()){
       return res.status(400).json({
        errors:errors.array(),
        message:'invalid data'
       })
    }
       const {email ,username,password}=req.body;

           const hashPassword=await bcrypt.hash(password,12) //for keeping the password safe humlog bcrypt naam ka package install karenge 
                            // npm i brcypt uske baad const bcrypt=require('bcrypt')
                            //10 number of times hashing is performed 10 is a good value for the password to be hashed

       const newUser= await userModel.create({
        username,
        email,
        password: hashPassword,
        
        
       })
       
       res.redirect('./login');

    
   
    

})
module.exports=router;





