import { Box, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { TabelaDeValores } from '../../components/TabelaDeValores'
import { formatCurrency } from '../../functions'
import { FinanceCharts } from '../../components/Graficos'
import { Financa } from '../../models/tabelaGeral'
import { apiService } from '../../api/Requests'
import { toast } from 'react-toastify'

export function Dashboard() {
  const [total, setTotal] = useState(0)
  const [finance, setFinance] = useState<Financa[]>()

  const handleTotalChange = (newTotal: number) => {
    setTotal(newTotal)
  }

  async function financas() {
    try {
      const response = await apiService.get({
        url: '/finances',
      })
      setFinance(response.data)
    } catch (error) {
      toast.error('Usuário não possui finanças')
      throw error
    }
  }

  useEffect(() => {
    financas()
  }, [])

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
          <h3>Saldo/Debito Mensal: {formatCurrency(total)}</h3>
        </Grid>
        <Grid item xs={12}>
          <TabelaDeValores
            onTotalChange={handleTotalChange}
            finance={finance || []}
            onAddFinance={financas}
          />
        </Grid>
        <Grid item xs={12}>
          <FinanceCharts finance={finance || []} />
        </Grid>
      </Grid>
    </Box>
  )
}
