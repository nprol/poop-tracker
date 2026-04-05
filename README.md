# 💩 PoopTracker — React Native (Expo)

> ¡La app más divertida para llevar el control de tus visitas al trono!

## ✨ Características

- **🔘 Botón gigante animado de 💩** con glow, anillos giratorios y bounce
- **🎊 Confeti y partículas flotantes** con cada tap
- **📊 Gráfico semanal** de barras animado
- **📅 Calendario histórico** tipo heatmap con navegación por meses
- **🏆 Logros divertidos** — "Hat trick fecal", "Dios del retrete"...
- **🔥 Rachas y estadísticas** — racha actual, media semanal, total histórico
- **📋 Timeline del día** — registro de cada visita con hora exacta
- **📳 Vibración háptica** satisfactoria
- **💾 Persistencia local** con AsyncStorage
- **📱 Compatible con Android e iOS**

## 🚀 Instalación

### Requisitos previos
- Node.js >= 18
- npm o yarn
- App **Expo Go** instalada en tu iPhone o Android

### Pasos

```bash
# 1. Entra en la carpeta del proyecto
cd poop-tracker

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npx expo start
```

### Probar en tu teléfono

1. Abre la app **Expo Go** en tu iPhone/Android
2. Escanea el código QR que aparece en la terminal
3. ¡Listo! La app se carga directamente en tu teléfono

### Probar en emulador

```bash
# Android
npx expo start --android

# iOS (solo en macOS)
npx expo start --ios
```

## 📁 Estructura del proyecto

```
poop-tracker/
├── App.tsx                          # Entrada principal
├── app.json                         # Configuración de Expo
├── package.json                     # Dependencias
├── babel.config.js                  # Babel + Reanimated plugin
├── tsconfig.json                    # TypeScript config
└── src/
    ├── context/
    │   └── PooContext.tsx            # Estado global + persistencia
    ├── screens/
    │   ├── HomeScreen.tsx            # Pantalla principal
    │   └── HistoryScreen.tsx         # Calendario histórico
    ├── components/
    │   ├── PooButton.tsx             # Botón animado principal
    │   ├── Confetti.tsx              # Partículas y confeti
    │   ├── StatsRow.tsx              # Tarjetas de estadísticas
    │   ├── TodayTimeline.tsx         # Timeline con horas
    │   └── WeeklyChart.tsx           # Gráfico de barras semanal
    └── utils/
        └── theme.ts                  # Colores y sombras
```

## 🎨 Tech Stack

| Tecnología | Uso |
|------------|-----|
| Expo SDK 54 | Framework base |
| React Native Reanimated | Animaciones fluidas a 60fps |
| AsyncStorage | Persistencia local |
| Fredoka Font | Tipografía divertida |
| Expo Haptics | Vibración táctil |
| TypeScript | Tipado estático |

## 📄 Licencia

MIT
