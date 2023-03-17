import React from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
    });

    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Signed in
        // const user = userCredential.user;
        // ...
        location.href = '/';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Invalid email or password');
        console.error(errorCode, errorMessage);
      });
  };

  return (
    <>
      <Meta title="login" />
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset-password" color="inherit" variant="body2" style={{}}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" color="inherit" variant="body2" style={{}}>
                  {"Don't have an account? Sign Up"}
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
