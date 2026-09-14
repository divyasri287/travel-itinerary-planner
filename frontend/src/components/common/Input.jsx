const Input = ({ label, id, error, ...rest }) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className="form-input" {...rest} />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Input;
