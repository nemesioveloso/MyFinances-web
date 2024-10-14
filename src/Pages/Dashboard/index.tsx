import { Box, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { TabelaDeValores } from '../../components/TabelaDeValores'
import { formatCurrency } from '../../functions'
import { FinanceCharts } from '../../components/Graficos'
import { FinanceResponse } from '../../models/tabelaGeral'
import { apiService } from '../../api/Requests'
import { toast } from 'react-toastify'

export function Dashboard() {
  const [total, setTotal] = useState(0)
  const [totalMes, setTotalMes] = useState(0)
  const [finance, setFinance] = useState<FinanceResponse>()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  console.log(totalMes);


  const handleTotalChange = (newTotal: number) => {
    setTotal(newTotal)
  }
  const handleTotalMonthChange = (newTotal: number) => {
    setTotalMes(newTotal)
  }

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  async function financas() {
    try {
      const response = await apiService.get({
        url: `/finances?page=${page}&size=${pageSize}`,
      })
      setFinance(response.data)
    } catch (error) {
      toast.error('Usuário não possui finanças')
      throw error
    }
  }

  useEffect(() => {
    financas()
  }, [page, pageSize])

  return (
    <Box>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h5" textAlign="center">
            Dashboard
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <hr style={{ margin: '1rem 0 1rem 0' }} />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5">My Finances Dasboard</Typography>
        </Grid>
        <Grid item xs={4} justifyContent="end">
          <h3>Saldo Total: {formatCurrency(total)}</h3>
          <h3>Saldo/Debito Mensal: {formatCurrency(totalMes)}</h3>
        </Grid>
        <Grid item xs={12}>
          <TabelaDeValores
            onTotalChange={handleTotalChange}
            onTotalMonthChange={handleTotalMonthChange}
            dados={
              finance || {
                size: 0,
                totalPages: 0,
                page: 0,
                list: [],
                totalElements: 0,
              }
            }
            onAddFinance={financas}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
        <Grid item xs={12}>
          <FinanceCharts finance={finance?.list || []} />
        </Grid>
      </Grid>
    </Box>
  )
}
