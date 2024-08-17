import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { FormCadastroClients } from '../Formulario'
import { useState } from 'react'

export const MyStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [step1, setStep1] = useState('Cadastro')

  const steps = [step1, 'Step 2', 'Step 3']

  const StepContent: React.FC<{ step: number; handleNext: () => void }> = ({
    step,
    handleNext,
  }) => {
    switch (step) {
      case 0:
        return (
          <FormCadastroClients
            handleNext={handleNext}
            handleFormError={handleFormError}
          />
        )
      case 1:
        return <Typography>Content for Step 2</Typography>
      case 2:
        return <Typography>Content for Step 3</Typography>
      default:
        return null
    }
  }

  const handleFormError = () => {
    setStep1('Formulário invalido')
  }
  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <StepContent step={activeStep} handleNext={handleNext} />
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
