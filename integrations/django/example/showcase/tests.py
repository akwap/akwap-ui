"""Tests for akwapui_django, run through the example project: python manage.py test"""

import re
import tempfile
from io import StringIO
from pathlib import Path

from django import forms
from django.contrib.messages import constants
from django.contrib.messages.storage.base import Message
from django.core.management import call_command
from django.core.paginator import Paginator
from django.template import Context, Template, TemplateSyntaxError
from django.test import RequestFactory, SimpleTestCase, override_settings

from akwapui_django.icons import render_icon
from akwapui_django.templatetags.akwapui import _page_window, accent_for, initials


def render(src, **ctx):
    return Template("{% load akwapui %}" + src).render(Context(ctx))


class ButtonTests(SimpleTestCase):
    def test_variants_and_sizes(self):
        html = render('{% ak_button "Save" variant="primary" size="lg" type="submit" %}')
        self.assertIn('class="ak-btn ak-btn-primary ak-btn-lg"', html)
        self.assertIn('type="submit"', html)
        self.assertIn(">Save</span>", html)

    def test_link_button_and_extra_attrs(self):
        html = render('{% ak_button "Docs" href="/docs/" aria_label="Read the docs" hx_boost="true" %}')
        self.assertTrue(html.startswith("<a "))
        self.assertIn('href="/docs/"', html)
        self.assertIn('aria-label="Read the docs"', html)
        self.assertIn('hx-boost="true"', html)

    def test_disabled_link_has_no_href(self):
        html = render('{% ak_button "Docs" href="/docs/" disabled=True %}')
        self.assertNotIn("href=", html)
        self.assertIn('aria-disabled="true"', html)

    def test_loading_and_icon_only(self):
        html = render('{% ak_button "Saving" loading=True %}')
        self.assertIn('aria-busy="true"', html)
        self.assertIn("ak-spinner", html)
        html = render('{% ak_button "Settings" icon="settings" icon_only=True %}')
        self.assertIn("ak-btn-icon", html)
        self.assertIn('<span class="sr-only">Settings</span>', html)

    def test_escapes_label(self):
        self.assertIn("&lt;b&gt;", render("{% ak_button label %}", label="<b>"))

    def test_rejects_unknown_variant(self):
        with self.assertRaises(TemplateSyntaxError):
            render('{% ak_button "x" variant="huge" %}')


class ComponentTests(SimpleTestCase):
    def test_badge(self):
        html = render('{% ak_badge "Paid" color="success" appearance="filled" dot=True %}')
        self.assertIn('class="ak-badge ak-badge-success ak-badge-filled"', html)
        self.assertIn("ak-badge-dot", html)

    def test_card_block(self):
        html = render('{% ak_card title="Orders" subtitle="Today" %}<p>{{ n }}</p>{% endak_card %}', n=3)
        self.assertIn('<h3 class="ak-card-title">Orders</h3>', html)
        self.assertIn("<p>3</p>", html)

    def test_alert_roles(self):
        self.assertIn('role="alert"', render('{% ak_alert intent="danger" %}x{% endak_alert %}'))
        self.assertIn('role="status"', render('{% ak_alert intent="success" %}x{% endak_alert %}'))
        self.assertIn("data-ak-dismiss", render("{% ak_alert dismissible=True %}x{% endak_alert %}"))

    def test_messages(self):
        msgs = [Message(constants.SUCCESS, "Saved"), Message(constants.ERROR, "Nope")]
        html = render("{% ak_messages toast=True %}", messages=msgs)
        self.assertIn("ak-toaster", html)
        self.assertIn("ak-alert-success", html)
        self.assertIn("ak-alert-danger", html)
        self.assertEqual(render("{% ak_messages %}", messages=[]).strip(), "")

    def test_progress_clamps(self):
        html = render("{% ak_progress 150 %}")
        self.assertIn("width: 100%", html)
        self.assertIn('aria-valuenow="150"', html)

    def test_avatar_initials_and_stable_colour(self):
        self.assertEqual(initials("Ada Mensah"), "AM")
        self.assertEqual(initials("cher"), "CH")
        self.assertEqual(accent_for("Ada Mensah"), accent_for("Ada Mensah"))
        html = render('{% ak_avatar "Ada Mensah" %}')
        self.assertIn('aria-label="Ada Mensah"', html)
        self.assertIn(f"ak-avatar-{accent_for('Ada Mensah')}", html)

    def test_dialog_needs_id(self):
        with self.assertRaises(TemplateSyntaxError):
            render("{% ak_dialog %}x{% endak_dialog %}")
        self.assertIn('<dialog id="d"', render('{% ak_dialog id="d" title="T" %}x{% endak_dialog %}'))

    def test_theme_switcher(self):
        html = render("{% ak_theme_switcher %}")
        self.assertEqual(len(re.findall(r"data-ak-theme=", html)), 4)

    def test_head_script(self):
        html = render('{% ak_head nonce="abc" css="prebuilt" %}')
        self.assertIn('<script nonce="abc">', html)
        self.assertIn("akwapui:theme", html)
        self.assertIn("akwapui/akwapui.css", html)

    def test_island(self):
        html = render('{% ak_island "AkDataTable" props %}', props={"rows": [1, 2], "title": '<x">'})
        self.assertIn('data-ak-island="AkDataTable"', html)
        self.assertIn("&quot;rows&quot;: [1, 2]", html)
        self.assertNotIn('<x">', html)


