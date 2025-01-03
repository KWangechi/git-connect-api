const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Post = require("../models/post");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CRUD routes

/**
 * Create a Post
 */
const index = asyncHandler(async (req, res, next) => {
  // get all the Posts from the database using mongoose
  const posts = await Post.find();

  res.status(200).json({
    status: {
      message: "Success",
      code: 200,
    },
    data: posts,
  });
});

const store = asyncHandler(async (req, res, next) => {
  const post = new Post(req.body);

  post.userId = req.userId;
  post.createdBy = req.userId;

  try {
    const validationError = post.validateSync();

    if (validationError) {
      let errors = [];

      console.log(validationError.errors);

      for (const field in validationError.errors) {
        errors.push({
          field: field,
          message: validationError.errors[field].message,
        });
      }
      return res.status(400).json({
        status: {
          message: "Invalid post data",
          code: 400,
        },
        data: errors,
      });
    }

    // save the Post to the database
    const savedPost = await post.save();

    if (!savedPost) {
      return next(
        res.status(500).json({
          status: {
            message: "Error occurred while saving post",
            code: 500,
          },
        })
      );
    }

    res.status(201).json({
      status: {
        message: "Post created successfully",
        code: 201,
      },
      data: savedPost,
    });
  } catch (error) {
    // Handle any other errors that may occur during validation or saving
    return next(
      res.status(500).json({
        status: {
          message: "Error occurred while processing post",
          code: 500,
        },
        data: error.message,
      })
    );
  }
});

const show = asyncHandler(async (req, res, next) => {
  // find the Post by its ID from the request parameters
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      res.status(404).json({
        status: {
          message: "Post not found",
          code: 404,
        },
      })
    );
  }

  res.status(200).json({
    status: {
      message: "Success",
      code: 200,
    },
    data: post,
  });
});

const update = asyncHandler(async (req, res, next) => {
  // find the Post by its ID from the request parameters and the current user Id
  const user = await User.findOne({ username: req.params.username });

  if (!user)
    return next(
      res.status(404).json({
        message: "User not found",
        code: 404,
      })
    );

  if (req.userId !== user._id?.toString()) {
    return next(
      res.status(500).json({
        status: {
          message: "Action not allowed for this username!",
          code: 500,
        },
      })
    );
  }

  // the posts should be for the user that has been found

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(
      res.status(404).json({
        status: {
          message: "Post not found",
          code: 404,
        },
      })
    );
  }

  res.status(200).json({
    status: {
      message: "Post updated successfully",
      code: 200,
    },
    data: post,
  });
});

const destroy = asyncHandler(async (req, res, next) => {
  // find the Post by its ID from the request parameters
  const user = User.findOne({ username: req.params.username });

  if (req.userId !== user._id.toString()) {
    return next(
      res.status(500).json({
        status: {
          message: "Action not allowed for this username!",
          code: 500,
        },
      })
    );
  }
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(
      res.status(404).json({
        status: {
          message: "Post not found",
          code: 404,
        },
      })
    );
  }

  res.status(204).json({
    status: {
      message: "Post deleted successfully",
      code: 204,
    },
  });
});

module.exports = { index, store, show, update, destroy };
