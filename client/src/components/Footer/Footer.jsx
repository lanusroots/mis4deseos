export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>
          © {new Date().getFullYear()} <span className="footer__icon">🎂</span>{" "}
          <strong>mis4deseos</strong>. Creado por MaxFernandez. All rights
          reserved.
        </p>

        <div className="footer__socials">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}
