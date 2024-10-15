import { BrowserRouter, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material'
import { Router } from './routes/router'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { LogoutButton } from './components/BotaoLogout'

export const App = () => {
  return (
    <BrowserRouter>
      <Box
        sx={{
          padding: { xs: 1, sm: 2, md: 3, lg: 4 },
          background: '#f7f7f7',
          minHeight: '100dvh',
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <AppBar position="fixed" sx={{ background: '#131921' }}>
              <Toolbar>
                <Grid container justifyContent="space-between">
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <Typography variant="h6" noWrap>
                      <Link
                        to="/"
                        style={{ textDecoration: 'none', color: '#f7f7f7' }}
                      >
                        My Finances
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <LogoutButton />
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            <ToastContainer theme="colored" />
            <Toolbar />
            <Router />
          </Grid>
        </Grid>
      </Box>
    </BrowserRouter>
  )
}
