// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   let token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       msg: "No token, authorization denied",
//     });
//   }

//   // Remove "Bearer " if present
//   if (token.startsWith("Bearer ")) {
//     token = token.slice(7, token.length).trim();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id: user._id }
//     next();
//   } catch (err) {
//     res.status(401).json({
//       success: false,
//       msg: "Token invalid",
//     });
//   }
// };

// export default authMiddleware;
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        msg: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Bearer token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null") {
      return res.status(401).json({
        success: false,
        msg: "Token not valid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
};

export default authMiddleware;

