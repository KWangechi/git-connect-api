const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Post = require("../models/post");
const LikePost = require("../models/LikePost");

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
  const post = await Post.findOne({ _id: req.params.id });

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
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    return next(
      res.status(404).json({
        message: "User not found",
        code: 404,
      })
    );
  }

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
  const post = await Post.findOneAndDelete({ _id: req.params.id });

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
      code: 204,
    },
  });
});

const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const likePost = await LikePost.findOne({
    postId: req.params.id,
    likedBy: req.userId,
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

  if (likePost) {
    return res.status(400).json({
      status: {
        message: "User has already liked this post",
        code: 400,
      },
    });
  }

  // save the like to it's corresponding Model
  const like = new LikePost({
    likedBy: req.userId,
    postId: req.params.id,
  });

  try {
    await like.save();

    await post.updateOne({
      $inc: { likes: 1 },
      $set: { liked: true },
    });

    res.status(201).json({
      status: {
        message: "Post liked!",
        code: 201,
      },
      data: like,
    });
  } catch (error) {
    return next(
      res.status(500).json({
        status: {
          message: "Error occurred!",
          code: 500,
        },
        data: error.message,
      })
    );
  }
});

const unlikePost = asyncHandler(async (req, res, next) => {
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

  const likePost = await LikePost.findOne({
    postId: req.params.id,
    likedBy: req.userId,
  });

  try {
    if (!likePost) {
      return res.status(400).json({
        status: {
          message: "Action cannot be redone",
          code: 400,
        },
      });
    } else {
      await likePost.deleteOne({
        postId: req.params.id,
        likedBy: req.userId,
      });

      await post.updateOne({
        $inc: { likes: -1 },
      });

      res.status(201).json({
        status: {
          message: "Post unliked!",
          code: 201,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return next(
      res.status(500).json({
        status: {
          message: "Error occurred!",
          code: 500,
        },
        data: error.message,
      })
    );
  }
});

// const getPostLikes = asyncHandler(async (req, res, next) => {
//   const post = await Post.findById(req.params.id);

//   if (!post) {
//     return next(
//       res.status(404).json({
//         status: {
//           message: "Post not found",
//           code: 404,
//         },
//       })
//     );
//   }

//   const allLikes = await LikePost.find({ postId: req.params.id });

//   const likeCount = allLikes.length;

//   res.status(200).json({
//     status: {
//       message: "Success",
//       code: 200,
//     },
//     data: likeCount,
//   });
// });

module.exports = {
  index,
  store,
  show,
  update,
  destroy,
  likePost,
  unlikePost,
};
