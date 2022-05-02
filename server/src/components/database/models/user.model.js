import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcrypt from 'bcryptjs'
import pkg from 'validator';
const { isAlphanumeric, isEmail } = pkg

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    firstName: { type: String, required: true, maxLength: 100, trim: true },
    lastName: { type: String, required: true, maxLength: 100, trim: true },
    date_of_birth: { type: String },
    email: { type: String, required: true, unique: true, validate: [isEmail, 'invalid email'], },
    password: { type: String },
    token: { type: String },
  },
  {
    timestamps: true
  },
  {
    collection: 'users'
  }
);

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

const User = model("Users", userSchema);

export default User