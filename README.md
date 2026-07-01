# 🌍 Personal Website & GitHub Profile Sync 

---

### 🚀 Personal Website & GitHub Profile Auto-Sync System

This is a Next.js personal portfolio website that automatically generates and syncs a README to your GitHub profile repository. Built with YAML-based configuration for easy content management.

#### ✨ Features

- 🌐 **Modern Next.js Website** with Tailwind CSS & ShadCN UI
- 📝 **YAML-Based Content** - Easy to edit configuration files
- 🤖 **Auto-Sync to GitHub** - Keep your GitHub profile updated automatically
- 🏷️ **Smart Project Filtering** - Filter projects by technology tags
- 📱 **Responsive Design** - Works on all devices
- 🔄 **Real-time Updates** - Changes sync automatically via GitHub Actions
- 🌍 **Bilingual Support** - Documentation in English and Chinese

#### 🛠️ Tech Stack

- **Frontend**: Next.js 15+, React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI, Lucide Icons
- **Content**: YAML configuration files
- **Automation**: GitHub Actions, Node.js scripts
- **Markdown**: React-Markdown for proper formatting

---

### 🏗️ Setup Instructions

#### 1. Clone & Install

```bash
git clone <your-repo-url>
cd your-repo-name
npm install
```

#### 2. Configure Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` with your information:

```env
# GitHub Configuration
GITHUB_USERNAME=YourGitHubUsername
GITHUB_PROFILE_REPO=YourGitHubUsername/YourGitHubUsername

# Git Configuration  
GIT_USER_NAME=Your Full Name
GIT_USER_EMAIL=your.email@example.com

# Commit Configuration
COMMIT_MESSAGE=🤖 Auto-update profile README from website
COMMIT_BRANCH=main

# Language Configuration (en/in)
DEFAULT_LANGUAGE=en
```

#### 3. Customize Your Content

Edit the YAML files in the `config/` directory:

- **`config/intro.yaml`** - Your name, title, contact info, quote
- **`config/projects.yaml`** - Your projects with descriptions and tech tags
- **`config/experience.yaml`** - Work experience and achievements
- **`config/tech_stack.yaml`** - Technologies organized by categories
- **`config/education.yaml`** - Educational background
- **`config/current_work.yaml`** - What you're currently working on
- **`config/learning.yaml`** - What you're currently learning
- **`config/fun_facts.yaml`** - Personal fun facts
- **`config/journey.yaml`** - Your tech journey timeline

#### 4. Test Locally

```bash
# Test the setup
npm run test-sync

# Generate README from YAML
npm run generate-readme

# Run the website locally
npm run dev
```

#### 5. Setup GitHub Auto-Sync (Optional but Recommended)

##### 5.1 Create Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `Profile Sync Token`
4. Scopes: Select `repo` (full control)
5. Copy the generated token

##### 5.2 Create Profile Repository
```bash
# Create repository with your exact username
gh repo create YourUsername/YourUsername --public --clone
cd YourUsername
echo "# Hi there! 👋" > README.md
git add . && git commit -m "Initial commit" && git push
```

##### 5.3 Add Secrets to Website Repository
1. Go to your website repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `PROFILE_SYNC_TOKEN` = Your personal access token

##### 5.4 Add Variables (Optional)
Go to Settings → Secrets and variables → Actions → Variables tab:
- `GITHUB_USERNAME` = Your GitHub username
- `GITHUB_PROFILE_REPO` = YourUsername/YourUsername
- `GIT_USER_NAME` = Your display name
- `GIT_USER_EMAIL` = Your email

##### 5.5 Push and Activate
```bash
git add .
git commit -m "Setup auto-sync system"
git push origin main
```

---

### 🎯 Usage

#### Development Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run generate-readme  # Generate README from YAML files
npm run deploy-profile   # Deploy README to GitHub profile
npm run sync-github      # Generate + Deploy in one command
npm run test-sync        # Test all configurations
```

#### Content Management

1. **Edit YAML files** in `config/` directory
2. **Push changes** to your repository
3. **GitHub Actions automatically**:
   - Generates new README
   - Updates your GitHub profile
   - Takes 2-3 minutes

#### Manual Sync (Alternative)

```bash
# Authenticate with GitHub CLI (one-time)
gh auth login

# Sync manually
npm run sync-github
```

---

### 📁 Project Structure

```
├── config/                  # YAML configuration files
│   ├── intro.yaml          # Personal intro & contact
│   ├── projects.yaml       # Project portfolio
│   ├── experience.yaml     # Work experience
│   ├── tech_stack.yaml     # Technology skills
│   └── ...                 # Other content files
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   │   ├── sections/       # Content sections
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript types
├── .github/workflows/      # GitHub Actions
├── generateReadme.js       # README generator script
├── deployToGithub.js      # GitHub sync script
├── .env                   # Environment variables
└── README.md              # This file
```

---

### 🔧 Customization

#### Adding New Content Sections

1. **Create new YAML file** in `config/`
2. **Add corresponding component** in `src/components/sections/`
3. **Update types** in `src/types/index.ts`
4. **Generator automatically detects** new files

#### Modifying Design

- **Tailwind classes** in components for styling
- **ShadCN components** for consistent UI
- **Edit layout** in `src/app/page.tsx`

#### Changing Sync Behavior

- **Modify triggers** in `.github/workflows/sync-profile-readme.yml`
- **Update commit messages** in `.env`
- **Change target repository** in environment variables

---

### 🐛 Troubleshooting

#### Common Issues

**Sync Not Working?**
```bash
npm run test-sync  # Check all configurations
gh auth status     # Verify GitHub authentication
```

**README Not Generated?**
```bash
npm run generate-readme  # Test generation locally
# Check YAML syntax in config files
```

**GitHub Actions Failing?**
1. Check Actions tab in your repository
2. Verify `PROFILE_SYNC_TOKEN` secret is set
3. Ensure target repository exists
4. Check token permissions include `repo`

---

### 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ShadCN UI Components](https://ui.shadcn.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [YAML Syntax Guide](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)

---


## 🤝 Contributing 

Feel free to open issues and pull requests! 

## 📄 License 

MIT License 

---

*Generated with ❤️ using Next.js and GitHub Actions *
