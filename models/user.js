const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},
  password: { type: String, minlength: 5 },
  
  facebookId: { type: String },
  tokens: Array,

  googleId: { type: String },

  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' }
  },
  address: String,
  history: [{
    paid: { type: Number, default: 0 },
    item: { type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 0 }
  }]
});

UserSchema.pre('save', function (next) {
  const user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if(err) return next(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePasswords = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size) {
  if(!this.size) size = 200;
  if(!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
}

module.exports = mongoose.model('User', UserSchema);