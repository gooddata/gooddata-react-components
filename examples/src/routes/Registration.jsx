// (C) 2007-2018 GoodData Corporation
import React from 'react';

import RegistrationComponent from '../components/utils/Registration';

export const Registration = props => (
    <div>
        <style jsx>{`
                h1,
                p {
                    margin-right: auto;
                    margin-left: auto;
                    text-align: center;
                }
          `}</style>
        <h1>Registration</h1>

        <p>Please register your GoodData account in order to see GoodData UI components live.</p>

        <hr className="separator" />

        <RegistrationComponent {...props} />
    </div>
);

export default Registration;
