const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ReadmeGenerator = require('./generateReadme.js');

// Load environment variables
require('dotenv').config();

class GitHubProfileUpdater {
  constructor(options = {}) {
    this.profileRepo = options.profileRepo || process.env.GITHUB_PROFILE_REPO || 'Sakhreliya-Nihar/Sakhreliya-Nihar';
    this.githubUsername = options.githubUsername || process.env.GITHUB_USERNAME || 'Sakhreliya-Nihar';
    this.tempDir = path.join(__dirname, 'temp-profile-repo');
    this.commitMessage = options.commitMessage || process.env.COMMIT_MESSAGE || '🤖 Auto-update profile README from website';
    this.branch = options.branch || process.env.COMMIT_BRANCH || 'main';
    this.gitUserName = options.gitUserName || process.env.GIT_USER_NAME || 'GitHub Bot';
    this.gitUserEmail = options.gitUserEmail || process.env.GIT_USER_EMAIL || 'noreply@github.com';
  }

  // Execute shell command with error handling
  exec(command, options = {}) {
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });
      return result;
    } catch (error) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
      throw error;
    }
  }

  // Check if git is configured
  checkGitConfig() {
    try {
      const email = this.exec('git config user.email', { silent: true }).trim();
      const name = this.exec('git config user.name', { silent: true }).trim();

      if (!email || !name) {
        console.log('⚠️  Git user not configured. Please run:');
        console.log('   git config --global user.email "your-email@example.com"');
        console.log('   git config --global user.name "Your Name"');
        return false;
      }

      console.log(`✅ Git configured as: ${name} <${email}>`);
      return true;
    } catch (error) {
      console.error('❌ Git not found or not configured');
      return false;
    }
  }

  // Check if GitHub CLI is available and authenticated
  checkGitHubCLI() {
    try {
      this.exec('gh auth status', { silent: true });
      console.log('✅ GitHub CLI authenticated');
      return true;
    } catch (error) {
      console.log('⚠️  GitHub CLI not authenticated. Please run: gh auth login');
      return false;
    }
  }

  // Clean up temporary directory
  cleanup() {
    if (fs.existsSync(this.tempDir)) {
      console.log('🧹 Cleaning up temporary files...');
      try {
        // Use different approaches based on OS
        if (process.platform === 'win32') {
          this.exec(`rmdir /s /q "${this.tempDir}"`, { silent: true });
        } else {
          this.exec(`rm -rf "${this.tempDir}"`, { silent: true });
        }
      } catch (error) {
        console.warn('⚠️  Could not clean up temp directory:', this.tempDir);
      }
    }
  }

  // Clone or update the profile repository
  setupProfileRepo() {
    console.log(`📂 Setting up profile repository: ${this.profileRepo}`);

    this.cleanup(); // Clean up any existing temp dir

    try {
      // Clone the repository
      this.exec(`git clone https://github.com/${this.profileRepo}.git "${this.tempDir}"`);
      console.log('✅ Repository cloned successfully');
    } catch (error) {
      // If clone fails, try creating the repo if it doesn't exist
      console.log('⚠️  Clone failed, repository might not exist');
      console.log('💡 You may need to create the repository first or check permissions');
      throw error;
    }
  }

  // Generate README and copy to profile repo
  updateReadme() {
    console.log('📝 Generating README from YAML files...');

    // Generate the README
    const generator = new ReadmeGenerator('./config', './README.md');
    generator.generateReadme();

    console.log('📋 Copying README to profile repository...');

    // Copy the generated README to the profile repo
    const sourceReadme = path.join(__dirname, 'README.md');
    const targetReadme = path.join(this.tempDir, 'README.md');

    if (!fs.existsSync(sourceReadme)) {
      throw new Error('❌ Generated README.md not found');
    }

    fs.copyFileSync(sourceReadme, targetReadme);
    console.log('✅ README copied successfully');
  }

  // Commit and push changes
  async pushChanges() {
    console.log('🚀 Pushing changes to GitHub...');

    // Change to temp directory
    process.chdir(this.tempDir);

    try {
      // Check if there are any changes
      const status = this.exec('git status --porcelain', { silent: true });

      if (!status.trim()) {
        console.log('✅ No changes detected - README is already up to date');
        return false;
      }

      console.log('📝 Changes detected, committing...');

      // Stage changes
      this.exec('git add README.md');

      // Set git config for this commit
      this.exec(`git config user.name "${this.gitUserName}"`);
      this.exec(`git config user.email "${this.gitUserEmail}"`);

      // Commit with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fullMessage = `${this.commitMessage} (${timestamp})`;
      this.exec(`git commit -m "${fullMessage}"`);

      // Push to remote
      this.exec(`git push origin ${this.branch}`);

      console.log('✅ Changes pushed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to push changes');
      throw error;
    } finally {
      // Change back to original directory
      process.chdir(__dirname);
    }
  }

  // Main deployment function
  async deploy() {
    console.log('🚀 Starting GitHub Profile README deployment...\n');

    try {
      // Pre-flight checks
      if (!this.checkGitConfig()) {
        throw new Error('Git configuration required');
      }

      // Setup repository
      this.setupProfileRepo();

      // Generate and update README
      this.updateReadme();

      // Push changes
      const hasChanges = await this.pushChanges();

      if (hasChanges) {
        console.log(`\n✅ Profile README successfully updated!`);
        console.log(`🔗 View at: https://github.com/${this.githubUsername}`);
      } else {
        console.log('\n✅ Profile README is already up to date!');
      }

    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      throw error;
    } finally {
      this.cleanup();
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      options[key] = value;
    }
  }

  const updater = new GitHubProfileUpdater(options);

  updater.deploy().catch(error => {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = GitHubProfileUpdater;