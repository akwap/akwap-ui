# Using AkwapUI with Django

AkwapUI's components are Vue, but the design system underneath them (tokens, themes, Tailwind utilities) is plain CSS. The Django integration gives you that same look in server-rendered templates, without a JavaScript framework:

- **`akwapui-django`**, a Django app in [`integrations/django`](../integrations/django) with:
  - template tags for the common components (`{% ak_button %}`, `{% ak_card %}`, `{% ak_alert %}`, `{% ak_pagination %}`…)
  - a form renderer, so `{{ form }}` renders AkwapUI fields with labels, help text, errors and ARIA wiring
  - `.ak-*` component classes you can also write by hand (`<button class="ak-btn ak-btn-primary">`)
  - the theme switcher (light, dark, high contrast, system) and brand colour, sharing their saved settings with the Vue library
  - the AkwapUI icon set as inline SVG (`{% ak_icon "delete" %}`)
- **Optional Vue islands** for the few widgets that need real interactivity (charts, data tables, date pickers), mounted into Django pages with `{% ak_island %}`.
- **An example project** in [`integrations/django/example`](../integrations/django/example) that uses all of it.

## Which setup to pick

| | Tailwind build (recommended) | No Node (prebuilt CSS) |
| --- | --- | --- |
| What you run | Tailwind CLI next to Django | Nothing |
| Component tags and `.ak-*` classes | Yes | Yes |
| Every Tailwind utility (`bg-surface`, `grid-cols-3`, `md:flex`…) in your templates | Yes | A small layout set only |
| Your own custom CSS | Tailwind or `var(--ak-…)` | `var(--ak-…)` |

Start with the prebuilt CSS if you want to try it in five minutes. Move to the Tailwind build when you start writing your own layouts.

## 1. Install the app

The package is not on PyPI yet. Install it from this repository:

```bash
pip install "akwapui-django @ git+https://github.com/akwap/akwap-ui.git#subdirectory=integrations/django"
# or, from a clone:
pip install -e path/to/akwap-ui/integrations/django
```

It needs Django 4.2 or newer and has no other dependencies.

```python
# settings.py
INSTALLED_APPS = [
    # …
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "akwapui_django",
]

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {
        "context_processors": [
            "django.template.context_processors.request",   # active nav items, pagination links
            "django.contrib.messages.context_processors.messages",
        ],
        # Optional: use the tags everywhere without {% load akwapui %}
        "builtins": ["akwapui_django.templatetags.akwapui"],
    },
}]

# Optional: {{ form }} renders AkwapUI fields
FORM_RENDERER = "akwapui_django.forms.AkwapUIFormRenderer"
```

## 2. Add the CSS

### Option A: Tailwind build (recommended)

