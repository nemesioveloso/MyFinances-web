import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
// import { MyStepper } from '../../components/Stepper'

export const Home = () => {
  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">Bem vindo ao My Finances</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Para iniciarmos o controle financeiro{' '}
            <Link to="/newAcount">crie uma conta</Link> e preencha os dados.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Caso contrario clique <Link to="/login">aqui</Link> e entre com seu
            username ou email.
          </Typography>
        </Grid>
        {/* <Grid item xs={12}>
          <MyStepper />
        </Grid> */}
      </Grid>
    </Box>
  )
}
