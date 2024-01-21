const login = (req, res) => {
  res.status(200).json({ message: "Login" });
};

const register = (req, res) => {
  res.status(200).json({ message: "Register" });
};

export { login, register };
