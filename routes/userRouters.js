import express from "express";
import {
  adminLogin,
  removeUser,
  userLogin,
  userRegister,
  updateUser,
  getUser,
} from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouters = express.Router();


userRouters.post("/register", userRegister);
userRouters.post("/login", userLogin);
userRouters.post("/admin", adminLogin);
userRouters.post("/remove", removeUser);
userRouters.put("/update/:_id", updateUser);
userRouters.get("/users",adminAuth, getUser)

export default userRouters;
