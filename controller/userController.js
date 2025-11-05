import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );
};

// ✅ User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res.json({ success: false, message: "Password is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password!" });
    }

    const token = createToken(user);

    // ✅ এখানে user object সহ পাঠাচ্ছি
    res.json({
      success: true,
      token,
      message: "User Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        isAdmin: user.isAdmin || false,
        userCart: user.userCart || {},
      },
    });
  } catch (error) {
    console.log("User Login error", error);
    res.json({ success: false, message: error.message });
  }
};

// Register User
const userRegister = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    if (!name) return res.json({ success: false, message: "Name is required" });
    if (!email)
      return res.json({ success: false, message: "Email is required" });
    if (!password)
      return res.json({ success: false, message: "Password is required" });

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid Email Address",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User Already exist!" });

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: encryptedPassword,
      isAdmin,
    });

    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log("User register Error", error);
    res.json({ success: false, message: error?.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    if (!password)
      return res.status(400).json({ success: false, message: "Password is required" });

    const user = await userModel.findOne({ email });

    if (!user || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to login as admin!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials!" });
    }

    // ✅ Generate token
    const token = createToken(user);

    console.log("Admin Login success for:", email);

    // ✅ Send token along with admin info
    res.status(200).json({
      success: true,
      token, // frontend should save this to localStorage
      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Admin logged in successfully",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove User
const removeUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "User Deleted Successfully!" });
  } catch (error) {
    console.log("Remove User error", error);
    res.json({ success: false, message: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    const user = await userModel.findById(_id);
    if (!user) return res.json({ success: false, message: "User not found!" });

    if (name) user.name = name;

    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Please enter a valid email address!",
        });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Password must be at least 8 characters!",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
    console.log("Update User Error!", error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Users
const getUser = async (req, res) => {
  try {
    const total = await userModel.countDocuments({});
    const users = await userModel.find({});
    res.json({ success: true, total, users });
  } catch (error) {
    console.log("All user get error!", error);
    res.json({ success: false, message: error.message });
  }
};

export { userLogin, userRegister, adminLogin, removeUser, updateUser, getUser };
