const bcrypt = require('bcrypt');
const db = require('../models'); // Your database instance

exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate input
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const newUser = await db.User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await db.User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Successful sign-in (you can also generate a token here if needed)
      res.status(200).json({ message: 'Sign-in successful' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
