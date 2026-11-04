import { NewsletterForm } from "./NewsletterForm";

// TODO: replace with Fred's X handle, e.g. https://x.com/<handle>
const X_PROFILE_URL = "https://x.com/";

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
