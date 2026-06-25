# Will It Fit?

React Native (Expo) app that analyzes room photos and guides you through packing boxes into a rental truck.

## Features

- **Multi-photo capture** — photograph items room by room
- **OpenAI Vision analysis** — bubble wrap list, box count/sizes, truck recommendation
- **Summary dashboard** — shopping-list view of supplies and truck size
- **3D packing tutorial** — step-by-step Three.js guide with OpenGL rendering

## Quick Start

```bash
npm install
npm start
```

Scan the QR code with **Expo Go** on a physical device, or run:

```bash
npm run ios
npm run android
```

## Demo Mode (No API Key)

The app ships with `USE_MOCK = true` in `constants/config.ts`. Tap **Run Demo (Mock Data)** on the home screen to test the full flow without photos or an OpenAI key.

## OpenAI Setup

1. Copy `.env.example` to `.env`
2. Add your key: `EXPO_PUBLIC_OPENAI_API_KEY=sk-...`
3. Set `USE_MOCK = false` in `constants/config.ts`
4. Restart the dev server

## Important Notes

- **Test 3D on a physical device.** iOS Simulator often shows a blank OpenGL canvas.
- **API keys in `EXPO_PUBLIC_*` are bundled in the app.** Use a backend proxy for production.
- All box/truck dimensions are in **feet**.

## Tech Stack

- Expo SDK 56 / React Native 0.85
- Expo Router, expo-camera, expo-gl
- Three.js + @react-three/fiber (native) + r3f-native-orbitcontrols

## Project Structure

```
app/              Screens (camera, summary, packing)
components/       Camera, summary, and 3D packing UI
context/          Analysis state provider
services/         OpenAI Vision + mock analysis
types/            Shared JSON types
```
