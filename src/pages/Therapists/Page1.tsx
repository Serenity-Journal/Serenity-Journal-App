import React, { useEffect, useState } from 'react';

import { Card, CardContent } from '@mui/material';
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

import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';

import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import firebaseApp from '@/utils/firebase';

// import Button from "@mui/material/Button";
// import Image from "material-ui-image";

interface Therapist {
  id: string;
  imageUrl: string;
  name: string;
  phone?: string;
  email?: string;
}

function Page1() {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [therapists, setTherapists] = useState<Array<Therapist>>([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('Redirecting to login...');
        location.href = '/login';
      }
    });
  }, [auth]);

  useEffect(() => {
    const colRef = query(collection(db, 'therapists'));
    onSnapshot(colRef, (snapshot) => {
      let newJournals: Array<Therapist> = [];
      snapshot.docs.forEach((doc) => {
        const journalData = doc.data();
        journalData.id = doc?.id || 'no id';
        newJournals.push(journalData as Therapist);
      });
      newJournals = newJournals.sort((a, b) => a.id.localeCompare(b.id));
      setTherapists(newJournals);
    });
  }, [db]);

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
          {therapists.map((therapist) => {
            return (
              <Card
                key={therapist.id}
                sx={{ minWidth: 275, width: 600, maxWidth: '100%', mt: 3, background: 'white' }}
              >
                <CardContent style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flexGrow: 1 }}>
                    <Typography sx={{ mb: 1.5 }} color="text.primary">
                      {therapist.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {therapist.email}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {therapist.phone}
                    </Typography>
                  </div>
                  <div>
                    <img
                      alt="therapist"
                      height="120px"
                      width="auto"
                      style={{
                        borderRadius: '100%',
                        border: 'solid',
                        borderWidth: '0.5px',
                        borderColor: 'rgba(0,0,0,0.44)',
                      }}
                      src={therapist.imageUrl}
                    ></img>
                  </div>
                </CardContent>
                {/*<CardActions>*/}
                {/*    <Button size="small">Website</Button>*/}
                {/*</CardActions>*/}
              </Card>
            );
          })}
        </Box>
      </Container>
    </>
  );
}

export default Page1;
