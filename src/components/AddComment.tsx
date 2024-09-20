import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

const CommentsSection: React.FC<{ slug: string }> = ({ slug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTxt, setCommentTxt] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}/comments`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [slug]);

  const handleSend = async () => {
    if (commentTxt.trim()) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Authentication token doesn't exist!");
          return;
        }

        const response = await axios.post(
          `https://api.realworld.io/api/articles/${slug}/comments`,
          {
            comment: {
              body: commentTxt,
            },
          },
          {
            headers: {
              'Authorization': `Token ${token}`,
            },
          }
        );
        setComments((prevComments) => [...prevComments, response.data.comment]);
        setCommentTxt("");
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  };

  const DeleteComment = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Authentication token doesn't exist!");
        return;
      }

      await axios.delete(
        `https://api.realworld.io/api/articles/${slug}/comments/${id}`,
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );
      setComments((prevComments) => prevComments.filter(comment => comment.id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        maxHeight: '400px',
        overflowY: 'auto',
        bgcolor: 'whitesmoke',
        marginTop: 2,
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        Comments
      </Typography>
      {comments.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={comment.author.image}
                  alt={comment.author.username}
                  style={{ borderRadius: '50%', width: 30, height: 30, marginRight: 8 }}
                />
                <Typography variant="body1" fontWeight="bold">
                  {comment.author.username}
                </Typography>
                <Button
                  onClick={() => DeleteComment(comment.id)}
                  variant='text'
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    fontSize: '0.75rem',
                    color: 'red',
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {comment.body}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No comments yet.</Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mt: 1,
          bgcolor: 'white',
          borderTop: '1px solid #ddd',
          p: 1,
        }}
      >
        <TextField
          label="Add Comment"
          variant="filled"
          value={commentTxt}
          onChange={(e) => setCommentTxt(e.target.value)}
          sx={{ flexGrow: 1, marginRight: 1 }}
        />
        <Button onClick={handleSend} variant="contained" color="primary">
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsSection;
