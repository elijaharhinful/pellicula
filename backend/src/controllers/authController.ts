import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/user';

/**
 * Registers a new user in the system
 * @param req - Express request object containing user registration data
 * @param res - Express response object
 * @returns Promise<void>
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    // Check if user already exists with the same email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      // Return specific error message based on which field conflicts
      res.status(400).json({
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
      return;
    }

    // Hash the password using bcrypt with 12 salt rounds for security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance with hashed password
    const user = new User({
      username,
      email,
      password: hashedPassword,
      favourites: [] // Initialize empty favourites array
    });

    // Save user to database
    await user.save();

    // Generate JWT token with user information
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET!, // JWT secret from environment variables
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send success response with token and user data (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favourites: user.favourites
      }
    });
  } catch (error) {
    // Log error for debugging and send generic error response
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Authenticates a user and provides a JWT token
 * @param req - Express request object containing login credentials
 * @param res - Express response object
 * @returns Promise<void>
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user by email address
    const user = await User.findOne({ email });
    if (!user) {
      // Return generic error message to prevent email enumeration
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Return same generic error message for consistency
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET!, // JWT secret from environment variables
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send success response with token and user data (excluding password)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favourites: user.favourites,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    // Log error for debugging and send generic error response
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Retrieves the authenticated user's profile information
 * @param req - AuthRequest object containing authenticated user data
 * @param res - Express response object
 * @returns Promise<void>
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Find user by ID from JWT token, excluding password field from results
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Send user profile data (password already excluded by select)
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favourites: user.favourites,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    // Log error for debugging and send generic error response
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};