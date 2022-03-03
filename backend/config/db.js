import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected'.cyan.underline);
  } catch (error) {
    console.error(`${error}`.red.underline.bold);
  }
};

export default connectDB;
