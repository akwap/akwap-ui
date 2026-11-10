# akwapui-django

AkwapUI for Django: the design system's tokens, themes and Tailwind utilities, component template tags, an accessible form renderer, the theme switcher and the icon set, for server-rendered Django templates.

```bash
pip install "akwapui-django @ git+https://github.com/akwap/akwap-ui.git#subdirectory=integrations/django"
```

```python
INSTALLED_APPS = [..., "akwapui_django"]
FORM_RENDERER = "akwapui_django.forms.AkwapUIFormRenderer"  # optional
```

```django
{% load akwapui %}
{% ak_button "Save" variant="primary" type="submit" %}
{% ak_alert intent="success" title="Saved" %}Your changes are live.{% endak_alert %}
```

The full guide is in [docs/DJANGO.md](../../docs/DJANGO.md), and [example/](example) is a runnable project that uses everything.

## Layout

| Path | What it is |
| --- | --- |
| `src/akwapui_django/templatetags/akwapui.py` | The template tags |
| `src/akwapui_django/templates/akwapui/` | Component and form templates (override any of them) |
| `src/akwapui_django/forms.py` | `AkwapUIFormRenderer` |
| `src/akwapui_django/static/akwapui/` | `akwapui.js` (theme, dialogs, toasts) and the prebuilt `akwapui.css` |
| `src/akwapui_django/tailwind/` | Generated: CSS for apps that run Tailwind |
| `src/akwapui_django/icons.json` | Generated: the AkwapUI icon set as SVG |
| `styles/django-components.css` | Source of the `.ak-*` component classes |
| `scripts/build.mjs` | `npm run build:django` at the repo root regenerates the generated files |
