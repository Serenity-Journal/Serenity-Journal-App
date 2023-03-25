import React, {useEffect, useState} from 'react';

import Container from '@mui/material/Container';

import {getAuth, onAuthStateChanged} from 'firebase/auth';

import Meta from '@/components/Meta';
import Navbar from '@/components/Navbar';
import firebaseApp from '@/utils/firebase';
import {getFirestore} from "firebase/firestore";
import {User} from "@firebase/auth";

import {Button, Paper, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Rating, {IconContainerProps} from '@mui/material/Rating';

// Graph
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    Title,
    Legend,
} from '@devexpress/dx-react-chart-material-ui';
import {Animation} from '@devexpress/dx-react-chart';

// Icons
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

function Page1() {

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

    const PREFIX = "Mood";

    const classes = {
        chart: `${PREFIX}-chart`
    };

    const format = () => (tick) => tick;

    const Root = (props) => (
        <Legend.Root
            {...props}
            sx={{ display: "flex", margin: "auto", flexDirection: "row" }}
        />
    );
    const Label = (props) => (
        <Legend.Label sx={{ pt: 1, whiteSpace: "nowrap" }} {...props} />
    );
    const Item = (props) => (
        <Legend.Item sx={{ flexDirection: "column" }} {...props} />
    );

    const ValueLabel = (props) => {
        const { text } = props;
        return <ValueAxis.Label {...props} text={`${text}%`} />;
    };

    const TitleText = (props) => (
        <Title.Text {...props} sx={{ whiteSpace: "pre" }} />
    );

    const StyledChart = styled(Chart)(() => ({
        [`&.${classes.chart}`]: {
            paddingRight: "20px"
        }
    }));

    const data = [
        {
            year: 1993, tvNews: 19, church: 29, military: 32,
        }, {
            year: 1995, tvNews: 13, church: 32, military: 33,
        }, {
            year: 1997, tvNews: 14, church: 35, military: 30,
        }, {
            year: 1999, tvNews: 13, church: 32, military: 34,
        }, {
            year: 2001, tvNews: 15, church: 28, military: 32,
        }, {
            year: 2003, tvNews: 16, church: 27, military: 48,
        }, {
            year: 2006, tvNews: 12, church: 28, military: 41,
        }, {
            year: 2008, tvNews: 11, church: 26, military: 45,
        }, {
            year: 2010, tvNews: 10, church: 25, military: 44,
        }, {
            year: 2012, tvNews: 11, church: 25, military: 43,
        }, {
            year: 2014, tvNews: 10, church: 25, military: 39,
        }, {
            year: 2016, tvNews: 8, church: 20, military: 41,
        }, {
            year: 2018, tvNews: 10, church: 20, military: 43,
        },
    ];


    const StyledRating = styled(Rating)(({theme}) => ({
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
            icon: <SentimentVeryDissatisfiedIcon color="error" sx={{width: 60, height: 60}}/>,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <SentimentDissatisfiedIcon color="error" sx={{width: 60, height: 60}}/>,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SentimentSatisfiedIcon color="warning" sx={{width: 60, height: 60}}/>,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon color="success" sx={{width: 60, height: 60}}/>,
            label: 'Satisfied',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon color="success" sx={{width: 60, height: 60}}/>,
            label: 'Very Satisfied',
        },
    };

    function IconContainer(props: IconContainerProps) {
        const {value, ...other} = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    const [chartData, setChartData] = useState(data);

    return (
        <>
            {user ? (
                <>
                    <Meta title="home"/>
                    <Navbar/>
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
                        <Typography variant='h6' component="legend">{`Today's Mood`}</Typography>
                        <StyledRating
                            name="highlight-selected-only"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            IconContainerComponent={IconContainer}
                            getLabelText={(value: number) => customIcons[value].label}
                            highlightSelectedOnly
                            size="large"
                        />
                        <Button variant="contained" type='submit' sx={{mt: 6}}>Update Mood For Today</Button>

                        { /* Add Line Chart */}
                        <Paper>
                            {/*<StyledChart data={chartData} className={classes.chart}>*/}
                            {/*    <ArgumentAxis tickFormat={format} />*/}
                            {/*    <ValueAxis max={50} labelComponent={ValueLabel} />*/}

                            {/*    <LineSeries name="TV news" valueField="tvNews" argumentField="year" />*/}
                            {/*    <LineSeries name="Church" valueField="church" argumentField="year" />*/}
                            {/*    <LineSeries*/}
                            {/*        name="Military"*/}
                            {/*        valueField="military"*/}
                            {/*        argumentField="year"*/}
                            {/*    />*/}
                            {/*    <Legend*/}
                            {/*        position="bottom"*/}
                            {/*        rootComponent={Root}*/}
                            {/*        itemComponent={Item}*/}
                            {/*        labelComponent={Label}*/}
                            {/*    />*/}
                            {/*    <Title*/}
                            {/*        text={`Confidence in Institutions in American society ${"\n"}(Great deal)`}*/}
                            {/*        textComponent={TitleText}*/}
                            {/*    />*/}
                            {/*    <Animation />*/}
                            {/*</StyledChart>*/}
                        </Paper>

                    </Container>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default Page1;
