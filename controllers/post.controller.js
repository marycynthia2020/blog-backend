const pool = require("../utils/dbconnection");

async function createPost(req, res) {
  const user = req.user;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: {
        status: false,
        message: "All fileds are required",
      },
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
      [user.id, title, content]
    );
    if (!result.insertId) {
      return res.status(400).json({
        status: false,
        message: "Failed to create post",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Post created succesfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.log(error.stack);
  }

  //   "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
  //   [user.id, title, content],
  //   (err, result) => {
  //     if (err) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Failed to create post",
  //       });
  //     }

  //     return res.status(201).json({
  //       status: true,
  //       message: "Post created succesfully",
  //       postId: result.insertId,
  //     });
  //   }
  // );
}

async function getAllPosts(req, res) {
  try {
    const [result] = await pool.query("SELECT * FROM posts");

    if (result.length < 1) {
      return res.status(404).json({
        status: false,
        message: "No posts found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Posts fetched succesfully",
      posts: result,
    });
  } catch (error) {
    console.log(error.stack);
  }
}

async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
    if (result.length < 1) {
      return res.status(404).json({
        status: false,
        message: "No post found",
        posts: result[0],
      });
    }
    return res.status(200).json({
      status: true,
      message: "Post fetched succesfully",
      posts: result[0],
    });
  } catch (error) {
    console.log(error.stack);
  }
}

async function postComment(req, res) {
  const user = req.user;
  const { comment } = req.body;
  const { id } = req.params;

  if (!comment) {
    return res.status(404).json({
      status: false,
      message: "All fields required",
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)",
      [user.id, id, comment]
    );

    if (result.insertId) {
      return res.status(200).json({
        status: true,
        message: "Comment posted",
        commentId: result.insertId,
      });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(400).json({
      status: false,
      message: "Failed to post comment",
    });
  }
}

async function getPostComments(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "SELECT * FROM comments WHERE post_id = ?",
      [id]
    );
    if (result.length < 1) {
      return res.status(404).json({
        status: false,
        message: "No comment for this post",
        posts: result[0],
      });
    }
    return res.status(200).json({
      status: true,
      message: "Comments fetched succesfully",
      comments: result,
    });
  } catch (error) {
    console.log(error.stack);
    return res.status(400).json({
      status: false,
      message: "No comment found",
    });
  }
}

async function deletePost(req, res) {
  const user = req.user;
  const { id } = req.params;

  try {
    const [result] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
    if (result.length < 1) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    if (result[0].user_id != user.id) {
      return res.status(400).json({
        status: false,
        message: "You can't delete this post",
      });
    }

    const [rows] = await pool.query(
      "DELETE FROM posts WHERE id = ? AND user_id = ?",
      [result[0].id, result[0].user_id]
    );

    if (rows.affectedRows > 0) {
      return res.status(204).json({
        status: true,
        message: "Post Deleted",
      });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(400).json({
      status: false,
      message: "Post not Deleted",
    });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  postComment,
  getPostComments,
  deletePost,
};
