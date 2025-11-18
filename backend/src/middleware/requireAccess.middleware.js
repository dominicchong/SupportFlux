export const requireAccess = (req, res, next) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== "staff" && role !== "admin") {
    return res.status(403).json({ message: "Staff Access Only!" });
  }
  next();
};