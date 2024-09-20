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
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { tokenToString } from 'typescript';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultTheme = createTheme();

interface ISignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ISignInForm>();
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('error');
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit: SubmitHandler<ISignInForm> = async (data) => {
    setLoading(true); // Start loading

    try {
      const response = await fetch('https://api.realworld.io/api/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email: data.email.trim(), password: data.password.trim() },
        }),
      });

    //  https://api.realworld.io//api/articles/:slug/favorite
    //  https://api.realworld.io/api/articles/:slug
 
      if (response.ok) {
        const result = await response.json();
        let successMessage = "Sign-In Successful!";
        setSnackbarMessage(successMessage);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        console.log('Sign in successful:', result);
        localStorage.setItem('token', result.user.token);
        

        navigate("/Home");
      } else {
        const errorResponse = await response.json();
        let errorMessage = 'Failed to sign in. Please try again.';
        if (errorResponse.errors) {
          const errorMessages = Object.entries(errorResponse.errors)
            .map(([key, messages]) => {
              if (Array.isArray(messages)) {
                return `${key}: ${messages.join(', ')}`;
              }
              return `${key}: Invalid error format`;
            })
            .join(', ');
          errorMessage = `Errors: ${errorMessages}`;
        } else if (response.status === 401) {
          errorMessage = 'Unauthorized: Invalid email or password.';
        }
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setSnackbarMessage('Failed to sign in. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // End loading
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
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'Email is required',                                                                              
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Type a Valid Email Address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}     
              disabled={loading} // Disable button when loading
            > 
              Sign In
            </Button>
            <Grid container>
              <Grid item marginLeft={12}>
                <Link href="/Signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
                         
    















