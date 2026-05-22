# Lufuel Digal — Online Portfolio

Static portfolio site matching the dark creative template, built with HTML, CSS, and JavaScript.

## Preview locally

**Option 1 — Open file**

Double-click `index.html` in this folder (works in Chrome, Edge, Firefox).

**Option 2 — Local server (recommended)**

```powershell
cd "d:\School Files\Permanent Files\Formal Images\portfolio"
python -m http.server 8080
```

Then open: http://localhost:8080

## Project structure

```
portfolio/
├── index.html      # All 12 sections
├── css/style.css   # Template styling
├── js/main.js      # Navigation & keyboard
├── images/         # profile-1.png, profile-2.png, profile-3.png (transparent)
└── README.md
```

## Images

| Section | Image type |
|---------|------------|
| Hero, About, Introduction, Contact | Transparent profile photos (`images/profile-*.png`) |
| Projects, Experience, Skills | Repository previews (`images/projects/*.svg`) |

Replace SVG previews with real app screenshots when you have them (save as JPG/PNG in `images/projects/` and update paths in `index.html`).

**Profile photos:** Drop updated transparent PNGs into `images/` as `profile-1.png` (hero/contact), `profile-2.png` (about), `profile-3.png` (introduction). Source files: `image no bg.PNG`, `image no bg 1.PNG`, `image no bg 3.png`.

**Repositories featured:** Library-Management-System, Screen-Time-Monitoring-Operating-System, Screen-Monitor, Numerical-Methods, Websites (+ profile config on GitHub).

## Customize

Edit `index.html` to update:

- Education (university name, dates)
- Work experience (add jobs/internships)
- Project descriptions and links
- Contact email (add to contact section if desired)

## Publish later (GitHub Pages)

When ready, create a repo (e.g. `portfolio`), push this folder, enable Pages on the `main` branch.