Tailwind v4 scans your templates and generates only the classes you use. It runs as a small CLI next to Django; you can use the npm package or the [standalone binary](https://tailwindcss.com/blog/standalone-cli) if you do not want Node in the project.

```bash
npm install -D tailwindcss @tailwindcss/cli
python manage.py akwapui_tailwind          # writes assets/css/akwapui.css
```

`akwapui_tailwind` writes a small file that imports AkwapUI's tokens, themes, utilities and component classes from wherever the package is installed, and tells Tailwind to scan the package's templates. The paths depend on the machine, so run it after every install (and in your Docker build or CI) and keep it out of git.

Create your Tailwind entry file:

```css
/* assets/css/app.css */
@import 'tailwindcss';
@import './akwapui.css';

@source '../../templates';      /* your templates */
@source '../../myapp';          /* Python files that build class names */
```

Build it into a static folder Django serves:

```bash
npx tailwindcss -i assets/css/app.css -o static/css/app.css --watch    # development
npx tailwindcss -i assets/css/app.css -o static/css/app.css --minify   # production, before collectstatic
```

```python
STATICFILES_DIRS = [BASE_DIR / "static"]
```

> If you already use **django-tailwind** or **django-tailwind-cli**, keep it and add the two AkwapUI lines (`@import './akwapui.css'` after Tailwind, plus `python manage.py akwapui_tailwind -o <that folder>/akwapui.css`) to the CSS file it manages.

### Option B: prebuilt CSS (no Node)

The package ships `akwapui/akwapui.css`, built with every component class plus a small set of layout utilities (`flex`, `grid`, `grid-cols-*`, `gap-*`, `p-*`, `m-*`, the type ramp and the colour roles). Ask `ak_head` to link it:

```django
{% ak_head css="prebuilt" %}
```

For anything else, write normal CSS with the tokens: `color: var(--ak-color-text-secondary); border-radius: var(--ak-radius-card);`. The full list is in the [theme guide](THEME_GUIDE.md).

## 3. Base template

```django
{% load static akwapui %}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% block title %}My app{% endblock %}</title>
  {% ak_head %}  {# applies the saved theme before first paint: no flash #}
  <link rel="stylesheet" href="{% static 'css/app.css' %}">
</head>
<body class="min-h-screen bg-background font-sans text-primary antialiased">
  <header class="flex items-center gap-3 border-b border-line-subtle bg-surface px-4 py-2">
    <span class="text-subtitle-2">My app</span>
    <div class="ml-auto">{% ak_theme_switcher labels=False %}</div>
  </header>
  <main class="mx-auto max-w-6xl p-6">
    {% ak_messages toast=True %}
    {% block content %}{% endblock %}
  </main>
  {% ak_scripts %}  {# theme switcher, dismissible alerts, dialogs, toasts (6 KB, no dependencies) #}
</body>
</html>
```

Under a strict Content Security Policy pass a nonce: `{% ak_head nonce=request.csp_nonce %}` and `{% ak_scripts nonce=request.csp_nonce %}`.

## 4. Components

Keyword arguments a tag does not know become HTML attributes on the component (`aria_label` becomes `aria-label`, `hx_post` becomes `hx-post`), so ids, `name`/`value`, `data-*` and htmx attributes always work.

### Buttons

```django
{% ak_button "Save" variant="primary" type="submit" %}
{% ak_button "Delete" variant="danger" icon="delete" name="action" value="delete" %}
{% ak_button "Docs" href="/docs/" variant="outline" icon_end="externalLink" %}
{% ak_button "Settings" icon="settings" icon_only=True %}
{% ak_button "Saving" variant="primary" loading=True loading_text="Saving…" %}
```

`variant`: primary, secondary (default), outline, subtle, transparent, danger, link. `size`: sm, md, lg. Also `disabled`, `block`, `pressed`. With `href` the button is a link.

### Cards, alerts and messages

```django
{% ak_card title="Orders" subtitle="Last 30 days" %}
  …any template content…
  <div class="ak-card-footer">{% ak_button "View all" href="/orders/" %}</div>
{% endak_card %}

{% ak_alert intent="warning" title="Payout delayed" dismissible=True %}
  Your bank asked for one more document.
{% endak_alert %}

{% ak_messages %}             {# Django messages as alerts #}
{% ak_messages toast=True %}  {# … or as toasts that dismiss after 6 s (errors stay) #}
```

Card `appearance`: outline, filled, subtle, elevated; `padding`: none, sm, md, lg; `href` makes the whole card a link. Alert `intent`: info, success, warning, danger. Errors and warnings use `role="alert"`, the others `role="status"`.

### Data display

```django
{% ak_badge "Paid" color="success" dot=True %}
{% ak_badge "Design" color="teal" appearance="filled" %}
{% ak_avatar user.get_full_name src=user.avatar_url size="lg" %}
{% ak_stat label="Revenue" value="$48,210" icon="wallet" delta="+12%" direction="up" good=True delta_label="vs last month" %}
{% ak_progress 72 label="Storage" intent="warning" %}
{% ak_spinner label="Loading…" %}
{% ak_empty title="No invoices yet" description="They appear here once a customer pays." %}
  {% ak_button "Create invoice" variant="primary" icon="add" %}
{% endak_empty %}
```

Badge colours: brand, neutral, success, warning, danger, info and the 12 accents (red … pink); appearances tint (default), filled, outline. Avatars without a `color` get a stable accent from the name, the same one the Vue `AkAvatar` picks.

Tables are plain HTML with classes:

```django
<div class="ak-table-wrap">
  <table class="ak-table">
    <caption>Recent orders</caption>
    <thead><tr><th scope="col">Order</th><th scope="col" class="ak-num">Amount</th></tr></thead>
    <tbody>{% for o in page_obj %}<tr><td>{{ o.id }}</td><td class="ak-num">{{ o.total }}</td></tr>{% endfor %}</tbody>
  </table>
</div>
{% ak_pagination page_obj %}
```

`ak_pagination` takes any Django `Page` (`page_obj` in a `ListView`) and keeps the other query parameters, so it works with search and filters.

### Navigation

```django
{% ak_nav nav_sections %}       {# sidebar; the item matching request.path is marked current #}
{% ak_tabs tabs %}              {# link tabs #}
{% ak_breadcrumb crumbs %}
```

Items are `("Label", "/url/")` tuples or dicts with `label`, `url`, and optionally `icon`, `badge` and `active`. `ak_nav` also takes sections: `[{"title": "Workspace", "items": [...]}]`. A context processor is a good place to build the sidebar (see `showcase/context.py` in the example).

### Dialogs

Dialogs use the native `<dialog>` element, so focus trapping and Escape come from the browser.

```django
{% ak_button "Delete project" variant="danger" data_ak_dialog_open="confirm-delete" %}

{% ak_dialog id="confirm-delete" title="Delete this project?" %}
  <form method="post" action="{% url 'project-delete' project.pk %}">
    {% csrf_token %}
    <div class="ak-dialog-body">This removes every file in it. You cannot undo this.</div>
    <div class="ak-dialog-footer">
      {% ak_button "Cancel" data_ak_dialog_close=True %}
      {% ak_button "Delete" variant="danger" type="submit" %}
    </div>
  </form>
{% endak_dialog %}
```

### Icons

```django
{% ak_icon "delete" %}                       {# semantic name from the AkwapUI icon set #}
{% ak_icon "trash-2" size="lg" %}            {# or the Lucide name #}
{% ak_icon "success" label="Completed" %}    {# role="img" with a name; otherwise decorative #}
```

Sizes: xs (12), sm (16), md (20, default), lg (24), xl (32), 2xl (48), or a number. The built-in set is the 84 semantic icons from the [component guide](COMPONENT_GUIDE.md) plus their Lucide names. For any other Lucide icon, `npm install lucide-static` and add its folder:

```python
AKWAPUI = {"ICON_DIRS": [BASE_DIR / "node_modules/lucide-static/icons"]}
```

### Plain classes

Every tag outputs `.ak-*` classes, and you can write them directly, for example in a partial that htmx swaps in:

```html
<button class="ak-btn ak-btn-primary ak-btn-sm">Save</button>
<span class="ak-badge ak-badge-success ak-badge-filled">Paid</span>
<label class="ak-choice"><input type="checkbox" class="ak-switch" role="switch"> Email me</label>
<div class="ak-control"><input type="search" name="q" placeholder="Search"></div>
```

To change a component's markup, copy its template from `akwapui_django/templates/akwapui/components/` into your own `templates/akwapui/components/` and edit it: your copy wins.

## 5. Forms

With `FORM_RENDERER` set, a normal Django form needs nothing else:

```django
<form method="post" novalidate>
  {% csrf_token %}
  {{ form }}
  {% ak_button "Save" variant="primary" type="submit" %}
</form>
```

Each field gets a label (with a required marker), the styled control, help text, and errors. The control has `aria-invalid` and `aria-describedby` pointing at the help text and error message, and errors are announced politely. Text inputs, selects, textareas, checkboxes, radio and checkbox lists, file inputs and dates are styled. A `CheckboxInput(attrs={"role": "switch"})` renders as a switch.

Without the renderer, or for one field at a time:

```django
{% ak_form form %}                                  {# all fields #}
{% ak_field form.email %}                           {# one field #}
{% ak_field form.search size="sm" hide_label=True %}
<div class="grid gap-4 md:grid-cols-2">{% ak_field form.first_name %}{% ak_field form.last_name %}</div>
```

Classes you set on a widget are kept; AkwapUI adds its own next to them.

## 6. Themes and brand colour

`{% ak_head %}` applies the saved theme before the page paints, and `{% ak_theme_switcher %}` lets people pick light, dark, high contrast or system. Any element works as a switch:

```html
<button type="button" data-ak-theme="dark">Dark</button>
```

From JavaScript: `AkwapUI.setTheme('high-contrast')`, `AkwapUI.getTheme()`, `AkwapUI.setBrand(160, 0.13)` (an OKLCH hue and chroma; the whole brand ramp follows) and `AkwapUI.resetBrand()`. A `akwapui:theme` event fires on `document` when the theme changes.

The choice is saved in `localStorage` under the same keys as the Vue library (`akwapui:theme`, `akwapui:brand`), so a Django page, a Vue island and the Vue docs site all agree. To set a fixed brand for the whole site instead, override the seed in your CSS:

```css
:root { --ak-brand-hue: 160; --ak-brand-chroma: 0.13; }
```

## 7. Vue islands (optional)

Use these when a page needs a widget that is genuinely interactive: charts with tooltips, sortable and selectable tables, a date picker, a searchable multi-select. Everything else stays server-rendered.

1. Build or install the Vue library (`npm run build:lib` in this repo, or `npm install akwapui` once it is published) with `vue`, `vue-router` and `@lucide/vue`.
2. Add an entry script that mounts the components you need. The example's [`frontend/islands.ts`](../integrations/django/example/frontend/islands.ts) is ready to copy: it mounts each `[data-ak-island]` element, passes the JSON props, and, when you give the island a `name`, keeps hidden inputs in sync with its v-model so the value posts with the surrounding Django form.
3. Build it with Vite into a static folder (see the example's `vite.config.ts`), or serve it with [django-vite](https://github.com/MrBin99/django-vite) for hot reload in development.
4. Let Tailwind see the classes the Vue components use, in your `app.css`:

   ```css
   @source '../../node_modules/akwapui/dist-lib';
   ```

Then, in a template:

```django
{% ak_island "AkLineChart" chart %}                 {# chart = {"labels": […], "series": […], "summary": "…"} #}
{% ak_island "AkDataTable" table %}
<form method="get">
  {% ak_island "AkMultiSelect" topics name="topics" %}   {# posts as topics=a&topics=b #}
  {% ak_island "AkDatePicker" name="start" %}
</form>
<script type="module" src="{% static 'islands/islands.js' %}"></script>
```

Props are passed as JSON, so only data props work (no functions such as custom formatters).

## 8. Run the example

```bash
cd integrations/django
python -m venv .venv && source .venv/bin/activate
pip install -e .
cd example
npm install
python manage.py akwapui_tailwind
npm run css
python manage.py runserver
```

Open http://127.0.0.1:8000 for the dashboard, `/components/`, `/form/` and `/islands/`. For the islands page, also run `npm run build:lib` at the repo root and `npm run islands` in the example.

`python manage.py test` runs the package's tests (31 of them: tags, form rendering and ARIA, pagination, icons, the Tailwind command, and the example pages).

## Keeping the package in sync

The package's CSS is generated from the design system. After changing `src/styles`, the icon set, or `integrations/django/styles/django-components.css`, run:

```bash
npm run build:django
```

It copies the token, theme and utility CSS into the package, regenerates the badge and avatar colour rules and `icons.json`, and rebuilds the prebuilt `akwapui.css`. The `.ak-*` component classes restate the Vue components' Tailwind recipes, so when a Vue component's look changes, update the matching rule in `django-components.css` too.
