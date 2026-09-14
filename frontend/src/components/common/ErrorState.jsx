/**
 * Consistent inline error alert used across pages/tabs that fetch data.
 * `onRetry` is optional — pass the same load function the component
 * already uses on mount to let the user retry without a full page reload.
 */
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="alert alert-error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="alert-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
