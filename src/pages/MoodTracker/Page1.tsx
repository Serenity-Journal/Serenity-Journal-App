import React, { memo, useEffect, useState } from 'react';

import Container from '@mui/material/Container';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import firebaseApp from '@/utils/firebase';
import { collection, doc, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { User } from '@firebase/auth';

import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';

// Graph
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Icons
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

interface Mood {
  createdAt: string;
  rating: number;
  uid: string;
}

type MyYAxisTickProps = {
  x: number;
  y: number;
  payload: {
    value: number;
  };
};

// eslint-disable-next-line react/display-name
const Page1 = memo(() => {

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [rating, setRating] = useState<number | null>(null);
  const [moods, setMoods] = useState<Array<Mood>>([]);

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
      const colRef = query(collection(db, 'mood'), where('uid', '==', user?.uid));
      onSnapshot(colRef, (snapshot) => {
        let newMoods: Array<Mood> = [];
        snapshot.docs.forEach((doc) => {
          const moodData = doc.data();

          if (moodData.createdAt === getTodayFormatted()) {
            setRating(moodData.rating);
          }

          newMoods.push(moodData as Mood);
        });
        newMoods = newMoods.sort();
        setMoods(newMoods);
      });
    }
  }, [db, user]);

  const submitMoodRating = async () => {
    if (user && rating) {
      const timeFormatted = getTodayFormatted();

      console.log('Submitting mood at ' + timeFormatted);
      const newMood = {
        createdAt: timeFormatted,
        rating: rating,
        uid: user.uid,
      };

      await setDoc(doc(db, 'mood', user.uid + timeFormatted.replace(/\//g, '')), newMood);
    } else {
      alert('Journal entry cannot be blank');
    }
  };

  // Graph Stuff
  const getTodayFormatted = (): string => {
    const currentTime = Math.floor(new Date(Date.now()).getTime());
    return formatDate(currentTime);
  };

  const formatDate = (createdAt: number): string => {
    const date = new Date(createdAt);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  // Rating Stuff
  const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));

  const customIcons: {
    [index: string]: {
      icon: React.ReactElement;
      label: string;
    };
  } = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color='error' sx={{ width: 60, height: 60 }} />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon color='error' sx={{ width: 60, height: 60 }} />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon color='warning' sx={{ width: 60, height: 60 }} />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color='success' sx={{ width: 60, height: 60 }} />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color='success' sx={{ width: 60, height: 60 }} />,
      label: 'Very Satisfied',
    },
  };

  function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  const MyYAxisTick = ({ x, y, payload }: MyYAxisTickProps): any => {
    if (payload.value === 0) {
      return null;
    }
    return (
      <text x={x} y={y} dy={16} textAnchor='middle' fill='#666'>
        {payload.value}
      </text>
    );
  };


  return (
    <>
      {user ? (
        <>
          <Meta title='home' />
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
            <Typography variant='h6' component='legend'>{`Today's Mood`}</Typography>
            <StyledRating
              name='highlight-selected-only'
              value={rating}
              onChange={(event: any, newValue: React.SetStateAction<number | null>) => {
                setRating(newValue);
              }}
              IconContainerComponent={IconContainer}
              getLabelText={(value: number) => customIcons[value].label}
              highlightSelectedOnly
              size='large'
            />
            <Button variant='contained' type='submit' sx={{ mt: 6 }} onClick={submitMoodRating}>Update Mood For
              Today</Button>

            { /* Add Line Chart */}
            <br />
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                width={500}
                height={300}
                data={moods}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='createdAt' />
                <YAxis type='number' domain={[0, 5]} tick={MyYAxisTick} tickCount={6} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='rating' stroke='#82ca9d' strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Container>
        </>
      ) : (
        <></>
      )}
    </>
  );
});

export default Page1;
