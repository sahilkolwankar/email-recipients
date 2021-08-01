import React from 'react';
import EmailRecipients from './components/email-recipients';
import style from './App.module.scss';

function App() {
    return (
        <div className={style.app}>
            <EmailRecipients />
        </div>
    );
}

export default App;
