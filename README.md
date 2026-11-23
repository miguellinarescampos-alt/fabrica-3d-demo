# Planta 03 · Fábrica 3D

Prototipo estático en español para explorar **tres máquinas y nueve fallos simulados**. Usa HTML, CSS, JavaScript y Three.js 0.170.0 desde jsDelivr. Sin framework, instalación de dependencias, compilación, modelos ni imágenes externas.

## Abrir en local

Necesitas Internet para cargar Three.js y un navegador moderno con **WebGL 2**, aceleración gráfica e import maps (Chrome, Edge, Firefox o Safari actualizados).

Desde esta carpeta, inicia un servidor HTTP:

```powershell
cd C:\Users\migue\Downloads\fabrica-3d-demo
py -m http.server 8000
```

Abre <http://localhost:8000>. Si no tienes el lanzador `py`, prueba `python -m http.server 8000` (requiere Python 3). Detén el servidor con `Ctrl+C`. No abras `index.html` mediante `file://`.

## Uso

- **Seleccionar máquina:** pulsa su geometría 3D, su etiqueta o su tarjeta del panel.
- **Seleccionar fallo:** pulsa una incidencia del panel; se muestran explicación y revisión orientativa. Su componente se vuelve ámbar, aparece un contorno y una etiqueta.
- **Quitar resaltado:** restablece el material del componente. Cambiar de máquina también limpia el fallo.
- **Rotar:** arrastra con el botón izquierdo o con un dedo.
- **Zoom:** rueda, pellizco con dos dedos o botón central.
- **Desplazar:** botón derecho y arrastrar, o dos dedos. Con el lienzo enfocado, también puedes usar las flechas.
- **Vista general:** recupera la cámara que encuadra la fábrica. El panel es navegable con `Tab`, `Enter` y `Espacio`.

En móvil, el panel aparece debajo del visor. Los ejemplos **no son mediciones, alarmas reales ni diagnósticos**. Cualquier revisión de maquinaria real requiere procedimientos de seguridad y personal cualificado.

## Publicar gratis en GitHub Pages

1. Crea un repositorio **público** en GitHub y sube `index.html`, `style.css`, `app.js` y `README.md` a la raíz de la rama `main`.
2. Ve a **Settings → Pages → Build and deployment**.
3. En **Source**, selecciona **Deploy from a branch**; elige `main` y `/ (root)`, y guarda.
4. Espera el despliegue y abre la dirección que indique GitHub: `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

Las rutas son relativas y funcionan en un subdirectorio de GitHub Pages. No se necesitan claves, servicios de pago ni procesos de build. El CDN debe estar accesible: esta demo no funciona completamente sin conexión.

## Archivos

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura accesible, panel y mapa de importaciones CDN. |
| `style.css` | Diseño responsive, estados de selección y etiquetas. |
| `app.js` | Datos ficticios, geometrías, selección por raycasting, resaltado y OrbitControls. |
| `README.md` | Instrucciones de uso y publicación. |

Comprobación rápida de sintaxis con Node.js instalado: `node --check app.js`. Para comprobar el renderizado, sirve la carpeta por HTTP y prueba las tres máquinas, sus nueve fallos y el botón de vista general.
