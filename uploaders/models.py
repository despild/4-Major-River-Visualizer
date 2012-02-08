from django.db import models
import os.path
from django import forms
import datetime
from django.contrib.auth.models import User
import re
from django.core.exceptions import ObjectDoesNotExist

class UploadFileForm(forms.Form):
    file  = forms.ImageField()
    
class InputValueForm(forms.Form):
    itemname = forms.CharField(
        label = 'Item name',
        required=True,
        widget = forms.TextInput(attrs={'size':32})
        )
    value = forms.IntegerField(
        label = 'Value(Kr-Won)',
        widget = forms.TextInput(attrs={'size':32})
        )


class RegistrationForm(forms.Form):
    username = forms.CharField(label='User name', max_length=30)
    email1 = forms.EmailField(label ='E-mail')
    email2 = forms.EmailField(label ='E-mail')
    
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput()
        )
    password2 = forms.CharField(
        label='Password(Confirm)',
        widget=forms.PasswordInput()
        )
        
    def clean_email2(self):
        if 'email1' in self.cleaned_data:
            email1 = self.cleaned_data['email1']
            email2 = self.cleaned_data['email2']
            if email1 == email2:
                return email2
        raise forms.ValidationError('Incorrect E-mail')
    
        try:
            User.objects.get(email=email1)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('That user e-mail is already used')
    
    def clean_password2(self):
        if 'password1' in self.cleaned_data:
            password1 = self.cleaned_data['password1']
            password2 = self.cleaned_data['password2']
            if password1 == password2:
                return password2
        raise forms.ValidationError('Incorrect Password')
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError('User name is used just Alphabet, Number, Underbar')
        try:
            User.objects.get(username=username)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('That user name is already used')



class UploadedFile(models.Model):
    uploaded = models.ImageField(upload_to='.')
    usedcount = models.IntegerField(default=1)


class ResultSet(models.Model):
    itemname = models.CharField(max_length=200)
    iconfile = models.ForeignKey(UploadedFile)
    value = models.BigIntegerField()
    start = models.DateTimeField(default = datetime.datetime.now)
    user = models.ForeignKey(User)
    
    