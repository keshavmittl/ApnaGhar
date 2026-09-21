import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const getCookieOptions = (maxAge) => {
  // Automatically detect cross-origin production environments
  const isProduction = process.env.NODE_ENV === "production" || 
                       (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost"));

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge,
  };
};
};

// Cookie lifetime in milliseconds; the JWT itself uses the "7d" shorthand
// because jsonwebtoken reads a bare number as SECONDS.
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
const TOKEN_EXPIRES_IN = "7d";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Lightweight, dependency-free validation for the register payload.
const validateRegisterInput = ({ username, email, password }) => {
  if (typeof username !== "string" || typeof email !== "string") {
    return "Username, email, and password are required.";
  }

  if (username.length < 3 || username.length > 20) {
    return "Username must be between 3 and 20 characters.";
  }

  if (!USERNAME_REGEX.test(username)) {
    return "Username can only contain letters, numbers, and underscores.";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please provide a valid email address.";
  }

  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return null;
};

export const register = async (req, res) => {
  // db operations
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const trimmedUsername = String(username).trim();
    const trimmedEmail = String(email).trim();

    const validationError = validateRegisterInput({
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (!process.env.JWT_SECRET_KEY) {
      return res
        .status(500)
        .json({ message: "Server authentication is not configured correctly." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: trimmedUsername,
        email: trimmedEmail.toLowerCase(),
        password: hashedPassword,
      },
    });
    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRES_IN,
      }
    );

    // Never leak the password hash back to the client.
    const userInfo = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
    };

    // Set the JWT token in a cookie
    res
      .cookie("token", token, getCookieOptions(COOKIE_MAX_AGE))
      .status(201)
      .json({ message: "User created successfully!", userInfo });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "That username or email is already registered." });
    }

    res
      .status(500)
      .json({ message: "We couldn't create your account right now." });
  }
};
export const login = async (req, res) => {
  // db operations
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    if (!process.env.JWT_SECRET_KEY) {
      return res
        .status(500)
        .json({ message: "Server authentication is not configured correctly." });
    }

    const trimmedUsername = String(username).trim();

    const user = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRES_IN,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    // Set the JWT token in a cookie
    res
      .cookie("token", token, getCookieOptions(COOKIE_MAX_AGE))
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "We couldn't log you in right now." });
  }
};
export const logout = (req, res) => {
  //db operations
  res
    .clearCookie("token", getCookieOptions(0))
    .status(200)
    .json({ message: "Logout Successful" });
};
