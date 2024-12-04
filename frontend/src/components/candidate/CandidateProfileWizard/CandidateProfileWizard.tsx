import { SvgIconComponent } from '@mui/icons-material';
import {
  Box,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import Completion from './Completion/Completion';

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: theme.palette.action.disabled,
  zIndex: 1,
  color: theme.palette.primary.contrastText,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: theme.palette.primary.light,
        boxShadow: theme.shadows[8],
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  ],
}));

const ColorlibStepIcon =
  (icon?: SvgIconComponent) => (props: StepIconProps) => {
    const { active, completed, className } = props;

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icon && React.createElement(icon)}
      </ColorlibStepIconRoot>
    );
  };

export interface Step {
  name: string;
  Component: React.ComponentType<{
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    optional?: boolean;
  }>;
  optional?: boolean;
  icon?: SvgIconComponent;
}

interface Props {
  steps: Step[];
}

const CandidateProfileWizard = ({ steps }: Props) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return steps[step].optional === true;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        sx={{
          py: isSmall ? 1 : 2,
        }}
      >
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (!isSmall && isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={step.name} {...stepProps}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon(step.icon)}
                {...labelProps}
              >
                {isSmall ? '' : step.name}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ mt: 2, mb: 1 }}>
        {activeStep + 1 > steps.length ? (
          <Completion />
        ) : (
          <React.Fragment>
            {React.createElement(steps[activeStep].Component, {
              onNext: handleNext,
              onBack: handleBack,
              onSkip: handleSkip,
              optional: steps[activeStep].optional,
            })}
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default CandidateProfileWizard;
