function AuthCard({
  title,
  subtitle,
  children,
  footer,
  onSubmit,
  actionLabel,
  loading = false
}) {
  return (
    <section className="auth-card" aria-label={title}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <form onSubmit={onSubmit} className="auth-form">
        {children}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : actionLabel}
        </button>
      </form>
      {footer ? <div className="auth-footer">{footer}</div> : null}
    </section>
  );
}

export default AuthCard;