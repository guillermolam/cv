/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import './App.css';
import App from './App.tsx';

const root = document.getElementById('root');

if (root) {
  render(() => <App />, root);
} else {
  throw new Error("Root element with id 'root' not found.");
}
