import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { SnackbarProvider } from 'notistack';
import reportWebVitals from './reportWebVitals';

// Material
import { ThemeProvider } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Custom
import './index.scss';
import App from './App';
import CustomTheme from './app/theme/CustomTheme';
import CustomApolloProvider from './app/apollo/apolloClient'
import { store, persistor } from './app/store/store'

const rootElement = document.getElementById("root");
ReactDOM.render(
  /* <AuthProvider> */
  <ReduxStoreProvider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <CustomApolloProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={CustomTheme} >
            <BrowserRouter>
              <React.StrictMode>
                <SnackbarProvider maxSnack={5}>
                  <App />
                </SnackbarProvider>
              </React.StrictMode>
            </BrowserRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </CustomApolloProvider>
    </PersistGate>
  </ReduxStoreProvider>
  /* </AuthProvider> */
  ,
  rootElement
);

reportWebVitals();