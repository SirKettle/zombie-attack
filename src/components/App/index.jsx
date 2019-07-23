import '@babel/polyfill';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Game } from '../Game';

const GlobalStyle = createGlobalStyle`
  body {
    background: black;
    color: white;
  }
`;

export const App = ({ isHot }) => {
  return (
    <div>
      <GlobalStyle />
      <Game />
    </div>
  );
};
