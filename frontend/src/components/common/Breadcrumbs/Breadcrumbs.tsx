import { SvgIconComponent } from '@mui/icons-material';
import {
  Container,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import React from 'react';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '16px',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.secondary.main,
}));

export interface BreadcrumbItem {
  label?: string;
  icon?: SvgIconComponent;
  path?: string;
  isActive?: boolean;
}

interface Props {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: Props) => {
  return (
    <StyledContainer>
      <MuiBreadcrumbs aria-label="breadcrumb" sx={{ py: 2 }}>
        {items.map((item, index) => (
          <Link
            key={index}
            underline={item.isActive ? 'none' : 'hover'}
            color="inherit"
            href={item.path}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {item.icon &&
                React.createElement(item.icon, {
                  color: item.isActive ? undefined : 'disabled',
                })}
              <Typography color={item.isActive ? undefined : 'text.disabled'}>
                {item.label}
              </Typography>
            </Stack>
          </Link>
        ))}
      </MuiBreadcrumbs>
    </StyledContainer>
  );
};

export default Breadcrumbs;
