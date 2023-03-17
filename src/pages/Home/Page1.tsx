import React, { useEffect, useRef, useState } from 'react';

import { TextareaAutosize } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { User } from '@firebase/auth';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isMobileStyle, setIsMobileStyle] = useState<boolean>(true);

  useEffect(() => {
    if (width) {
      setIsMobileStyle((width && width < 600) as boolean);
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
    if (user) {
      const colRef = query(collection(db, 'journal'), where('user.uid', '==', user?.uid));
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
    }
  }, [db, user]);

  const getMaxWidth = (def: number | undefined) => {
    return `${Math.min((width || 280) - 16, def || 800)}px`;
  };

  const scrollToBottom = (arg: ScrollIntoViewOptions) => {
    // const element = document.getElementById(id);
    // if (element) {
    //   element.scrollTop = element.scrollHeight;
    // }
    messagesEndRef.current?.scrollIntoView(arg);
  };

  useEffect(() => {
    scrollToBottom({});
  }, [journals]);

  function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = date.getMinutes();
    let t = 'AM';
    if (hour > 12) {
      hour -= 12;
      t = 'PM';
    }
    if (hour == 0) {
      hour = 12;
    }
    return `${month}/${day}/${year} ${hour}:${minute} ${t}`;
  }

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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: getMaxWidth(1000.0),
                flexGrow: 1,
                overflowY: 'scroll',
                rowGap: '10px',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              {journals
                .filter((journal) => journal.role === 'user')
                .map((journal) => {
                  const chatGPTResponseJournals = journals.filter(
                    (cj) => cj.role === 'assistant' && cj.createdAt === journal.createdAt,
                  );
                  let chatGPTResponseJournal;
                  if (chatGPTResponseJournals && chatGPTResponseJournals.length > 0) {
                    chatGPTResponseJournal = chatGPTResponseJournals[0];
                  }

                  return (
                    <div key={journal.id}>
                      <Typography sx={{ fontStyle: 'italic' }}>
                        {formatDate(new Date(journal.createdAt))}
                      </Typography>
                      <div
                        id={journal.createdAt.toString()}
                        key={journal.id}
                        style={{
                          display: 'flex',
                          flexDirection: isMobileStyle ? 'column' : 'row',
                          background: 'rgba(255,255,255,0)',
                        }}
                      >
                        <Typography style={{ flexGrow: isMobileStyle ? 0 : 1 }}>
                          {journal.content}
                        </Typography>
                        {chatGPTResponseJournal && (
                          <div
                            style={{
                              background: 'rgba(255,255,255,0.27)',
                              width: isMobileStyle ? '100%' : '400px',
                              padding: '5px',
                              borderRadius: '10px',
                            }}
                          >
                            {chatGPTResponseJournal.content}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>
            {/*Journal Entry*/}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: getMaxWidth(1000),
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
                  maxWidth: getMaxWidth(1000),
                  minHeight: '5rem',
                  background: 'rgba(0, 0, 0, 0)',
                  resize: 'none',
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: '6px',
                  borderStyle: 'solid',
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
                  maxWidth: getMaxWidth(1000),
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