class NavigationTests(SimpleTestCase):
    def test_page_window(self):
        self.assertEqual(_page_window(1, 5), [1, 2, 3, 4, 5])
        self.assertEqual(_page_window(1, 20), [1, 2, 3, 4, 5, None, 20])
        self.assertEqual(_page_window(10, 20), [1, None, 9, 10, 11, None, 20])
        self.assertEqual(_page_window(20, 20), [1, None, 16, 17, 18, 19, 20])

    def test_pagination_keeps_query(self):
        request = RequestFactory().get("/orders/", {"q": "paid", "page": "2"})
        page = Paginator(range(100), 10).page(2)
        html = Template("{% load akwapui %}{% ak_pagination page_obj %}").render(Context({"request": request, "page_obj": page}))
        self.assertIn('aria-current="page"', html)
        self.assertIn("?q=paid&amp;page=3", html)
        self.assertIn("11–20", html)

    def test_breadcrumb_marks_current(self):
        html = render("{% ak_breadcrumb items %}", items=[("Home", "/"), ("Orders", None)])
        self.assertIn('<a href="/">Home</a>', html)
        self.assertIn('<span aria-current="page">Orders</span>', html)

    def test_nav_active_from_path(self):
        request = RequestFactory().get("/orders/42/")
        tpl = Template("{% load akwapui %}{% ak_nav items %}")
        html = tpl.render(Context({"request": request, "items": [{"label": "Home", "url": "/"}, {"label": "Orders", "url": "/orders/"}]}))
        self.assertEqual(html.count('aria-current="page"'), 1)
        self.assertRegex(html, r'href="/orders/" aria-current="page"')


class SampleForm(forms.Form):
    name = forms.CharField(help_text="Your full name")
    kind = forms.ChoiceField(choices=[("a", "A"), ("b", "B")])
    plan = forms.ChoiceField(choices=[("x", "X"), ("y", "Y")], widget=forms.RadioSelect)
    agree = forms.BooleanField()
    notes = forms.CharField(widget=forms.Textarea, required=False)
    secret = forms.CharField(widget=forms.HiddenInput, required=False)


class FormTests(SimpleTestCase):
    def test_renderer_renders_fields(self):
        html = str(SampleForm())
        self.assertIn('class="ak-form"', html)
        self.assertIn('class="ak-control ak-control-select"', html)
        self.assertIn('class="ak-control ak-control-textarea"', html)
        self.assertIn('type="radio" name="plan" value="x" class="ak-radio"', html)
        self.assertIn('class="ak-check"', html)
        self.assertIn('aria-describedby="id_name_helptext"', html)
        self.assertIn('type="hidden" name="secret"', html)

    def test_errors_are_wired(self):
        html = str(SampleForm(data={}))
        self.assertIn('aria-invalid="true"', html)
        self.assertIn('id="id_name_error"', html)
        self.assertIn('aria-describedby="id_name_helptext id_name_error"', html)
        self.assertIn("ak-control-invalid", html)

    @override_settings(FORM_RENDERER="django.forms.renderers.DjangoTemplates")
    def test_tags_work_without_the_renderer(self):
        form = SampleForm()
        self.assertIn('class="ak-form"', render("{% ak_form form %}", form=form))
        self.assertIn('class="ak-control', render("{% ak_field form.name size='lg' %}", form=form))

    def test_existing_widget_classes_are_kept(self):
        class F(forms.Form):
            ok = forms.BooleanField(widget=forms.CheckboxInput(attrs={"class": "mine"}))

        self.assertIn('class="mine ak-check"', str(F()))


class IconTests(SimpleTestCase):
    def test_semantic_and_lucide_names(self):
        self.assertEqual(render_icon("delete"), render_icon("trash-2"))
        html = render_icon("add", size="lg", label="Add")
        self.assertIn('width="24"', html)
        self.assertIn('role="img" aria-label="Add"', html)

    def test_unknown_icon(self):
        with self.assertRaises(ValueError):
            render_icon("definitely-not-an-icon")

    def test_icon_dirs(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d, "rocket.svg").write_text('<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>')
            with override_settings(AKWAPUI={"ICON_DIRS": [d]}):
                from akwapui_django import icons

                icons._from_dirs.cache_clear()
                self.assertIn('<path d="M1 1"/>', render_icon("rocket"))


class CommandTests(SimpleTestCase):
    def test_writes_tailwind_entry(self):
        with tempfile.TemporaryDirectory() as d:
            out = Path(d, "css", "akwapui.css")
            call_command("akwapui_tailwind", "-o", str(out), stdout=StringIO())
            text = out.read_text()
            self.assertIn("tailwind/theme.css", text)
            self.assertIn("@source", text)
            target = (out.parent / re.search(r"@import '([^']+)'", text).group(1)).resolve()
            self.assertTrue(target.is_file())


class PageTests(SimpleTestCase):
    def test_pages_render(self):
        for url in ("/", "/components/", "/form/", "/?page=3"):
            self.assertEqual(self.client.get(url).status_code, 200, url)

    def test_form_round_trip(self):
        response = self.client.post("/form/", {"full_name": "Ada"})
        self.assertContains(response, "Enter your first and last name.")
        data = {"full_name": "Ada Mensah", "email": "ada@example.com", "password": "longenough", "region": "eu",
                "plan": "team", "seats": "3", "terms": "on"}
        response = self.client.post("/form/", data, follow=True)
        self.assertContains(response, "Account created for Ada Mensah.")

    def test_islands_page(self):
        response = self.client.get("/islands/", {"topics": ["a", "b"], "start": "2026-11-10"})
        self.assertContains(response, 'data-ak-island="AkMultiSelect"')
        self.assertContains(response, 'data-ak-name="topics"')
        self.assertContains(response, "a, b, 2026-11-10")
