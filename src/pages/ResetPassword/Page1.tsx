import React from 'react';

import QuestionMarkOutlinedIcon from '@mui/icons-material/Key';
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

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

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
    });

    const email = data.get('email') as string;

    if (!email) {
      alert('Please provide an email');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Reset Password Email Sent!');
        location.href = '/';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        alert('Invalid email provided');
      });
  };

  return (
    <>
      <Meta title="reset password" />
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
            <QuestionMarkOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset password
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Reset
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" color="inherit" variant="body2">
                  {'Back to sign in'}
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
