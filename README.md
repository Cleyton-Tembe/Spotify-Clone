# Spotify Clone

Clone do Spotify com front-end em React e uma API em Express para músicas, álbuns e administração.

> **Âmbito do projecto:** este é um projecto de estudo. Fi-lo para me familiarizar com React, TypeScript, Express, MongoDB e autenticação com Clerk, e para pôr em prática a ligação entre um front-end e uma API própria. Não é um produto final.

## Demo

🔗 **[Ver demo](COLOCA_AQUI_O_LINK_DA_DEMO)**

## Funcionalidades

**Front-end**

- Login com conta Google (Clerk OAuth)
- Sincronização do utilizador com a base de dados no primeiro login
- Página inicial com barra de navegação e botão de perfil

**API (back-end)**

- Músicas em destaque, "Feito para ti" e "Em alta" (selecção aleatória com agregações do MongoDB)
- Lista de álbuns e detalhe de cada álbum com as suas músicas
- Área de administração: criar e apagar músicas e álbuns, com upload do áudio e da capa para o Cloudinary
- Estatísticas para o administrador: total de músicas, álbuns, utilizadores e artistas
- Lista de utilizadores e histórico de mensagens entre utilizadores
- Rotas protegidas: só utilizadores autenticados acedem; só o email definido como administrador acede à área de administração

> **Em desenvolvimento:** responsividade.

## Tecnologias

| Front-end                  | Back-end                         |
| -------------------------- | -------------------------------- |
| React 18 + TypeScript      | Node.js + Express 5 (TypeScript) |
| Vite                       | MongoDB + Mongoose               |
| Tailwind CSS 4 + shadcn/ui | Clerk (`@clerk/express`)         |
| React Router               | Cloudinary (áudio e imagens)     |
| Clerk (`@clerk/react`)     | express-fileupload               |
| Axios                      |                                  |

## Estrutura

```
Spotify-Clone/
├── frontend/   # aplicação React (Vite) — porta 5173
└── backend/    # API Express — porta 4000
```

## Como correr localmente

### Pré-requisitos

- **Node.js 22.18 ou superior**: o back-end corre os ficheiros `.ts` directamente com o Node.
- Uma base de dados **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- Uma conta **[Clerk](https://clerk.com)** com o login Google activo
- Uma conta **[Cloudinary](https://cloudinary.com)**

### 1. Clonar o repositório

```bash
git clone https://github.com/Cleyton-Tembe/Spotify-Clone.git
cd Spotify-Clone
```

### 2. Variáveis de ambiente

Cria `backend/.env`:

```env
PORT=4000
MONGO_URL=mongodb+srv://<utilizador>:<password>@<cluster>/<base-de-dados>
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAIL=o-teu-email@exemplo.com   # este email passa a ser o administrador
```

Cria `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 3. Arrancar o back-end

```bash
cd backend
npm install
npm run serve
```

A API fica em `http://localhost:4000`.

### 4. Arrancar o front-end

Noutro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Autor

**Cleyton Tembe** — [GitHub](https://github.com/Cleyton-Tembe)
