# Deploying WordSwipe to Netlify

This guide will walk you through deploying your WordSwipe game to Netlify.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. A Netlify account (free at [netlify.com](https://netlify.com))

## Deployment Options

### Option 1: Deploy with Git (Recommended)

1. **Push your code to a Git repository**

   - Create a new repository on GitHub, GitLab, or Bitbucket
   - Push your WordSwipe code to this repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

2. **Connect to Netlify**

   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your Git provider and select your repository

3. **Configure Build Settings**

   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: None needed

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Option 2: Manual Deployment (Drag & Drop)

1. **Build your project locally**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign up or log in
   - Drag and drop the `dist` folder from your project into the deployment area

### Option 3: Using Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build your project**

   ```bash
   npm run build
   ```

3. **Deploy using Netlify CLI**
   ```bash
   netlify deploy
   ```
   - Follow the prompts to authorize and configure your site
   - Set the publish directory to `dist`

## Post-Deployment Steps

After deployment:

1. Update your site name in Netlify settings if desired
2. Test your game on different devices
3. Share your game on Farcaster using the deployed URL

## Configuration Files

This project includes:

- `netlify.toml`: Configuration for Netlify deployment
- Updated `farcaster.json`: Points to your Netlify URL
- Updated `index.html`: Meta tags pointing to your Netlify URL

## Support

If you encounter any issues during deployment, check:

- Netlify documentation: [https://docs.netlify.com](https://docs.netlify.com)
- Make sure all asset paths are correct
- Verify that the build completes without errors
