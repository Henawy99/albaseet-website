#!/bin/bash

# ALBASEET Admin Android App Build Script
# ========================================

echo "🏗️  Building ALBASEET Admin Android App..."
echo ""

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build the web app
echo -e "${YELLOW}Step 1: Building web application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Web build complete!${NC}"
echo ""

# Step 2: Sync with Android
echo -e "${YELLOW}Step 2: Syncing with Android...${NC}"
npx cap sync android

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Sync failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Android sync complete!${NC}"
echo ""

# Step 3: Build Android APK
echo -e "${YELLOW}Step 3: Building Android APK...${NC}"
cd android
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Android build failed!${NC}"
    exit 1
fi

# Copy APK to root
cp app/build/outputs/apk/debug/app-debug.apk ../albaseet-admin.apk

cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ BUILD COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "APK Location: ${YELLOW}albaseet-admin.apk${NC}"
echo ""
echo "To install on device:"
echo "  adb install albaseet-admin.apk"
echo ""
echo "Or transfer the APK to your Android device!"
