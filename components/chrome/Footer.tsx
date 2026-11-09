const X_PROFILE_URL = "https://x.com/fredoseiadu";

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__credit">Written by Fred Osei-Adu</p>
      <p className="footer__follow">
        New terms are announced on X.{" "}
        <a href={X_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          Follow @fredoseiadu
        </a>{" "}
        for updates.
      </p>
    </footer>
  );
}
