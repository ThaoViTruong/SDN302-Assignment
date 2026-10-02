var express = require("express");
var router = express.Router();

const Post = require("../models/Post");

// CREATE
router.post("/", async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - lấy tất cả Post + thông tin Author
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - lấy 1 Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author");

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
      },
      {
        new: true
      }
    ).populate("author");

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;