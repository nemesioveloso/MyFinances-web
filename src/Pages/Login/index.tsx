import { Button, Card, Grid, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { useState } from 'react'
import { apiService } from '../../api/Requests'
// import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../api'

interface AuthData {
  usernameOrEmail: string
  password: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
  }
}

export function Login() {
  const router = useNavigate()
  const [values, setValues] = useState({
    usernameOrEmail: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    usernameOrEmail: false,
    password: false,
  })

  async function validate(data: AuthData): Promise<AuthResponse | undefined> {
    try {
      const response = await apiService.post({
        url: '/finances/users/authenticate',
        body: data,
      })
      return response.data as AuthResponse
    } catch (error) {
      toast.error('Usuário ou senha inválidos')
      throw error
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  const validateFields = () => {
    const newErrors = {
      usernameOrEmail: !values.usernameOrEmail,
      password: !values.password,
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => !error)
  }

  const autenticate = async () => {
    try {
      const response = await axiosInstance.post(
        '/finances/users/authenticate',
        values,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const jwtToken = response.data.jwt
      localStorage.setItem('authToken', jwtToken)
      router('/dashboard')
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateFields()) {
      validate(values)
      autenticate()
    } else {
      toast.warning('Uername, email ou senha inválidas, tente novamente.')
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
              Login
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errors.usernameOrEmail}
              id="outlined-nome"
              name="usernameOrEmail"
              label="Nome de usuario ou email"
              value={values.usernameOrEmail}
              onChange={handleChange}
              helperText={
                errors.usernameOrEmail
                  ? 'Nome de usuario ou email obrigatórios.'
                  : ''
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errors.password}
              type="password"
              id="filled-email"
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
