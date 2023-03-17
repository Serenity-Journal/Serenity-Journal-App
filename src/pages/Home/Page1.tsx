import React, { useEffect, useState } from 'react';

import { TextareaAutosize } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { User } from '@firebase/auth';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection, // getDocs,
  // query,
  // where,
  getFirestore, // deleteDoc,
  // doc, setDoc,
  // GeoPoint, getDoc,
  onSnapshot,
} from 'firebase/firestore';

import { API_URL } from '@/api';
import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import firebaseApp from '@/utils/firebase';

interface JournalUser {
  uid: string;
  displayName?: string;
  email?: string;
}

interface Journal {
  createdAt: number;
  updatedAt: number;
  text: string;
  title: string;
  user?: JournalUser;
  response?: boolean;
}

function Page1() {
  // const db = getFirestore(firebaseApp);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [journals, setJournals] = useState<Array<Journal>>([]);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        console.log('Redirecting to login...');
        location.href = '/login';
      }
    });
  }, [auth]);

  useEffect(() => {
    const colRef = collection(db, 'journal');
    onSnapshot(colRef, (snapshot) => {
      let newJournals: Array<Journal> = [];
      snapshot.docs.forEach((doc) => {
        const journalData = doc.data();
        journalData.id = doc?.id || 'no id';
        newJournals.push(journalData as Journal);
      });
      newJournals = newJournals.sort((a, b) => a.createdAt - b.createdAt);
      setJournals(newJournals);
    });
  }, [db]);

  function submitJournalEntry() {
    if (user && text) {
      const journalAPIURL = `${API_URL}/journal`;
      const title = 'title';
      const data = {
        user,
        title,
        text,
      };
      axios
        .post(journalAPIURL, data)
        .then((res) => {
          console.log('journal submit response', res);
          setText('');
        })
        .catch((err) => {
          console.error(err);
          alert('Error sending message');
        });
    } else {
      alert('Journal entry cannot be blank');
    }
  }

  return (
    <>
      {user ? (
        <>
          <Meta title="home" />
          <Navbar />
          <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/*Journals*/}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              {journals.map((journal) => {
                return (
                  <div
                    key={journal.id}
                    style={{
                      background: 'white',
                      marginTop: '10px',
                    }}
                  >
                    <Typography style={{ color: 'black' }}>
                      {journal.response ? 'Serenity:' : 'You:'}
                    </Typography>
                    <Typography style={{ color: 'black' }}>{journal.text}</Typography>
                  </div>
                );
              })}
            </div>
            {/*Journal Entry*/}
            <>
              <TextareaAutosize
                placeholder={'Release your emotions here'}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                }}
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  marginTop: '10px',
                  width: '100%',
                  maxWidth: '600px',
                  minHeight: '5rem',
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    submitJournalEntry();
                  }
                }}
              />
              <Button
                onClick={() => {
                  submitJournalEntry();
                }}
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  maxWidth: '600px',
                  marginTop: '10px',
                }}
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
            </>
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Page1;
