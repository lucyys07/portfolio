# Lucy Hwang — Portfolio

Static site (plain HTML / CSS / JS, no build step). Deploys to Vercel as-is.

```
index.html   page content
styles.css   all styling (colors at the top in :root)
script.js    hearts, tabs, search, dark mode, now-playing bar
assets/      photos go here
```

## Run locally

```bash
python3 -m http.server 5181
```

Then open http://localhost:5181

## Add photos

Every photo slot loads a file from `assets/`. Drop an image with the matching name in and it shows up; until then a soft placeholder with the filename is shown.

| File | Where it appears |
| --- | --- |
| `avatar.jpg` | portrait next to Lucy's name (portrait 4:5) |
| `project-web-1.jpg` | AL College Guide screenshot (already added) |
| `project-web-2.jpg` | Events in Alabama screenshot (already added) |
| `artwork.jpg` | cover image for the Artwork card |
| `books.jpg` | @archivedbooks_ profile icon (already added) |
| `resume.pdf` | linked from the "Download résumé" button |

## Accent color

One variable: `--accent` at the top of `styles.css` (dark-mode value right below it).

## Still to fill in

Search `TODO` and `data-todo` in `index.html`:
- "View gallery" link on the Artwork card

## Deploy (new GitHub account + Vercel)

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<lucy-account>/<repo>.git
git push -u origin main
```

On vercel.com (logged in as Lucy): **Add New → Project → Import** the repo. Framework preset: **Other**. No build command, output directory = root. Deploy.
