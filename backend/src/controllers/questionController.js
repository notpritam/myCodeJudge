export const submitCode = (req, res) => {
  console.log(req.body);
  res.send("Submit Code False");
};

export const addQuestion = (req, res) => {
  console.log(req.body);
  res
    .json({
      id: "1",
    })
    .status(200);
};
