import * as React from 'react';
import { useEffect, useState } from 'react';

// import AdbIcon from '@mui/icons-material/Adb';
// import { Create } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { User } from '@firebase/auth';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import firebaseApp from '@/utils/firebase';

import logo from '../../lotus.png';

// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const pages: Array<string> = [];
const settings: Array<string> = ['Logout'];

function ResponsiveAppBar() {
  const [, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  // const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
  //     setAnchorElNav(event.currentTarget);
  // };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
        // console.log(user);
      } else {
        // User is signed out
        // ...
        // location.href='/login';
      }
    });
  }, [auth]);

  return (
    <AppBar position="static" style={{backgroundColor: "rgba(255,255,255,0)", boxShadow: "none"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/*<Create sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/}
          <Box
            component="img"
            sx={{
              height: 50,
            }}
            alt="Your logo."
            src={logo}
            style={{ marginRight: '10px' }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            style={{color: '#814f45'}}
          >
            Serenity Journal
          </Typography>

          {/*<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>*/}
          {/*    <IconButton*/}
          {/*        size="large"*/}
          {/*        aria-label="account of current user"*/}
          {/*        aria-controls="menu-appbar"*/}
          {/*        aria-haspopup="true"*/}
          {/*        onClick={handleOpenNavMenu}*/}
          {/*        color="inherit"*/}
          {/*    >*/}
          {/*        <MenuIcon />*/}
          {/*    </IconButton>*/}
          {/*    <Menu*/}
          {/*        id="menu-appbar"*/}
          {/*        anchorEl={anchorElNav}*/}
          {/*        anchorOrigin={{*/}
          {/*            vertical: 'bottom',*/}
          {/*            horizontal: 'left',*/}
          {/*        }}*/}
          {/*        keepMounted*/}
          {/*        transformOrigin={{*/}
          {/*            vertical: 'top',*/}
          {/*            horizontal: 'left',*/}
          {/*        }}*/}
          {/*        open={Boolean(anchorElNav)}*/}
          {/*        onClose={handleCloseNavMenu}*/}
          {/*        sx={{*/}
          {/*            display: { xs: 'block', md: 'none' },*/}
          {/*        }}*/}
          {/*    >*/}
          {/*        {pages.map((page) => (*/}
          {/*            <MenuItem key={page} onClick={handleCloseNavMenu}>*/}
          {/*                <Typography textAlign="center">{page}</Typography>*/}
          {/*            </MenuItem>*/}
          {/*        ))}*/}
          {/*    </Menu>*/}
          {/*</Box>*/}
          {/*<Create sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />*/}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          ></Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={(user?.displayName || user?.email || 'John Doe').toUpperCase()}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      signOut(auth)
                        .then(() => {
                          location.href = '/';
                        })
                        .catch((error) => {
                          alert('Error signing out');
                          console.error(error);
                        });
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
