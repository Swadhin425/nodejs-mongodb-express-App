const mongoose= require('mongoose');
const bcrypt=require('bcrypt');
const saltRounds=10;
const jwt= require('jsonwebtoken');


//user schema
const UserSchema= mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        unique:1,
        trim:true
    },
    password:{
        type:String,
        minlength:6
    },
    lastname:{
        type:String,
        maxlength:50
    },
    token:{
        type:String
    }
});
//pre save middileware
UserSchema.pre('save',function(next){
    console.log("inside pre middleware");
    var user=this;
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) return next(err);

            user.password=hash;
            next()
        });
    })
  }else{
      next();
  }
    
})

//compare password methods
UserSchema.methods.comparePassword= function(password,cb){
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null,isMatch);
        // result == true
    });
    
}

//create a token
UserSchema.methods.generateToken= function(cb){
    var user=this;
    var token= jwt.sign(user._id.toHexString(),'secret');
    if(token){
        user.token=token;
    }

    user.save(function(err,user){
        if(err)  return cb(err);
        cb(null,user);
    })
}

UserSchema.statics.findByToken= function(token,cb){
    console.log(token);
jwt.verify(token,'secret',function(err,decode){
    console.log(decode);
    User.findOne({"_id":decode,"token":token},function(err,user){
        if(err)  return cb(err);
        console.log(user);
        cb(null,user);
    })
})
}
//creating a model
const User= mongoose.model('User',UserSchema);

module.exports={User}