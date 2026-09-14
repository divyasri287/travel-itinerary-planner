const Button = ({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  onClick,
  ...rest
}) => {
  const className = variant === "primary" ? "btn btn-primary" : "btn btn-secondary";

  return (
    <button type={type} className={className} disabled={disabled || isLoading} onClick={onClick} {...rest}>
      {isLoading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
