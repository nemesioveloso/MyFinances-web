import { Button, Card, Grid, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { useState } from 'react'
import { apiService } from '../../api/Requests'
// import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

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
  const [token, setToken] = useState('')
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

      setToken(response.data.jwt)
      return response.data as AuthResponse
    } catch (error) {
      toast.error('Usuário ou senha inválidos')
      throw error
    }
  }

  React.useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token)
      setValues({
        usernameOrEmail: '',
        password: '',
      })
      router('/dashboard')
    }
  }, [token, router])

  // async function validate(item) {
  //   // setIsLoading(true)
  //   try {
  //     const response = await axiosInstance.post('/finances/users/authenticate')
  //     console.log(response)
  //   } catch (error) {
  //     console.error('Erro na requisição GET:', error)
  //   } finally {
  //     // setIsLoading(false)
  //   }
  // }

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateFields()) {
      console.log('Formulário válido', values)
      validate(values)
      // router('/dashboard')
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
            <Button fullWidth type="submit" variant="contained" sx={{ m: 1 }}>
              Enviar
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
