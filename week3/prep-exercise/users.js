import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const users = [];
const JWT_SECRET = 'secret_key';

// Middleware to validate request body for required fields
export const validateRequestBody = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  next();
};

// Middleware to find user by username
export const findUserByUsername = (req, res, next) => {
  const { username } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  req.user = user;
  next();
};

// Middleware to verify password
export const verifyPassword = async (req, res, next) => {
  const { password } = req.body;
  const passwordMatch = await bcrypt.compare(password, req.user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  next();
};

// Middleware to generate JWT token
export const generateToken = (req, res, next) => {
  const token = jwt.sign({ id: req.user.id }, JWT_SECRET);
  req.token = token;
  next();
};

// Middleware to extract JWT token from Authorization header
export const extractToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  req.token = token;
  next();
};

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Sample route handler for register endpoint
export const register = async (req, res) => {
  const { username, password } = req.body;
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword
  };

  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username } });
};

export const login = (req, res) => {
  res.json({ token: req.token });
};

export const getProfile = (req, res) => {
  const { id, username } = req.user;
  res.json({ id, username });
};
export const logout = (req, res) => {
  res.status(204).end();
};

// Define routes and attach middlewares
router.post('/register', validateRequestBody, register);
router.post('/login', validateRequestBody, findUserByUsername, verifyPassword, generateToken, login);
router.get('/profile', extractToken, verifyToken, getProfile);
router.post('/logout', logout);

export default router;