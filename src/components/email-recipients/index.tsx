import React, { FC, useEffect, useState } from 'react';

import dummyEmails from '../../constants/dummy-emails';
import { Emails } from '../../types';

import EmailRecipientsInput from './../email-recipients-input';


const FETCHING_CONTACTS_TEXT = (
    <>Fetching your contacts...</>
);

const ERROR_FETCHING_CONTACTS_TEXT = (
    <>There was a problem fetching your contacts. Please refresh.</>
);


const EmailRecipients: FC = () => {
    const [emails, setEmails] = useState<Emails>([]);
    const [error, setError] = useState<String>('');
    const [isLoading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then((res) => res.json())
            .then((data) => {
                setEmails(dummyEmails);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return (
        isLoading ? FETCHING_CONTACTS_TEXT
            : (
                error
                    ? ERROR_FETCHING_CONTACTS_TEXT
                    : <EmailRecipientsInput suggestions={emails} />
            )
    );
}

export default EmailRecipients as FC;