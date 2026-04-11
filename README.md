# AgroMonitor — El Aleph

Herramienta de monitoreo satelital agrícola con NDVI Sentinel-2 real.

## Estructura
```
agromonitor/
├── index.html                  ← App principal
├── netlify.toml                ← Config Netlify + CORS
├── netlify/
│   └── functions/
│       └── token.js            ← Proxy OAuth Sentinel Hub
└── README.md
```

## Deploy en Netlify
1. Subir estos 4 archivos al repo GitHub `lucasgabrielenrico-ctrl/agromonitor`
2. En Netlify → Sites → Add new site → Import from GitHub
3. Build command: (vacío)
4. Publish directory: `.`
5. Deploy site

## Agregar lotes KMZ
Botón `+ KMZ` en la toolbar → seleccionar archivos `.kmz` o `.kml`
Los lotes se agregan automáticamente agrupados por nombre de archivo (= cliente).
