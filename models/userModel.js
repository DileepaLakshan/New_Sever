import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = mongoose.Schema(
  {
    uid: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String,},
    isAdmin: { type: Boolean, required: true, default: false },
    firstName: { type: String },
    lastName: { type: String },
    contactNumber1: { type: String },
    contactNumber2: { type: String },
    shippingAddress: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      district: { type: String },
      province: { type: String },
      zipCode: { type: String },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Referencing the Product model
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        
      },
    ],
  },
  { timestamps: true }
);

// Method to match the entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash passwords before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.getResetPasswordToken= function(){
  const  resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 2 * 60 * 1000; //two minutes
  return resetToken;
};
// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
