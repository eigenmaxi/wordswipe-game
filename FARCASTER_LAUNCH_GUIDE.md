# How to Launch WordSwipe on Farcaster

## Prerequisites

1. Ensure your game is deployed online and publicly accessible
2. Have a Farcaster account (Warpcast, Neynar, or other client)

## Steps to Launch on Farcaster

### 1. Deploy Your App

Your WordSwipe game needs to be deployed to a public URL. We've prepared it for deployment with:

- A `farcaster.json` manifest file in the project root
- Proper meta tags in `index.html` for embedding
- All necessary assets and configurations

### 2. Test Your Deployment

Before launching on Farcaster, ensure your deployment is working:

- Visit your deployed URL directly in a browser
- Verify all game functionality works as expected
- Check that mobile responsiveness is working

### 3. Create a Cast with Your App

Open your Farcaster client (like Warpcast) and:

1. Click the "+" or "Compose" button to create a new cast
2. Paste your app's URL in the cast content
3. The Farcaster client should automatically detect it as a Mini App and show a preview
4. Add any text you want to include with your app
5. Post the cast

### 4. Farcaster Mini App Manifest

Your project includes a `farcaster.json` file with the following structure:

```json
{
  "name": "WordSwipe",
  "icon": "/src/assets/logo.svg",
  "description": "Swipe letters to form words! Find as many words as you can in this fun word puzzle game.",
  "url": "YOUR_DEPLOYED_URL_HERE",
  "prompts": [
    {
      "title": "Play WordSwipe!",
      "description": "Test your vocabulary skills by forming words from letters."
    }
  ],
  "frames": [
    {
      "label": "Play Game",
      "url": "YOUR_DEPLOYED_URL_HERE"
    }
  ]
}
```

### 5. Meta Tags for Embedding

Your `index.html` includes proper meta tags for Farcaster embedding:

- `fc:miniapp` meta tag for Mini App detection
- Open Graph tags for rich previews
- Twitter cards for social sharing

## Troubleshooting

### If Your App Doesn't Show as a Preview:

1. Ensure your URL is publicly accessible (not localhost)
2. Check that your site loads without authentication
3. Verify the meta tags are correctly implemented
4. Make sure your site is not blocked by CORS policies

### If Players Report Issues:

1. Test on different devices and browsers
2. Verify all game functionality works in the embedded version
3. Check that touch/swipe controls work properly on mobile

## Best Practices

1. **Clear Call-to-Action**: Include text in your cast that encourages users to play
2. **Mobile First**: Ensure your game works great on mobile as most Farcaster users are mobile-first
3. **Fast Loading**: Optimize your game to load quickly
4. **Self-Explanatory**: Make your game intuitive to play without extensive instructions
5. **Engaging**: Create a compelling reason for users to engage with your game

## Example Cast

"Check out my new word puzzle game! Swipe letters to form words and test your vocabulary skills. How many words can you find? 🧠✨

[YOUR_DEPLOYED_URL_HERE]"

## Need Help?

If you encounter issues with deployment or Farcaster integration:

1. Check the Vercel deployment logs
2. Verify your farcaster.json manifest is valid
3. Test your URL in different browsers
4. Reach out to Farcaster developer communities for support
