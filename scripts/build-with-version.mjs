import { spawn } from "node:child_process";

const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || "";
const shortSha = commitSha ? commitSha.slice(0, 7) : "";
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const fallback = `local-${stamp}`;

const buildVersion =
  process.env.VITE_BUILD_VERSION ||
  shortSha ||
  process.env.npm_package_version ||
  fallback;

const child = spawn("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    VITE_BUILD_VERSION: buildVersion,
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error("Failed to run build:", error);
  process.exit(1);
});
