from django import forms


class AccountForm(forms.Form):
    PLANS = [("starter", "Starter"), ("team", "Team"), ("enterprise", "Enterprise")]
    REGIONS = [("", "Choose a region"), ("eu", "Europe"), ("us", "United States"), ("af", "Africa")]
    TOPICS = [("product", "Product news"), ("billing", "Billing"), ("security", "Security alerts")]

    full_name = forms.CharField(label="Full name", max_length=80)
    email = forms.EmailField(help_text="We send receipts and security alerts here.")
    password = forms.CharField(widget=forms.PasswordInput, min_length=8, help_text="At least 8 characters.")
    region = forms.ChoiceField(choices=REGIONS)
    plan = forms.ChoiceField(choices=PLANS, widget=forms.RadioSelect, initial="team")
    topics = forms.MultipleChoiceField(choices=TOPICS, widget=forms.CheckboxSelectMultiple, required=False, label="Email me about")
    seats = forms.IntegerField(min_value=1, max_value=500, initial=5)
    start = forms.DateField(label="Start date", widget=forms.DateInput(attrs={"type": "date"}), required=False)
    bio = forms.CharField(widget=forms.Textarea(attrs={"rows": 3}), required=False, help_text="Shown on your profile.")
    beta = forms.BooleanField(required=False, label="Join the beta", widget=forms.CheckboxInput(attrs={"role": "switch"}))
    terms = forms.BooleanField(label="I accept the terms", help_text="You can cancel at any time.")

    def clean_full_name(self):
        name = self.cleaned_data["full_name"].strip()
        if len(name.split()) < 2:
            raise forms.ValidationError("Enter your first and last name.")
        return name
