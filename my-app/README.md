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
