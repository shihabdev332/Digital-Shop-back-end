import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided!" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Admin Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
