import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css'
import App from "./App"
import {BrowserRouter} from "react-router-dom";
import {Account} from "./Account";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //<React.StrictMode>
        <BrowserRouter>
            <Account>
                <App/>
            </Account>
        </BrowserRouter>
//</React.StrictMode>
);

