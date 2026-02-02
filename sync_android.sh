#!/bin/bash

# Quick sync script for Android development
# Usage: ./sync_android.sh

echo "🔄 Quick syncing Android app..."

npm run build && npx cap sync android

echo "✅ Sync complete! Open in Android Studio:"
echo "   npx cap open android"
