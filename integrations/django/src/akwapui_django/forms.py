"""Form renderer: ``FORM_RENDERER = "akwapui_django.forms.AkwapUIFormRenderer"``.

With it, ``{{ form }}`` and ``{{ form.field.as_field_group }}`` render AkwapUI
fields (label, styled control, help text, errors with ARIA wiring).
"""

from django.forms.renderers import DjangoTemplates


class AkwapUIFormRenderer(DjangoTemplates):
    form_template_name = "akwapui/forms/form.html"
    field_template_name = "akwapui/forms/field.html"
