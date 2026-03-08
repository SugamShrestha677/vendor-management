import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/emailService.js';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// In authController.js
export const register = asyncHandler(async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    const { firstName, lastName, email, password, role, department, companyName, vendorCategories, vendorRegistrationNumber } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      isVerified: false
    };

    // Add role-specific fields
    if (role === 'vendor') {
      if (!companyName) {
        return res.status(400).json({ message: 'Company name is required for vendors' });
      }
      if (!vendorRegistrationNumber) {
        return res.status(400).json({ message: 'Vendor registration number is required' });
      }
      
      userData.companyName = companyName;
      userData.vendorRegistrationNumber = vendorRegistrationNumber;
      
      // Handle vendorCategories - ensure it's an array
      if (vendorCategories) {
        userData.vendorCategories = Array.isArray(vendorCategories) 
          ? vendorCategories 
          : [vendorCategories].filter(Boolean);
      }
      
      // department is not needed for vendors
      delete userData.department;
    } else {
      if (department) {
        userData.department = department;
      }
    }

    console.log('Creating user with data:', userData);

    user = new User(userData);
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error details:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.isLocked()) {
    return res.status(401).json({ message: 'Account is locked. Try again later.' });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    await user.incLoginAttempts();
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  await user.resetLoginAttempts();

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: user.toJSON()
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    profileImage: req.body.profileImage
  };

  if (req.user.role === 'vendor') {
    fieldsToUpdate.companyName = req.body.companyName;
    fieldsToUpdate.vendorCategories = req.body.vendorCategories;
    fieldsToUpdate.bankDetails = req.body.bankDetails;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpire = Date.now() + 30 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `Click the link to reset your password: ${resetUrl}`
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    return res.status(500).json({ message: 'Email could not be sent' });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: user.toJSON()
  });
});
