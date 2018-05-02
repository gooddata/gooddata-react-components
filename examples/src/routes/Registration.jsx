// (C) 2007-2018 GoodData Corporation
import React from 'react';

import RegistrationComponent from '../components/utils/Registration';

export const Registration = props => (
    <div>
        <h1>Registration</h1>

        <p>Please register your GoodData account in order to see GoodData UI components live.</p>

        <hr className="separator" />

        <RegistrationComponent {...props} />
    </div>
);

export default Registration;
