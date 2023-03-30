import React from 'react';

// import QuestionMarkOutlinedIcon from '@mui/icons-material/Key';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { FullSizeCenteredFlexBox } from '@/components/styled';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
// import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';

// import firebaseApp from '@/utils/firebase';

function Page1() {
  // const auth = getAuth(firebaseApp);

  return (
    <>
      <Meta title="reset password" />
      <Navbar />
      <Container>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Licensed Therapists
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default Page1;
