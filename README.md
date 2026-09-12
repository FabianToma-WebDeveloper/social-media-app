# Nexora — Social Media App

**Nexora** este o aplicație web de tip social media, dezvoltată cu React și Vite.

Proiectul include autentificare, feed de postări, profiluri de utilizator, gestionarea prietenilor, reels, setări personalizabile, dark mode și o interfață responsive pentru desktop, tabletă și mobil.

Proiect dezvoltat de **Fabian Toma**.

## Funcționalități

### Autentificare

- Creare cont și autentificare
- Logout
- Gestionarea autentificării cu Redux Toolkit
- Persistența sesiunii cu Redux Persist
- Rute protejate pentru utilizatorii autentificați
- Redirecționare automată către pagina de autentificare atunci când un utilizator neautentificat încearcă să acceseze o pagină protejată

### Feed

- Crearea postărilor text
- Adăugarea imaginilor în postări
- Like / Unlike
- Comentarii
- Funcționalitate Share
- Persistența locală a postărilor create
- Încărcarea postărilor din API prin `feedService`

### Prieteni

- Listă de prieteni
- Cereri de prietenie
- Acceptarea și respingerea cererilor
- Sugestii de prieteni
- Adăugarea și eliminarea prietenilor
- Căutarea persoanelor
- Sincronizarea prietenilor între pagina Home și pagina Friends
- Persistența datelor prin localStorage

### Profil

- Pagină dedicată profilului
- Editarea informațiilor personale
- Imagine de profil
- Postările utilizatorului
- Statistici și informații despre profil
- Cont privat
- Posibilitatea de a afișa sau ascunde adresa de email

### Reels

- Pagină dedicată pentru Reels
- Carduri responsive
- Interfață inspirată din aplicațiile moderne de social media
- Suport pentru Dark Mode

### Setări

- Dark Mode
- Private Account
- Afișare / ascundere email
- Salvarea setărilor în localStorage
- Păstrarea modului Dark după refresh

### Navigare și Responsive Design

- Navigare desktop
- Navigare dedicată pentru dispozitive mobile
- Evidențierea paginii active
- Buton rapid pentru crearea unei postări pe mobil
- Interfață adaptată pentru desktop, tabletă și telefon

## Tehnologii utilizate

- React 19
- Vite
- React Router DOM
- Redux Toolkit
- Redux Persist
- Material UI
- Axios
- Sass / SCSS Modules
- JSON Server
- JSON Server Auth
- LocalStorage

## Rute

| Rută | Descriere | Acces |
| --- | --- | --- |
| `/` | Feed principal | Public |
| `/auth` | Login / Creare cont | Public |
| `/friends` | Gestionarea prietenilor | Protejat |
| `/reels` | Reels | Protejat |
| `/profile/:id` | Profil utilizator | Protejat |
| `/settings` | Setările aplicației | Protejat |
| `*` | Pagina Not Found | Public |

## Rulare locală

Instalează dependințele:

```bash
npm install
```

Pornește aplicația:

```bash
npm run dev
```

Vite va genera adresa locală a aplicației, de regulă:

```text
http://localhost:5173
```

## Backend / API

În mediul local, Nexora folosește **JSON Server** și **JSON Server Auth**.

API-ul rulează pe:

```text
http://localhost:3000
```

Backend-ul gestionează autentificarea, înregistrarea utilizatorilor și datele API utilizate de aplicație.

Pentru funcționalitățile care depind de API, backend-ul trebuie pornit separat.

```bash
npm run start:auth
```

## Build pentru producție

Pentru generarea versiunii de producție:

```bash
npm run build
```

Pentru testarea locală a versiunii de producție:

```bash
npm run preview
```

## Persistența datelor

Aplicația utilizează mai multe metode pentru păstrarea datelor:

- Redux Persist pentru starea autentificării
- LocalStorage pentru profil și setări
- LocalStorage pentru postările create local
- LocalStorage pentru gestionarea și sincronizarea prietenilor
- JSON Server pentru autentificare și datele furnizate prin API

## Live Demo


Aplicația este pregătită pentru rulare în mediul de producție.

Versiunea Live Demo oferă acces la funcționalitățile principale ale aplicației Nexora, inclusiv autentificare, feed, profil, gestionarea prietenilor, Reels, setări, Dark Mode și interfața responsive.

## Autor

**Fabian Toma**

Proiect dezvoltat pentru portofoliul personal, cu accent pe construirea unei experiențe moderne de social media folosind React și tehnologii frontend actuale.