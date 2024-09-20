import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Token } from '@mui/icons-material';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultTheme = createTheme();

interface ISignUpForm {
  username: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ISignUpForm>();
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('error');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };        
  
  const onSubmit: SubmitHandler<ISignUpForm> = async (data) => {
    try {
      const response = await fetch('https://api.realworld.io/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: data.username,
            email: data.email,
            password: data.password,
          }
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.errors ? 'User already exists.' : 'Failed to sign up. Please try again.';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Server response:', result);
      localStorage.setItem('username', data.username);
      navigate("/SignIn");
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage((error as Error).message || 'Failed to sign up.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
                                                                        
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',       
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField            
                  fullWidth
                  label="Username"
                  id="username"
                  autoComplete="username"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters long'
                    }         
                  })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"                  
                  id="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Email must be a valid email address'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>            
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long'
                    },
                    pattern: {
                      value: /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
                      message: 'Password must include uppercase, lowercase, and a number'
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>       
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end" marginLeft={-10}>
              <Grid item>
                <Link href="/SignIn" variant="body2" >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>                    
      </Container>
      <Snackbar
        open={snackbarOpen}    
        autoHideDuration={4000}    
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning Snackbar
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
                                                                                                                                               