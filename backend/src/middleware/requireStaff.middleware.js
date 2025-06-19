export const requireStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ message: "Staff only" });
  }
  next();
};