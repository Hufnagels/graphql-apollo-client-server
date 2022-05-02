import * as React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';

// Material
import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};

const CustomTheme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    custom: {
      light: grey[100],
      main: grey[400],
      dark: grey[700],
      contrastText: grey[50],
    },
  },
  components: {
    MuiCardActionArea: {
      styleOverrides: {
        root:{
          "&:hover ": {
            opacity: '0.5'
          }
        },
        focusHighlight: {
          opacity: '0',

        },
      }
    },
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
      styleOverrides: {
        root:{          
          "&:hover ": {
            opacity: '1.5'
          }
        },
      }
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
      styleOverrides: {
        root:{
          opacity: '0.8',
          "&.link-button:hover ": {
            opacity: '1',
            boxShadow: 'none !important',
            backgroundColor: '#6879dd !important',
          },
          "&.link-button:active ": {
            opacity: '1',
            boxShadow: 'none !important',
            backgroundColor: '#002884 !important',
          },
          "&.link-button.active-button": {
            border:'none',
            boxShadow: 'none',
            backgroundColor: '#6879dd  !important',
          },
        }
        
      }
    },
  }
});

export default CustomTheme