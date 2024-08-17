import { Box, Grid, TextField, Typography, Button, Card } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface FormCadastroClientsProps {
  handleNext: () => void
  handleFormError: () => void
}

export const FormCadastroClients: React.FC<FormCadastroClientsProps> = ({
  handleNext,
  handleFormError,
}) => {
  const [values, setValues] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    cep: '',
    dataNascimento: '',
    estado: '',
    cidade: '',
    rua: '',
    bairro: '',
    senha: '',
    confirmarSenha: '',
  })

  const [errors, setErrors] = useState({
    nomeCompleto: false,
    cpf: false,
    email: false,
    cep: false,
    dataNascimento: false,
    estado: false,
    cidade: false,
    rua: false,
    bairro: false,
    senha: false,
    confirmarSenha: false,
    senhaMismatch: false,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  const validateFields = () => {
    const senhaMismatch =
      Boolean(values.senha) &&
      Boolean(values.confirmarSenha) &&
      values.senha !== values.confirmarSenha

    const newErrors = {
      nomeCompleto: !values.nomeCompleto,
      cpf: !values.cpf,
      email: !values.email,
      cep: !values.cep,
      dataNascimento: !values.dataNascimento,
      estado: !values.estado,
      cidade: !values.cidade,
      rua: !values.rua,
      bairro: !values.bairro,
      senha: !values.senha,
      confirmarSenha: !values.confirmarSenha,
      senhaMismatch, // Usando a propriedade abreviada conforme recomendado pelo ESLint
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateFields() && values.senha === values.confirmarSenha) {
      console.log('Formulário válido', values)
      toast.success('Cadastro realizado com sucesso')
      handleNext()
      // Envie os dados aqui
      // try {
      //   const response = await fetch('URL_DA_SUA_API', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(values),
      //   })

      //   if (!response.ok) {
      //     throw new Error('Erro na submissão')
      //   }

      //   const result = await response.json()
      //   console.log('Sucesso:', result)
      //   // Implemente ações após o sucesso
      // } catch (error) {
      //   console.error('Erro:', error)
      // }
    } else {
      console.log('Formulário inválido', values)
      toast.warning(
        'Algo de errado ao se cadastrar, por favor confirme os campo e tente novamente',
      )
      handleFormError()
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container justifyContent="center" alignItems="center" p={1}>
        <Grid
          item
          xs={12}
          sm={8}
          md={8}
          lg={6}
          sx={{
            border: `1px solid blue`,
            borderRadius: '6px',
          }}
        >
          <Card elevation={6} sx={{ padding: { xs: 1, sm: 2, md: 3, lg: 6 } }}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  color="initial"
                  textAlign="center"
                  mb={3}
                >
                  Cadastro de Clientes
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="nomeCompleto"
                  value={values.nomeCompleto}
                  onChange={handleChange}
                  error={errors.nomeCompleto}
                  helperText={
                    errors.nomeCompleto && 'Nome completo é obrigatório.'
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CPF"
                  type="number"
                  name="cpf"
                  value={values.cpf}
                  onChange={handleChange}
                  error={errors.cpf}
                  helperText={errors.cpf && 'CPF é obrigatório.'}
                  sx={{
                    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button':
                      {
                        '-webkit-appearance': 'none',
                        margin: 0,
                      },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  label="Data de Nascimento"
                  name="dataNascimento"
                  value={values.dataNascimento}
                  onChange={handleChange}
                  error={errors.dataNascimento}
                  helperText={
                    errors.dataNascimento && 'Data de Nascimento é obrigatório.'
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email && 'E-mail é obrigatório.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="estado"
                  value={values.estado}
                  onChange={handleChange}
                  error={errors.estado}
                  helperText={errors.estado && 'Estado é obrigatório.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="cidade"
                  value={values.cidade}
                  onChange={handleChange}
                  error={errors.cidade}
                  helperText={errors.cidade && 'Cidade é obrigatório.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CEP"
                  type="number"
                  name="cep"
                  value={values.cep}
                  onChange={handleChange}
                  error={errors.cep}
                  helperText={errors.cep && 'CEP é obrigatório.'}
                  InputProps={{
                    sx: {
                      'input[type="number"]': {
                        // Aumentando a especificidade
                        '-moz-appearance': 'textfield',
                        '-webkit-appearance': 'none',
                        '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button':
                          {
                            '-webkit-appearance': 'none',
                            margin: 0,
                          },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rua"
                  name="rua"
                  value={values.rua}
                  onChange={handleChange}
                  error={errors.rua}
                  helperText={errors.rua && 'Rua é obrigatório.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="bairro"
                  value={values.bairro}
                  onChange={handleChange}
                  error={errors.bairro}
                  helperText={errors.bairro && 'Bairro é obrigatório.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Senha"
                  name="senha"
                  value={values.senha}
                  onChange={handleChange}
                  error={errors.senha || errors.senhaMismatch}
                  helperText={
                    errors.senha
                      ? 'Senha é obrigatório.'
                      : errors.senhaMismatch
                        ? 'Senhas não correspondem.'
                        : ''
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirmar Senha"
                  name="confirmarSenha"
                  value={values.confirmarSenha}
                  onChange={handleChange}
                  error={errors.confirmarSenha || errors.senhaMismatch}
                  helperText={
                    errors.confirmarSenha
                      ? 'Confirmar Senha é obrigatório.'
                      : errors.senhaMismatch
                        ? 'Senhas não correspondem.'
                        : ''
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    background: 'blue',
                    '&:hover': {
                      background: 'green',
                    },
                  }}
                >
                  Confirmar
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
