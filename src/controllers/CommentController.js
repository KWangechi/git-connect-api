const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Comment = require("../models/Comment");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CRUD routes

/**
 * Create a Comment
 */
const index = asyncHandler(async (req, res, next) => {
  // get all the Comments from the database using mongoose
  const comments = await Comment.find({ postId: req.params.postId }).populate("commentedBy");

  res.status(200).json({
    status: {
      message: "Success",
      code: 200,
    },
    data: comments,
  });
});

const store = asyncHandler(async (req, res, next) => {
  const comment = new Comment(req.body);

  comment.commentedBy = req.userId;
  comment.postId = req.params.postId;

  try {
    const validationError = comment.validateSync();

    if (validationError) {
      let errors = [];

      for (const field in validationError.errors) {
        errors.push({
          field: field,
          message: validationError.errors[field].message,
        });
      }

      return res.status(400).json({
        status: {
          message: "Invalid comment data",
          code: 400,
        },
        data: errors,
      });
    }

    const savedComment = await comment.save();

    if (!savedComment) {
      return next(
        res.status(500).json({
          status: {
            message: "Error occurred while saving Comment",
            code: 500,
          },
        })
      );
    }

    res.status(201).json({
      status: {
        message: "Comment created successfully",
        code: 201,
      },
      data: savedComment,
    });
  } catch (error) {
    // Handle any other errors that may occur during validation or saving
    return next(
      res.status(500).json({
        status: {
          message: "Error occurred while processing comment",
          code: 500,
        },
        data: error.message,
      })
    );
  }
});

const show = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      res.status(404).json({
        status: {
          message: "Comment not found",
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
    data: comment,
  });
});

const update = asyncHandler(async (req, res, next) => {
  const commentUser = await Comment.findOne({
    commentedBy: req.userId,
    postId: req.params.postId,
  });

  if (!commentUser)
    return next(
      res.status(500).json({
        message: "Action not allowed for this user!",
        code: 500,
      })
    );

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: {
        message: "Comment updated successfully",
        code: 200,
      },
      data: updatedComment,
    });
  } catch (error) {
    return next(
      res.status(500).json({
        status: {
          message: error,
          code: 500,
        },
      })
    );
  }
});

const destroy = asyncHandler(async (req, res, next) => {
  // find the Comment by its ID from the request parameters
  const commentUser = await Comment.findOne({
    commentedBy: req.userId,
    postId: req.params.postId,
  });

  if (!commentUser)
    return next(
      res.status(500).json({
        message: "Action not allowed for this user!",
        code: 500,
      })
    );

  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(
      res.status(404).json({
        status: {
          message: "Comment not found",
          code: 404,
        },
      })
    );
  }

  res.status(200).json({
    status: {
      message: "Comment deleted successfully",
      code: 204,
    },
  });
});

module.exports = { index, store, show, update, destroy };
