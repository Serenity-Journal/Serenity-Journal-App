import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';

import { User } from '@firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import firebaseApp from '@/utils/firebase';

function Page1() {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        // ...
        setUser(user);
      } else {
        // User is signed out
        // ...
        console.log('Redirecting to login...');
        location.href = '/login';
      }
    });
  }, [auth]);

  return (
    <>
      {user ? (
        <>
          <Meta title="home" />
          <Navbar />
          <FullSizeCenteredFlexBox>
            <Typography variant="h3">TODO: Home located at {'src/pages/Home'}</Typography>
          </FullSizeCenteredFlexBox>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Page1;
