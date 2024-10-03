// pages/_app.js
import React from 'react'; // Ensure React is imported
import { ThemeProvider } from '../lib/ThemeContext'; // Adjust the path if necessary
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
