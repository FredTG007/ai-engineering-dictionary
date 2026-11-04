"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: wire newsletter backend
    setMessage("Thanks! The newsletter isn't live yet — nothing was sent. Check back soon.");
  };

  return (
    <form className="newsletter" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="newsletter__label">
        New terms, occasionally
      </label>
      <div className="newsletter__row">
        <input id="newsletter-email" className="newsletter__input" type="email" required placeholder="you@company.com" />
        <button type="submit" className="newsletter__button">
          Subscribe
        </button>
      </div>
      {message && (
        <p className="newsletter__message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
