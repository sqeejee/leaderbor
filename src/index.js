import React from 'react';
import { render } from 'react-dom';
import './index.scss';
import App from './App';
import { UserProvider } from './contexts/users.context';
import { ProductsProvider  } from './contexts/prodcut.context';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import {Elements} from '@stripe/react-stripe-js';
import {stripePromise} from './utils/firebase/stripe/stripe.utils';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ProductsProvider>
          <Elements stripe={stripePromise}>
        <App />
          </Elements>
        </ProductsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);