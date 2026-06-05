require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const email = 'browser@test.com';
const testPassword = 'password123';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('User found:', { email: user.email, username: user.username, id: user._id });
    console.log('Stored password hash:', user.password);

    const match = await bcrypt.compare(testPassword, user.password);
    console.log(`bcrypt.compare with '${testPassword}':`, match);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
