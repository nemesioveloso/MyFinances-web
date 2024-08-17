import { Button, Card, Grid, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function NewAcout() {
  const router = useNavigate()
  const [values, setValues] = useState({
    username: '',
    password: '',
    email: '',
    grants: 'FREE',
  })

  const [errors, setErrors] = useState({
    username: false,
    password: false,
    email: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  const validateFields = () => {
    const newErrors = {
      username: !values.username,
      password: !values.password,
      email: !values.email,
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => !error)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateFields()) {
      console.log('Formulário válido', values)
      router('/')
      // Envie os dados aqui
    } else {
      console.log('Formulário inválido')
    }
  }

  return (
    <Grid
      container
      minHeight="90dvh"
      component="form"
      justifyContent="center"
      alignItems="center"
      onSubmit={handleSubmit}
    >
      <Card sx={{ maxWidth: '40rem' }}>
        <Grid container p={3} spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center">
              Criar Conta
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errors.username}
              id="outlined-nome"
              name="username"
              label="Nome de usuario"
              value={values.username}
              onChange={handleChange}
              helperText={errors.username ? 'Nome de usuario obrigatório.' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errors.email}
              id="outlined-email"
              name="email"
              label="E-mail"
              value={values.email}
              onChange={handleChange}
              helperText={errors.email ? 'E-mail é obrigatórios.' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errors.password}
              type="password"
              id="filled-password"
              name="password"
              label="Senha"
              value={values.password}
              onChange={handleChange}
              helperText={errors.password ? 'Senha é obrigatória.' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained">
              Enviar
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
