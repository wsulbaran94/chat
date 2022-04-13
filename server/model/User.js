const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userModelSchema = new mongoose.Schema({
    nickname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: false, default:'' },
    createdAt: { type: Date, default: Date.now },
})


userModelSchema.pre('save', (function (next) {
    const _this = this;
  
    if (!this.isModified('password')) {
      return next();
    }
  
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
  
      bcrypt.hash(this['password'], salt, function (err, hash) {
        if (err) {
          return next(err);
        }
  
        _this['password'] = hash;
        next();
      });
    });
}));

userModelSchema.methods.isPasswordValid = function (password) {
    return bcrypt.compareSync(password, this.password);
};
  
module.exports = mongoose.model('User', userModelSchema);