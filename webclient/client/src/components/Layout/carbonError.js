import React, { useState } from 'react';
import { Title, useStore } from 'react-admin';
import { ErrorBoundary } from 'react-error-boundary';
import style from './index.module.scss';



function CarbonErrorMessage({ error, resetErrorBoundary }) {

	return (
		<div className={style.error}>
			<Title title="Error" />
			<p>test this!</p>
		</div>
	);
}




function CarbonError({ error, resetErrorBoundary }) {
	const [hasError, sethasError] = useStore('application.error',false);
	const [errorInfo, setErrorInfo] = useState(null);

	const handleError = (error, info) => {
		sethasError(true);
	}

	return (
		<ErrorBoundary
			onError={handleError}
			fallbackComponent={CarbonErrorMessage}
			onReset={() => sethasError(false)}
		/>


	)
}



export default CarbonError;