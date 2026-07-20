import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Load .env.local to get GITHUB_TOKEN if not set in system env
function loadEnv() {
  try {
    const envPath = resolve(rootDir, '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val.trim();
      }
    }
  } catch {
    // .env.local not found, continue without it
  }
}

loadEnv();

// Get commit message from command line arguments, default to 'auto update'
const commitMessage = process.argv.slice(2).join(' ') || 'auto update';

try {
  console.log('📦 Staging changes...');
  execSync('git add .', { stdio: 'inherit', cwd: rootDir });

  try {
    console.log(`💾 Committing with message: "${commitMessage}"...`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (commitError) {
    console.log('ℹ️ Nothing to commit (or commit failed). Continuing...');
  }

  try {
    console.log('🚀 Pushing to Git...');
    const token = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN)?.trim();
    if (token) {
      // Get remote URL, strip any existing credentials, then inject token
      let remoteUrl = execSync('git remote get-url origin', { cwd: rootDir }).toString().trim();
      // Remove any existing user:token@ from the URL
      remoteUrl = remoteUrl.replace(/https:\/\/[^@]+@/, 'https://');
      const authedUrl = remoteUrl.replace('https://', `https://shaswatxd:${token}@`);
      execSync(`git push "${authedUrl}"`, { stdio: 'inherit', cwd: rootDir });
    } else {
      console.log('⚠️ No GITHUB_TOKEN found — trying default push...');
      execSync('git push', { stdio: 'inherit', cwd: rootDir });
    }
  } catch (pushError) {
    console.log('ℹ️ Push failed or nothing to push. Continuing...');
  }

  console.log('☁️ Deploying to Vercel...');
  const vercelToken = process.env.VERCEL_TOKEN;
  if (vercelToken) {
    execSync(`npx vercel --prod --yes --token ${vercelToken}`, { stdio: 'inherit', cwd: rootDir });
  } else {
    execSync('npx vercel --prod --yes', { stdio: 'inherit', cwd: rootDir });
  }

  console.log('✨ All done! Project is updated and deployed.');
} catch (error) {
  console.error('❌ An error occurred:', error.message);
  process.exit(1);
}
