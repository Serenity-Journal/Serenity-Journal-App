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
import useWindowDimensions from '@/hooks/useWindowDimensions';
import firebaseApp from '@/utils/firebase';

interface JournalUser {
  uid: string;
  displayName?: string;
  email?: string;
}

interface Journal {
  id: string;
  createdAt: number;
  updatedAt: number;
  role: string;
  content: string;
  title: string;
  user?: JournalUser;
}

function Page1() {
  // const db = getFirestore(firebaseApp);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [journals, setJournals] = useState<Array<Journal>>([]);
  const [text, setText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const [maxWidth, setMaxWidth] = useState('280px');

  useEffect(() => {
    if (width) {
      setMaxWidth(`${Math.min((width || 280) - 16, 600)}px`);
    }
  }, [width]);

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
      newJournals = newJournals.sort((a, b) => a.id.localeCompare(b.id));
      setJournals(newJournals);
    });
  }, [db]);

  function submitJournalEntry() {
    if (user && text) {
      const millis = Date.now();
      const currentTime = Math.floor(millis);
      const journalAPIURL = `${API_URL}/journal`;
      const title = 'title';
      const postData: Journal = {
        user: user as JournalUser,
        title: title,
        content: text,
        role: 'user',
        createdAt: currentTime,
        updatedAt: currentTime,
        id: currentTime.toString() + '.u',
      };
      setSending(true);
      axios
        .post(journalAPIURL, {
          ...postData,
          messages: journals,
        })
        .then((res) => {
          console.log('journal submit response', res);
          setText('');
          setSending(false);
        })
        .catch((err) => {
          setSending(false);
          console.error(err);
          if (err?.response?.data === 'Chat GPT failure') {
            alert('Error communicating with ChatGPT');
          } else if (err?.response?.data === 'Unable to add journal to database') {
            alert('Database error');
          } else {
            alert('Error sending message');
          }
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
          <Container
            style={{
              width: '100%',
              padding: '0px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {/*Journals*/}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: maxWidth,
                flexGrow: 1,
                overflowY: 'scroll',
                rowGap: '10px',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              {journals.map((journal) => {
                return (
                  <div
                    key={journal.id}
                    style={{
                      display: 'flex',
                      background: 'white',
                    }}
                  >
                    <Typography style={{ color: 'black' }}>
                      {journal.role === 'assistant' ? 'Serenity: ' : 'You: '}
                    </Typography>
                    <Typography style={{ color: 'black' }}>{journal.content}</Typography>
                  </div>
                );
              })}
            </div>
            {/*Journal Entry*/}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: maxWidth,
                height: 'auto',
              }}
            >
              <TextareaAutosize
                disabled={sending}
                placeholder={'Release your emotions here'}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                }}
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  // marginTop: '10px',
                  width: '100%',
                  maxWidth: maxWidth,
                  minHeight: '5rem',
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    submitJournalEntry();
                  }
                }}
              />
              <Button
                disabled={sending}
                onClick={() => {
                  submitJournalEntry();
                }}
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  maxWidth: maxWidth,
                  // marginTop: '10px',
                }}
                sx={{ mt: 3, mb: 2 }}
              >
                {sending ? 'Please wait...' : 'Send'}
              </Button>
            </div>
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Page1;
