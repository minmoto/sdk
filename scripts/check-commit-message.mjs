import { readFileSync } from "node:fs";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/check-commit-message.mjs <message-file> | --message <subject>");
  process.exit(2);
}

const message = source === "--message" ? process.argv.slice(3).join(" ") : readFileSync(source, "utf8");
const subject = message.split("\n", 1)[0].trim();
const conventionalCommit = /^(feat|fix|perf|refactor|docs|test|build|ci|chore|revert)(\([a-z0-9][a-z0-9._/-]*\))?!?: .+$/;
const generatedCommit = /^(Merge |Revert ")/;

if (!conventionalCommit.test(subject) && !generatedCommit.test(subject)) {
  console.error(`Invalid commit subject: ${subject}`);
  console.error("Use Conventional Commits, for example: feat: add Partner invoices client");
  process.exit(1);
}
