# 🚀 Quick Start Guide 

*Get your personal website and GitHub profile sync running in 5 minutes! 

---

### Step 1: Setup Environment (30 seconds)
```bash
# Clone and install
git clone <your-repo>
cd your-repo
npm install

# Setup environment
cp .env.example .env
# Edit .env with your GitHub username
```

### Step 2: Customize Content (2 minutes)
Edit these key files in `config/` folder:
- `intro.yaml` - Your name and contact
- `projects.yaml` - Add your projects
- `experience.yaml` - Add work experience

### Step 3: Test Locally (30 seconds)
```bash
npm run dev          # Start website at localhost:3000
npm run test-sync    # Test sync configuration
```

### Step 4: Setup GitHub Sync (2 minutes)
1. Create GitHub token: GitHub Settings → Developer settings → Personal access tokens
2. Create profile repo: `YourUsername/YourUsername`
3. Add `PROFILE_SYNC_TOKEN` secret to your website repo
4. Push changes - auto-sync activates!

### Step 5: Done! 🎉
Your website runs at localhost:3000 and GitHub profile updates automatically!

---


## 🔗 Essential Commands 

```bash
npm run dev              # Development server 
npm run build            # Build for production 
npm run generate-readme  # Generate README 
npm run sync-github      # Sync to GitHub 
npm run test-sync        # Test configuration 
```

## 📁 Key Files to Edit

```
config/
├── intro.yaml      # Name, title, contact 
├── projects.yaml   # Your projects 
├── experience.yaml # Work experience 
├── tech_stack.yaml # Technologies 
└── education.yaml  # Education 
```

## 🆘 Need Help?

- 📖 Full documentation in `README.md` 
- 🧪 Test your setup: `npm run test-sync`
- 🔧 Troubleshooting in main README 

---

*Happy coding! * 🚀