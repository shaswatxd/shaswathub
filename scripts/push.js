import { execSync } from 'child_process';

// Get commit message from command line arguments, default to 'auto update'
const commitMessage = process.argv.slice(2).join(' ') || 'auto update';

try {
  console.log('📦 Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  try {
    console.log(`💾 Committing with message: "${commitMessage}"...`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  } catch (commitError) {
    console.log('ℹ️ Nothing to commit (or commit failed). Continuing...');
  }

  try {
    console.log('🚀 Pushing to Git...');
    execSync('git push', { stdio: 'inherit' });
  } catch (pushError) {
    console.log('ℹ️ Push failed or nothing to push. Continuing...');
  }

  console.log('☁️ Deploying to Vercel...');
  execSync('npx vercel --prod --yes', { stdio: 'inherit' });

  console.log('✨ All done! Project is updated and deployed.');
} catch (error) {
  console.error('❌ An error occurred:', error.message);
  process.exit(1);
}
