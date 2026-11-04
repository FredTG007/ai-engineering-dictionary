import { NewsletterForm } from "./NewsletterForm";

const X_PROFILE_URL = "https://x.com/fredoseiadu";

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__credit">
        Written by Fred Osei-Adu ·{" "}
        <a href={X_PROFILE_URL} target="_blank" rel="noreferrer">
          Follow on X
        </a>
      </p>
      <NewsletterForm />
    </footer>
  );
}
