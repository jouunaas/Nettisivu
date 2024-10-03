// pages/_app.js

import { ThemeProvider } from '../lib/ThemeContext'; // Adjust the path if you keep ThemeContext in a different directory
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
