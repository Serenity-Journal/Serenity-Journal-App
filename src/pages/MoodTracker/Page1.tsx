import React, { useEffect, useState, memo } from 'react';

import Container from '@mui/material/Container';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import firebaseApp from '@/utils/firebase';
import { getFirestore } from 'firebase/firestore';
import { User } from '@firebase/auth';

import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';

// Graph
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icons
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

// eslint-disable-next-line react/display-name
const Page1 = memo(() => {

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [rating, setRating] = useState<number | null>(null);

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

  // Graph Stuff
  const data = [
    {
      name: 'Day 1',
      mood: 3,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Day B',
      mood: 5,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Day C',
      mood: 5,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Day D',
      mood: 4,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Day E',
      mood: 3,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Day F',
      mood: 4,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Day G',
      mood: 5,
      pv: 4300,
      amt: 2100,
    },
  ];

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
            <Button variant='contained' type='submit' sx={{ mt: 6 }}>Update Mood For Today</Button>

            { /* Add Line Chart */}
            <br />
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis type='number' domain={[0, 5]} tickCount={6} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='mood' stroke='#82ca9d' strokeWidth={3} />
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
