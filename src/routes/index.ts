// import AddTaskIcon from '@mui/icons-material/AddTask';
// import BugReportIcon from '@mui/icons-material/BugReport';
// import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';

// import TerrainIcon from '@mui/icons-material/Terrain';
import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.ResetPassword]: {
    component: asyncComponentLoader(() => import('@/pages/ResetPassword')),
    path: '/reset-password',
    title: 'Reset Password',
    icon: HomeIcon,
  },
  [Pages.Login]: {
    component: asyncComponentLoader(() => import('@/pages/Login')),
    path: '/login',
    title: 'Login',
    icon: HomeIcon,
  },
  [Pages.LoginAlt]: {
    component: asyncComponentLoader(() => import('@/pages/Register')),
    path: '/register',
    title: 'Register',
    icon: HomeIcon,
  },
  [Pages.Home]: {
    component: asyncComponentLoader(() => import('@/pages/Home')),
    path: '/',
    title: 'Home',
    icon: HomeIcon,
  },
  [Pages.MoodTracker]: {
    component: asyncComponentLoader(() => import('@/pages/MoodTracker')),
    path: '/mood-tracker',
    title: 'Mood Tracker',
    icon: HomeIcon,
  },
  [Pages.Therapists]: {
    component: asyncComponentLoader(() => import('@/pages/Therapists')),
    path: '/therapists',
    title: 'Therapists',
    icon: HomeIcon,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
