// (C) 2007-2018 GoodData Corporation
import React from 'react';
import ExampleWithSource from '../components/utils/ExampleWithSource';

import CorsExample from '../components/CorsExample';
import CorsExampleSRC from '!raw-loader!../components/CorsExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first


export const Cors = () => (
    <div>
        <h1>Dealing with CORS</h1>

        <p>
            It&apos;s a primary purpose of UI SDK to allow developers embedding GoodData
            chars within their applications, but this often comes with a problem,&nbsp;
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a>.
        </p>

        <p>
            In order to set custom domain name you can use GoodDataProvider and use domain parameter.
        </p>

        <p>
            Wrap the root of your application by the GoodDataProvider and all the settings there will be
            automatically set on all the UI SDK components.
        </p>

        <hr className="separator" />

        <ExampleWithSource for={CorsExample} source={CorsExampleSRC} />
    </div>
);

export default Cors;
