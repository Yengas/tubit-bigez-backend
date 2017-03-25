const mongoose = require('mongoose'),
      log = require('../logger');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  profile: {
    name: String,
    picture: String
  }
}, { timestamps: true });

/**
 * Finds the given user by given email
 * @param email {String} email address to find the user with.
 * @return {Query|*}
 */
userSchema.statics.findByEmail = function(email){
  return this.findOne({ email })
    .then(user => user ? Promise.resolve(user) : Promise.reject(new Error('User not found!')));
};

/**
 * Profile to search the user with, creates and returns the user if it can't find it.
 * @param profile
 */
userSchema.statics.createOrFindWithProfile = function(user){
  return this.findByEmail(user.email)
    .catch(() => {
      log.info({ user }, "Couldn't user, creating.");
      const newUser = new this(user);
      return newUser.save();
    });
};

const User = mongoose.model('User', userSchema);
module.exports = User;