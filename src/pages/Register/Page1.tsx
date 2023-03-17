import React from 'react';

import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import { FullSizeCenteredFlexBox } from '@/components/styled';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import firebaseApp from '@/utils/firebase';

function Page1() {
  const auth = getAuth(firebaseApp);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirm-password'),
    });

    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirm-password') as string;

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Signed in
        // const user = userCredential.user;
        location.href = '/';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Error creating account. Please ensure email and password are valid.');
        console.error(errorCode, errorMessage);
      });
  };

  return (
    <>
      <Meta title="register" />
      <Navbar />
      <Container>
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
            <Person2OutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="confirm-current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2" style={{ color: 'white' }}>
                  {'Have an account? Sign In'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Page1;
