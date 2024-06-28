// pages/_error.tsx
import { NextPageContext } from 'next';
// import Router from 'next/router';
// import { useEffect } from 'react';

interface ErrorProps {
    statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
    //   useEffect(() => {
    //     // Redirect to a custom error page
    //     Router.push('/custom-error-page');
    //   }, []);

    return (
        <div>
            <h1>An error occurred</h1>
            <p>Error status code: {statusCode}</p>
        </div>
    );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default ErrorPage;
