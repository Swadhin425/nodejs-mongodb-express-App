const express =require('express');
const router= express.Router();
const {User} = require("../models/User");
const {auth}  =require("../middleware/auth");


router.get("/auth",auth,(req,res)=>{
    res.status(200).json({
        _id:req.user._id,
        isAuth:true,
        lastname:req.user.lastname
    })
})
//get all users

//register user
router.post("/register",(req,res)=>{
    const user = new User(req.body);

    user.save((err,doc)=>{
        if(err)  return res.json({success: false,err});
        return res.status(200).json({
            success:true
        });
    })
})

//login user

router.post("/login",(req,res)=>{
    //find the email
    User.findOne({email: req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess:false,
                msg:"Auth failed ,email not found"
            }) 
        }

        //compare the password

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch){
                res.json({  loginSuccess:false,
                    msg:"Wrong Password"
                })
            }

            //generate a token
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie("w_auth",user.token).status(200).json({
                    loginSuccess:true
                })
            })
           
        })

    })
})

router.post("/logout",auth,(req,res)=>{
   User.findOneAndUpdate({_id:req.user._id},{token:""},(err,doc)=>{
       if(err) return res.json({success:false,err})
       res.clearCookie('w_auth');
       return res.json({success:true})
   })
})

module.exports=router;