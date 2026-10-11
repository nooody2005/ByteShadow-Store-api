const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const User = require('./models/userModel');

async function createAdmin() {
  try {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    console.log('Database name:', new URL(DB).pathname);

    await mongoose.connect(DB);
    console.log('Database connected');

    const existingUser = await User.findOne({
      email: 'admin2@byteshadow.com'
    });

    if (existingUser) {
      console.log('This admin already exists');
      return;
    }

    const admin = await User.create({
      name: 'Byte Shadow Admin 2',
      email: 'admin2@byteshadow.com',
      password: 'test1234',
      passwordConfirm: 'test1234',
      role: 'admin'
    });

    console.log('Admin created:', admin.email);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
