from django import forms

class ImageViewerForm(forms.Form):
    image = forms.ImageField()


class PictureUploadForm(forms.Form):
   image = forms.ImageField()
   caption = forms.CharField(max_length=100)

   def clean_image(self):
      ' reject large images. '
      max_size = 10**5
      if len(self.cleaned_data['image'].content) > max_size:
         raise forms.ValidationError(
             'Image must be less then %d bytes.' % max_size
         )
      else:
         return self.cleaned_data['image']
