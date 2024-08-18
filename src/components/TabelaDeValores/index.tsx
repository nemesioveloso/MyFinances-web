import {
  Box,
  Grid,
  TablePagination,
  IconButton,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  Typography,
} from '@mui/material'
import { ProductsList } from './style'
import { ChangeEvent, useEffect, useState } from 'react'
import { Financa, FinancaAdd, FinanceResponse } from '../../models/tabelaGeral'
import { formatCurrency, formatDate } from '../../functions'
import { toast } from 'react-toastify'
import { apiService } from '../../api/Requests'

interface TabelaDeValoresProps {
  onTotalChange: (total: number) => void
  dados: FinanceResponse
  onAddFinance: () => void
  onPageChange: (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

export function TabelaDeValores({
  onTotalChange,
  dados,
  onAddFinance,
  onPageChange,
  onRowsPerPageChange,
}: TabelaDeValoresProps) {
  const finance: Financa[] = dados.list || []
  const page = dados.page
  const size = dados.size
  const totalElements = dados.totalElements
  const [categorias, setCategorias] = useState<string>('')
  const dataAtualFormatada = new Date().toISOString().split('T')[0]
  const [novaCategoria, setNovaCategoria] = useState<string>('')
  const [edit, setEdit] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [myFinances, setFinances] = useState<Financa | null>(null)
  const [financeDelete, setFinanceDelete] = useState(false)
  const [financeAdd, setFinanceAdd] = useState(false)
  const [formValuesAdd, setFormValuesAdd] = useState<FinancaAdd>({
    data: dataAtualFormatada,
    categoria: '',
    descricao: '',
    tipo: 'Despesa',
    valor: null,
    fixoVariavel: 'Variavel',
    parcelas: undefined,
    observacoes: '',
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({
    data: false,
    categoria: false,
    descricao: false,
    tipo: false,
    valor: false,
    fixoVariavel: false,
    parcelas: false,
    observacoes: false,
  })

  const handleInputChangeAdd = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setFormValuesAdd({
      ...formValuesAdd,
      [name]:
        name === 'valor' || name === 'parcelas' ? parseFloat(value) : value,
    })
  }

  const handleSelectChangeAdd = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFormValuesAdd({
      ...formValuesAdd,
      [name as string]: value,
    })
  }

  const handleNovaCategoriaChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNovaCategoria(event.target.value)

    // Não altere diretamente o valor da categoria se estiver em "Outro"
    setFormValuesAdd((prev) => ({
      ...prev,
      categoria: prev.categoria === 'Outro' ? 'Outro' : event.target.value,
    }))
  }

  const newFinanceAdd = () => {
    userCategories()
    setFormValuesAdd({
      data: dataAtualFormatada,
      categoria: '',
      descricao: '',
      tipo: 'Despesa',
      valor: null,
      fixoVariavel: 'Variavel',
      parcelas: undefined,
      observacoes: '',
    })
    setFinanceAdd(true)
  }

  const isFormValid = (): boolean => {
    const newErrors: Record<string, boolean> = {}
    let valid = true

    for (const key in formValuesAdd) {
      if (key === 'valor' || key === 'parcelas') {
        if (formValuesAdd[key as keyof FinancaAdd] === null) {
          newErrors[key] = true
          valid = false
        } else {
          newErrors[key] = false
        }
      } else if (key !== 'observacoes') {
        if (formValuesAdd[key as keyof FinancaAdd] === '') {
          newErrors[key] = true
          valid = false
        } else {
          newErrors[key] = false
        }
      }
    }

    if (formValuesAdd.fixoVariavel === 'Parcela') {
      if (formValuesAdd.parcelas === undefined || formValuesAdd.parcelas <= 0) {
        newErrors.parcelas = true
        valid = false
      } else {
        newErrors.parcelas = false
      }
    } else {
      newErrors.parcelas = false
    }

    setErrors(newErrors)
    return valid
  }

  const calculateTotal = () => {
    if (finance) {
      return finance.reduce((total, item) => {
        return item.tipo === 'Receita' ? total + item.valor : total - item.valor
      }, 0)
    }
  }

  const handelEdit = (item: Financa) => {
    setFinances(item)
    setEdit(true)
  }
  const handelDelete = (item: number) => {
    setItemToDelete(item)
    setFinanceDelete(true)
  }

  const hendleSalveEdit = () => {
    editFinance()
    setEdit(false)
  }

  const handleSaveAdd = () => {
    if (isFormValid()) {
      const financeToSave = {
        ...formValuesAdd,
        // Use a nova categoria se estiver preenchendo um novo nome
        categoria:
          formValuesAdd.categoria === 'Outro'
            ? novaCategoria
            : formValuesAdd.categoria,
      }

      newFinance(financeToSave)
      setFinanceAdd(false)
    } else {
      toast.warning('Por favor, preencha todos os campos obrigatórios.')
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFinances((prev) => {
      if (!prev) return null

      // Se for o campo "valor", substitua vírgula por ponto
      const newValue = name === 'valor' ? value.replace(',', '.') : value

      return {
        ...prev,
        [name]: newValue,
      }
    })
  }

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFinances((prev) => (prev ? { ...prev, [name!]: value } : null))
  }

  async function userCategories() {
    try {
      const response = await apiService.get({
        url: '/finances/categories',
      })
      setCategorias(response.data)
    } catch (error) {
      toast.error('Usuário não possui finanças')
      throw error
    }
  }

  async function newFinance(financeToSave: FinancaAdd) {
    try {
      const response = await apiService.post({
        url: '/finances',
        body: financeToSave,
      })
      toast.success(response.data)
      onAddFinance()
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response: { data: string } }
        if (err.response.data) {
          toast.error(err.response.data)
        }
      }
    }
  }

  async function deleteFinance(financeToSave: number) {
    try {
      await apiService.delete({
        url: `/finances/${financeToSave}`,
      })
      toast.success('Finança deletada com sucesso')
      onAddFinance()
    } catch (error) {
      toast.error('Algo de errado ao deletar')
      throw error
    }
  }

  async function editFinance() {
    try {
      await apiService.put({
        url: `/finances/${myFinances?.id}`,
        body: myFinances,
      })
      toast.success('Finança editada com sucesso.')
      onAddFinance()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  useEffect(() => {
    const total = calculateTotal()
    if (total) {
      onTotalChange(total)
    }
  }, [onTotalChange])

  return (
    <Box sx={{ margin: '1rem 0 1rem 0' }}>
      <Grid container justifyContent="end" mb={1}>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={newFinanceAdd}
            sx={{
              background: '#131921',
              '&:hover': { background: '#232f3e' },
            }}
          >
            Nova Finança
          </Button>
        </Grid>
      </Grid>
      {finance && finance?.length > 0 ? (
        <Box>
          <Grid container justifyContent="end" spacing={1}>
            <Grid item xs={12}>
              <Card elevation={6} sx={{ borderRadius: '8px' }}>
                <ProductsList>
                  <table>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Categoria</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor (R$)</th>
                        <th>Categoria Despesa</th>
                        <th>Parcelas</th>
                        <th>Observações</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finance.map((item: Financa) => (
                        <tr key={item.id}>
                          <td>{formatDate(item.data)}</td>
                          <td>{item.categoria}</td>
                          <td>{item.descricao}</td>
                          <td>{item.tipo}</td>
                          <td>{formatCurrency(item.valor)}</td>
                          <td>{item.fixoVariavel}</td>
                          <td>{item.parcelas}</td>
                          <td>{item.observacoes}</td>
                          <td>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <IconButton
                                  color="info"
                                  onClick={() => handelEdit(item)}
                                  aria-label="edit"
                                >
                                  <Icon>edit</Icon>
                                </IconButton>
                              </Grid>
                              <Grid item xs={6}>
                                <IconButton
                                  color="error"
                                  onClick={() => handelDelete(item.id)}
                                  aria-label="delete"
                                >
                                  <Icon>delete</Icon>
                                </IconButton>
                              </Grid>
                            </Grid>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ProductsList>
                <TablePagination
                  sx={{
                    background: '#232f3e',
                    marginTop: '0.2rem',
                    color: '#f7f7f7',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                  }}
                  component="div"
                  rowsPerPageOptions={[5, 10, 50, totalElements]}
                  count={totalElements}
                  page={page}
                  onPageChange={onPageChange}
                  rowsPerPage={size}
                  onRowsPerPageChange={onRowsPerPageChange}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" textAlign="center" mt={5}>
            Usuario sem finanças adicionadas.
          </Typography>
        </Box>
      )}
      <Box>
        <Dialog open={edit}>
          <DialogTitle
            sx={{ background: '#232f3e', color: '#f7f7f7' }}
            textAlign="center"
          >
            Editar Financa
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} mt={3}>
              <Grid item xs={12}>
                <TextField
                  name="data"
                  label="Data"
                  type="date"
                  value={myFinances?.data || ''}
                  fullWidth
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="categoria"
                  label="Categoria"
                  fullWidth
                  onChange={handleInputChange}
                  value={myFinances?.categoria || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="descricao"
                  label="Descrição"
                  fullWidth
                  onChange={handleInputChange}
                  value={myFinances?.descricao || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-label">Tipo</InputLabel>
                  <Select
                    name="tipo"
                    labelId="select-label"
                    value={myFinances?.tipo}
                    onChange={handleSelectChange}
                    label="Tipo"
                  >
                    <MenuItem value="Despesa">Despesa</MenuItem>
                    <MenuItem value="Receita">Receita</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="valor"
                  label="Valor (R$)"
                  type="text"
                  fullWidth
                  onChange={handleInputChange}
                  value={myFinances?.valor || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categoria Despesa</InputLabel>
                  <Select
                    name="fixoVariavel"
                    value={myFinances?.fixoVariavel}
                    label="Categoria Despesa"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="Fixo">Fixo</MenuItem>
                    <MenuItem value="Variavel">Variável</MenuItem>
                    <MenuItem value="Parcela">Parcela</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {myFinances?.fixoVariavel === 'Parcela' && (
                <Grid item xs={12}>
                  <TextField
                    name="parcelas"
                    label="Parcelas"
                    fullWidth
                    onChange={handleInputChange}
                    value={myFinances?.parcelas || ''}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="observacoes"
                  label="Observações"
                  fullWidth
                  onChange={handleInputChange}
                  value={myFinances?.observacoes || ''}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="end" spacing={1} mr={2}>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => hendleSalveEdit()}
                  color="primary"
                >
                  Salvar
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setEdit(false)}
                  color="warning"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
        <Dialog open={financeDelete} onClose={() => setFinanceDelete(false)}>
          <DialogTitle
            sx={{ background: '#232f3e', color: '#f7f7f7' }}
            textAlign="center"
          >
            Excluir Finança
          </DialogTitle>
          <DialogContent>
            <DialogContentText mt={2}>
              Tem certeza que deseja excluir este registro?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container spacing={1} justifyContent="space-evenly">
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  onClick={() => setFinanceDelete(false)}
                  color="warning"
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (itemToDelete !== null) {
                      deleteFinance(itemToDelete)
                    }
                    setFinanceDelete(false)
                  }}
                  color="primary"
                >
                  Confirmar
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
        <Dialog open={financeAdd}>
          <DialogTitle
            sx={{ background: '#232f3e', color: '#f7f7f7' }}
            textAlign="center"
          >
            Adicionar Financa
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} mt={3}>
              <Grid item xs={12}>
                <TextField
                  name="data"
                  label="Data"
                  type="date"
                  fullWidth
                  value={formValuesAdd.data}
                  onChange={handleInputChangeAdd}
                  InputLabelProps={{ shrink: true }}
                  error={errors.data}
                  helperText={errors.data ? 'Campo obrigatório' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Categoria
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="categoria"
                    value={formValuesAdd.categoria || ''}
                    label="Categoria"
                    onChange={handleSelectChangeAdd}
                  >
                    {Array.isArray(categorias) &&
                      categorias.map((categoria, index) => (
                        <MenuItem key={index} value={categoria}>
                          {categoria}
                        </MenuItem>
                      ))}
                    <MenuItem value="Outro">Outro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formValuesAdd.categoria === 'Outro' && (
                <Grid item xs={12}>
                  <TextField
                    name="novaCategoria"
                    label="Nova Categoria"
                    fullWidth
                    value={novaCategoria}
                    onChange={handleNovaCategoriaChange}
                    error={errors.categoria}
                    helperText={
                      errors.categoria ? 'Por favor, insira uma categoria' : ''
                    }
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="descricao"
                  label="Descrição"
                  fullWidth
                  value={formValuesAdd.descricao}
                  onChange={handleInputChangeAdd}
                  error={errors.descricao}
                  helperText={errors.descricao ? 'Campo obrigatório' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-label">Tipo</InputLabel>
                  <Select
                    name="tipo"
                    labelId="select-label"
                    value={formValuesAdd.tipo}
                    onChange={handleSelectChangeAdd}
                    label="Tipo"
                  >
                    <MenuItem value="Despesa">Despesa</MenuItem>
                    <MenuItem value="Receita">Receita</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="valor"
                  label="Valor (R$)"
                  fullWidth
                  type="number"
                  value={formValuesAdd.valor ?? ''}
                  onChange={handleInputChangeAdd}
                  error={errors.valor}
                  helperText={errors.valor ? 'Campo obrigatório' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categoria Despesa</InputLabel>
                  <Select
                    name="fixoVariavel"
                    label="Categoria Despesa"
                    value={formValuesAdd.fixoVariavel || ''}
                    onChange={handleSelectChangeAdd}
                  >
                    <MenuItem value="Fixo">Fixo</MenuItem>
                    <MenuItem value="Variavel">Variável</MenuItem>
                    <MenuItem value="Parcela">Parcela</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formValuesAdd.fixoVariavel === 'Parcela' && (
                <Grid item xs={12}>
                  <TextField
                    name="parcelas"
                    label="Parcelas"
                    fullWidth
                    type="number"
                    value={formValuesAdd.parcelas ?? ''}
                    onChange={handleInputChangeAdd}
                    error={errors.parcelas}
                    helperText={errors.parcelas ? 'Campo obrigatório' : ''}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="observacoes"
                  label="Observações"
                  fullWidth
                  value={formValuesAdd.observacoes ?? ''}
                  onChange={handleInputChangeAdd}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="end" spacing={1} mr={2}>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSaveAdd}
                  color="primary"
                >
                  Salvar
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setFinanceAdd(false)}
                  color="warning"
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
