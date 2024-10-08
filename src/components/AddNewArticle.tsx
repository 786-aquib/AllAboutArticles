import React, { useState } from 'react';
import { Button, TextField, Box, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { addArticle } from '../redux/articleSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import WebsiteName from './WebsiteName';
import AvatarDemo from './Avatar';

// Define the TypeScript interface for form inputs
interface IFormInput {
  title: string;
  description: string;
  body: string;
  tags: string;
}

const CreateNewArticle = () => {
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<IFormInput>({
    mode: 'onChange' // Validate on each change
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | null }>({
    open: false,
    message: '',
    severity: null,
  });

  // Define the submit handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const articleData = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: data.tags.split(',').map(tag => tag.trim()),
      author: {
        username: 'default',
        bio: '',
        image: 'default-image-url',
        following: false
      }
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.realworld.io/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ article: articleData }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      dispatch(addArticle(result.article));
      setSnackbar({ open: true, message: 'Article created successfully!', severity: 'success' });
      navigate('/Home'); // Redirect after successful creation
    } catch (error) {
      console.error('Error creating article:', error);
      setSnackbar({ open: true, message: 'Error creating article.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div> 
      <div style={{ overflow: 'hidden', margin: 0, padding: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0.5, // Optional: Add padding for spacing
          overflow: 'hidden', // Ensure no overflow
          width: '100%', // Ensure Box takes full width
          bgcolor: 'aliceblue',
        }}
      >
        <WebsiteName />
        <div
        style={{
            backgroundColor: 'blanchedalmond',
            fontVariant: 'traditional',
            fontSize: 20,
        }}
        >
            Create New Article
        </div>
        <Box 
        sx={ {
             display: 'flex',
             marginRight: 2,
             
        }}
        >
            <AvatarDemo />
            
        </Box>
        </Box>
    </div>
    <Container
      maxWidth="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{                           
          width: '100%',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Box mb={2}>
          <TextField
            label="Title"
            fullWidth
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 1, message: 'Title must be at least 1 character long' }
            })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ''}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            {...register('description', {
              required: 'Description is required'
            })}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ''}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Body"
            fullWidth
            multiline   
            rows={6}
            {...register('body', {
              required: 'Body is required'
            })}
            error={!!errors.body}
            helperText={errors.body ? errors.body.message : ''}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Tags (comma-separated)"
            fullWidth
            {...register('tags', {
              required: 'Tags are required',
              pattern: {
                value: /^[\w\s,]+$/,
                message: 'Tags must be comma-separated words'
              }
            })}
            error={!!errors.tags}
            helperText={errors.tags ? errors.tags.message : ''}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ width: '100%', marginTop: '1rem' }}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Article'}
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position Snackbar at top right
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: snackbar.severity === 'error' ? 'red' : 'green',
          },
        }}
      />
    </Container>
    </div>
  );
};

export default CreateNewArticle;