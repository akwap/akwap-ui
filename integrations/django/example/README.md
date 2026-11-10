# AkwapUI + Django example

A small Django project that uses `akwapui-django`: a dashboard (stat cards, table, pagination, progress, dialog), a components page, a form rendered by `{{ form }}`, and a page of Vue islands.

```bash
cd integrations/django
python -m venv .venv && source .venv/bin/activate
pip install -e .
cd example
npm install
python manage.py akwapui_tailwind   # points Tailwind at the installed package
npm run css                         # or npm run css:watch
python manage.py runserver
```

Vue islands (optional): run `npm run build:lib` at the repo root, then `npm run islands` here.

Tests: `python manage.py test`.

See [docs/DJANGO.md](../../../docs/DJANGO.md) for the guide.
