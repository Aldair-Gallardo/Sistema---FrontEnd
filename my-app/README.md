# TECA — Frontend

Frontend de TECA construido con [Next.js](https://nextjs.org) (App Router), [Ant Design](https://ant.design) y [Tailwind CSS](https://tailwindcss.com). Este repositorio es solo el frontend: necesita el backend (`teca-backend`, FastAPI) corriendo aparte para que el login y las demás llamadas a la API funcionen.

## Stack

- **Next.js 16** (React 19, App Router)
- **TypeScript**
- **Ant Design** para componentes de UI
- **Tailwind CSS 4** para estilos utilitarios
- **npm** como gestor de paquetes (hay `package-lock.json`, no usar `yarn`/`pnpm` para no generar lockfiles duplicados)

## Requisitos previos

| Herramienta | Versión mínima | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org) | `>= 20.9` (recomendado 20 LTS o 22 LTS) | Correr Next.js |
| npm | viene con Node | Instalar dependencias y correr scripts |
| [Git](https://git-scm.com) | cualquiera reciente | Clonar el repo |
| `teca-backend` | — | La API que consume este frontend (login, productos, pedidos, etc.). Debe estar corriendo antes de probar cualquier pantalla que necesite datos. |

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/Aldair-Gallardo/Sistema---FrontEnd.git
cd Sistema---FrontEnd/my-app
```

> El proyecto de Next.js vive dentro de la carpeta `my-app`, no en la raíz del repo. Todos los comandos de acá en adelante (`npm install`, `npm run dev`, etc.) se corren **desde `my-app`**.

---

## 2. Instalar Node.js y Git

### Windows

1. Descargá e instalá **Git**: https://git-scm.com/download/win (dejá las opciones por defecto).
2. Descargá e instalá **Node.js 20 LTS o 22 LTS**: https://nodejs.org (el instalador `.msi`, versión "LTS").
   - Alternativa recomendada si vas a manejar varias versiones de Node: [nvm-windows](https://github.com/coreybutler/nvm-windows).
     ```powershell
     nvm install 22
     nvm use 22
     ```
3. Verificá las versiones instaladas (abrí una terminal nueva — PowerShell o Git Bash — para que tome el PATH actualizado):
   ```powershell
   node -v
   npm -v
   git --version
   ```

### Linux (Ubuntu/Debian, Fedora, Arch, etc.)

La forma más prolija de instalar Node en Linux es con **nvm** (evita problemas de permisos con `apt`/`dnf` y te deja cambiar de versión fácil):

```bash
# Git (si no lo tenés ya)
sudo apt update && sudo apt install -y git      # Ubuntu/Debian
# sudo dnf install -y git                       # Fedora
# sudo pacman -S git                             # Arch

# nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Cerrá y volvé a abrir la terminal, o cargá nvm en la sesión actual:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar y usar Node 22 LTS
nvm install 22
nvm use 22

# Verificar
node -v
npm -v
git --version
```

---

## 3. Instalar las dependencias del proyecto

Parado dentro de `Sistema---FrontEnd/my-app` (mismo comando en Windows y Linux):

```bash
npm ci
```

`npm ci` instala exactamente lo que dice `package-lock.json` (más rápido y reproducible que `npm install`, ideal para clonar el repo por primera vez). Si más adelante alguien agrega una dependencia nueva y necesitás actualizar tu `node_modules`, ahí sí corré `npm install`.

---

## 4. Configurar las variables de entorno (`.env.local`)

El frontend necesita saber a qué URL está el backend. Esa URL vive en un archivo `.env.local` que **no se sube a git** (cada quien puede tener el backend en un puerto o host distinto), por eso hay que crearlo a mano después de clonar.

En el repo ya existe una plantilla, `.env.example`. Copiala a `.env.local`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**Windows (Git Bash) / Linux:**
```bash
cp .env.example .env.local
```

Abrí `.env.local` y confirmá/ajustá el valor:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- Si corrés `teca-backend` localmente con la configuración por defecto, `http://localhost:8000` ya es correcto — no hace falta tocar nada más.
- Si tu backend corre en otro puerto o hay que apuntar a un servidor remoto, cambiá el valor por esa URL (sin `/` al final).

> ⚠️ Si te saltás este paso, la app va a levantar igual, pero **el login y cualquier llamada a la API van a fallar** con un error de "no se pudo conectar con el servidor" o similar.

---

## 5. Levantar el proyecto

Con el backend (`teca-backend`) ya corriendo en otra terminal:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador. La página se recarga sola al guardar cambios en el código.

---

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (con hot reload) en `http://localhost:3000` |
| `npm run build` | Compila la app para producción |
| `npm run start` | Sirve el build de producción (requiere correr `build` antes) |
| `npm run lint` | Corre ESLint sobre el proyecto |

---

## Si `npm run dev` congela la PC o va muy lento

Next.js 16 usa **Turbopack** por defecto para `next dev` (antes había que activarlo a mano). En Windows, Turbopack puede volverse muy pesado — sobre todo si el antivirus escanea cada archivo que genera, o si la laptop tiene poca RAM libre — al punto de congelar la PC entera y obligar a reiniciar.

Ya cambiamos el script `dev` del `package.json` para usar Webpack en vez de Turbopack, así que si clonaste el repo después de este cambio no deberías tener el problema. Si a alguien le sigue pasando (o clonó antes del cambio), seguir estos pasos en orden dentro de `Sistema---FrontEnd/my-app`:

1. **Traer el cambio y limpiar la caché de compilación**
   ```bash
   git pull
   ```
   Windows (PowerShell): `Remove-Item -Recurse -Force .next`
   Git Bash / Linux: `rm -rf .next`

2. **Reinstalar los paquetes de forma exacta** (esto también arregla el problema de tener `node_modules` desincronizado con el `package-lock.json` del equipo)
   Windows (PowerShell): `Remove-Item -Recurse -Force node_modules`
   Git Bash / Linux: `rm -rf node_modules`
   ```bash
   npm ci
   ```
   `npm ci` falla con un error claro si tu `package.json` local no coincide con el lockfile del repo, en vez de instalar algo distinto en silencio — si a alguien le tira error acá, es señal de que ese era justo su problema.

3. **Revisar la versión de Node** (tiene que ser `>= 20.9`, ver [Requisitos previos](#requisitos-previos))
   ```bash
   node -v
   ```

4. **Revisar cuánta RAM libre tiene la máquina** al momento de arrancar (PowerShell):
   ```powershell
   Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory | ForEach-Object { "Total: {0:N2} GB, Libre: {1:N2} GB" -f ($_.TotalVisibleMemorySize/1MB), ($_.FreePhysicalMemory/1MB) }
   ```
   Si hay menos de ~4GB libres, cerrá programas pesados (Chrome con muchas pestañas, etc.) antes de levantar el proyecto.

5. **Excluir la carpeta del proyecto en Windows Defender** — abrí PowerShell **como Administrador** y corré (ajustando la ruta a donde tengas el proyecto vos):
   ```powershell
   Add-MpPreference -ExclusionPath "C:\ruta\a\tu\Sistema---FrontEnd\my-app"
   ```

6. **Levantar el proyecto**
   ```bash
   npm run dev
   ```
   En la consola debe aparecer `▲ Next.js 16.2.6 (webpack)` — si en vez de eso ves algo con "Turbopack", el script no se actualizó bien (repetí el paso 1).

---

## Solución de problemas comunes

- **"No se pudo conectar con el servidor" / errores raros al iniciar sesión**
  Revisá que `teca-backend` esté corriendo y que `NEXT_PUBLIC_API_URL` en tu `.env.local` apunte a la URL correcta (paso 4). Si cambiaste `.env.local` con el server ya corriendo, reiniciá `npm run dev` — Next.js no relee las variables de entorno en caliente.

- **`'next' is not recognized` / `command not found`**
  Te faltó correr `npm ci` (paso 3), o lo corriste en la carpeta equivocada. Verificá que estés parado en `Sistema---FrontEnd/my-app` (tiene que existir un `package.json` ahí).

- **Error de versión de Node al instalar o correr el proyecto**
  Este proyecto necesita Node `>= 20.9`. Corré `node -v` para chequear tu versión; si es menor, actualizá con nvm (`nvm install 22 && nvm use 22`).

- **El puerto 3000 ya está en uso**
  Cerrá el proceso que lo esté usando, o corré `npm run dev -- -p 3001` para levantar en otro puerto.

- **Windows: `npm ci` o `npm run dev` fallan por permisos/PATH**
  Abrí una terminal nueva después de instalar Node/Git para que tome el PATH actualizado, y evitá correr la terminal como administrador salvo que sea necesario.

- **La PC se congela o va muy lenta al correr `npm run dev`**
  Ver la sección [Si `npm run dev` congela la PC o va muy lento](#si-npm-run-dev-congela-la-pc-o-va-muy-lento) más arriba.
