Lumi — static eSIM store
========================

Files (keep this layout):

  index.html
  styles.css
  script.js
  favicon.svg
  images/earth-night.webp

Prices and copy: edit PACKAGES in script.js.
Payment: worker URL and pack ids (1–4) are in script.js.


Host on GitHub Pages
--------------------

1. Unzip this archive. You should see index.html (not a nested extra folder).

2. On GitHub: New repository → name it e.g. lumi
   (Public, no README if you want a clean root.)

3. Open the repo → Add file → Upload files
   Drop in:
     index.html  styles.css  script.js  favicon.svg  images/
   Commit.

4. Repo → Settings → Pages
   Source: Deploy from a branch
   Branch: main   Folder: / (root)
   Save.

5. Wait 1–2 minutes. The site is:

   https://YOUR_USERNAME.github.io/lumi/

If you named the repo YOUR_USERNAME.github.io, the site is:

   https://YOUR_USERNAME.github.io/


Custom domain (optional)
------------------------
Settings → Pages → Custom domain → enter www.yourdomain.com
Then at your registrar, CNAME www → YOUR_USERNAME.github.io
Turn on Enforce HTTPS when GitHub says the certificate is ready.


If the page is 404
------------------
index.html must be in the repo root, not inside a lumi-html folder.
