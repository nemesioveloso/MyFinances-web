import { Line, Pie } from 'react-chartjs-2'

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Financa } from '../../models/tabelaGeral'
import { Box, Card, Grid, Typography } from '@mui/material'
import { transformDate } from '../../functions'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
)

interface FinanceChartsProps {
  finance: Financa[]
}

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ finance }) => {
  const monthlyBalance = finance.reduce(
    (acc, curr) => {
      const month = transformDate(curr.data.substring(0, 7))
      if (!acc[month]) {
        acc[month] = { receita: 0, despesa: 0 }
      }
      if (curr.tipo === 'Receita') {
        acc[month].receita += curr.valor
      } else {
        acc[month].despesa += curr.valor
      }
      return acc
    },
    {} as Record<string, { receita: number; despesa: number }>,
  )

  const labels = Object.keys(monthlyBalance)
  const saldoData = labels.map(
    (label) => monthlyBalance[label].receita - monthlyBalance[label].despesa,
  )

  const lastMonth = labels[labels.length - 1]
  const lastMonthReceita = monthlyBalance[lastMonth]?.receita || 0
  const lastMonthDespesa = monthlyBalance[lastMonth]?.despesa || 0

  const dataLine = {
    labels,
    datasets: [
      {
        label: 'Saldo Mensal',
        data: saldoData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
    ],
  }

  const dataPie = {
    labels: ['Receita', 'Despesa'],
    datasets: [
      {
        data: [lastMonthReceita, lastMonthDespesa],
        backgroundColor: ['rgb(116, 238, 124)', 'rgba(236, 47, 47, 0.941)'],
        hoverBackgroundColor: ['#00ff04', '#ff0000'],
      },
    ],
  }

  return (
    <Box>
      {finance && finance?.length > 0 && (
        <Grid container spacing={1} justifyContent="space-evenly">
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Card
              elevation={6}
              sx={{
                borderRadius: '8px',
              }}
            >
              <Grid container justifyContent="center">
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center" mt={2}>
                    Gráfico de Receita e Despesa do Último Mês
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: 'auto',
                    maxHeight: { xs: 310, sm: 400, md: 400, lg: 400 },
                    minHeight: { xs: 310, sm: 400, md: 400, lg: 400 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Pie data={dataPie} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Card
              elevation={6}
              sx={{
                borderRadius: '8px',
              }}
            >
              <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center" mt={2}>
                    Gráfico de Linha (Diferença Mensal)
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: 'auto',
                    maxHeight: { xs: 310, sm: 400, md: 400, lg: 400 },
                    minHeight: { xs: 310, sm: 400, md: 400, lg: 400 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Line data={dataLine} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
