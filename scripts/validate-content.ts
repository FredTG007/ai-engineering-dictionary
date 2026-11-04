import { loadCurriculum, loadTerms } from "../lib/content/loadDictionary";
import { validateDictionary } from "../lib/validation/validateDictionary";

function main(): void {
  const terms = loadTerms();
  const errors = validateDictionary(terms, loadCurriculum());
  if (errors.length > 0) {
    errors.forEach(({ slug, message }) => console.error(`✗ ${slug}: ${message}`));
    console.error(`\n${errors.length} problem(s) found.`);
    process.exit(1);
  }
  console.log(`✓ ${terms.length} terms valid.`);
}

main();
