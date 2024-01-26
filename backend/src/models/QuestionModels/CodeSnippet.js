import mongoose from "mongoose";

const codeSnippetSchema = new mongoose.Schema({
  _id: Number,
  lang: {
    type: String,
    required: true,
  },
  langSlug: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const CodeSnippet = mongoose.model("CodeSnippet", codeSnippetSchema);

export default CodeSnippet;
