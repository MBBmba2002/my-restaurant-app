#!/bin/bash

echo "🔍 Next.js Build Diagnosis Script"
echo "=================================="
echo ""

# Check Node version
echo "1. Node.js version:"
node --version
npm --version
echo ""

# Check if .env.local exists
echo "2. Environment files:"
if [ -f ".env.local" ]; then
  echo "✓ .env.local exists"
  if grep -q "NEXT_PUBLIC_SUPABASE" .env.local; then
    echo "✓ NEXT_PUBLIC_SUPABASE variables found"
  else
    echo "⚠️  NEXT_PUBLIC_SUPABASE variables not found in .env.local"
  fi
else
  echo "⚠️  .env.local not found (may need environment variables in GitHub Actions)"
fi
echo ""

# Check next.config.ts
echo "3. Next.js configuration:"
if [ -f "next.config.ts" ]; then
  echo "✓ next.config.ts exists"
  if grep -q "output:.*export" next.config.ts; then
    echo "✓ output: 'export' configured"
  else
    echo "❌ output: 'export' NOT found"
  fi
  if grep -q "basePath" next.config.ts; then
    echo "✓ basePath configured"
    grep "basePath" next.config.ts
  else
    echo "⚠️  basePath not configured"
  fi
else
  echo "❌ next.config.ts not found"
fi
echo ""

# Check source files
echo "4. Source files:"
if [ -f "src/app/login/page.tsx" ]; then
  echo "✓ src/app/login/page.tsx exists"
else
  echo "❌ src/app/login/page.tsx NOT found"
fi

if [ -f "src/lib/supabaseClient.ts" ]; then
  echo "✓ src/lib/supabaseClient.ts exists"
else
  echo "❌ src/lib/supabaseClient.ts NOT found"
fi
echo ""

# Clean and rebuild
echo "5. Cleaning previous builds..."
rm -rf .next out
echo "✓ Cleaned"
echo ""

echo "6. Running npm install..."
npm install
echo ""

echo "7. Running build (npm run export)..."
npm run export
BUILD_EXIT_CODE=$?
echo ""

if [ $BUILD_EXIT_CODE -eq 0 ]; then
  echo "✅ Build completed successfully"
  echo ""
  
  echo "8. Checking output directory:"
  if [ -d "out" ]; then
    echo "✓ out/ directory exists"
    echo ""
    
    echo "9. File structure:"
    find out -maxdepth 3 -type f -name "*.html" | sort
    echo ""
    
    echo "10. Verifying required files:"
    if [ -f "out/index.html" ]; then
      echo "✓ out/index.html exists"
    else
      echo "❌ out/index.html NOT FOUND"
    fi
    
    if [ -f "out/login/index.html" ]; then
      echo "✓ out/login/index.html exists"
      echo "  File size: $(du -h out/login/index.html | cut -f1)"
    else
      echo "❌ out/login/index.html NOT FOUND"
      echo "  Checking out/login/ directory:"
      if [ -d "out/login" ]; then
        ls -la out/login/
      else
        echo "  ❌ out/login/ directory does not exist"
        echo "  Available directories:"
        find out -type d -maxdepth 2 | head -10
      fi
    fi
  else
    echo "❌ out/ directory NOT FOUND after build"
    echo "Build may have failed or output path is different"
  fi
else
  echo "❌ Build failed with exit code: $BUILD_EXIT_CODE"
  echo "Check the error messages above"
fi

echo ""
echo "=================================="
echo "Diagnosis complete"





