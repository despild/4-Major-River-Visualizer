# -*- coding: utf-8 -*-

from django import forms
from django.shortcuts import render_to_response
from django.template import Context, RequestContext
from django.http import HttpResponse,HttpResponseRedirect
from django.utils.encoding import smart_str, smart_unicode
from models import *
from subprocess import call
from django.utils.safestring import mark_safe
from ..settings import MEDIA_ROOT
from django.views.decorators.csrf import csrf_exempt
import PIL
import Image
from datetime import datetime
from django.conf import settings
from django.contrib.auth import login, authenticate
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
import sys
reload(sys)
sys.setdefaultencoding('utf-8')


def logout_page(request):
	logout(request)
	return HttpResponseRedirect('/')

def register_page(request):
	if request.method == 'POST':
		form = RegistrationForm(request.POST)
		if form.is_valid():
			user = User.objects.create_user(
				username=form.cleaned_data['username'],
				password=form.cleaned_data['password1'],
				email=form.cleaned_data['email1']
				)
			return HttpResponseRedirect('/register/success/')
	else:
		form = RegistrationForm()
		
	variables = RequestContext(request,{'form':form})
	return render_to_response(
		'registration/register.html',variables)
		


def test(request):
    test = 'test'
    return render_to_response('test2.html',RequestContext(request,locals()))


@csrf_exempt
def main_page(request):

    def make_result(result_set):
        target_value = 20*10**12
        result_view = ''
        count = target_value/result_set.value
        iconfile =UploadedFile.objects.get(id = result_set.iconfile_id)
        s = 'Cost of 4 Major River Project is same as '+User.objects.get(id=result_set.user_id).username+'\'s Choice(<img src="/files/using/'\
            + smart_str(iconfile.uploaded)+'"  border=0 title="'\
            + smart_str(result_set.itemname)+' : '+ smart_str(result_set.value)+' Won" border=0>) X '\
            + smart_str(count)
        result_view += mark_safe(s)
        return result_view
    
    icons= UploadedFile.objects.all().order_by('-usedcount')    
    
    resultsets = ResultSet.objects.order_by('-id')[:15]

    result=''
    if resultsets:
        for resultset in resultsets:
            result+='<a href="/result_page/'+str(resultset.id)+'">'
            result+=make_result(resultset)
            result+='</a><br>'
    r=mark_safe(result)
    variables = RequestContext(request, locals())
    
    return render_to_response('main_page.html',variables)
@csrf_exempt
def icon_page(request):
    icons= UploadedFile.objects.all().order_by('-usedcount')
    variables = RequestContext(request, {
        'icons':icons,
        })
    return render_to_response('icon_page.html',varibales)

@login_required
def input_page(request,icon_id,user_id):
    if request.method == 'POST':
        form = InputValueForm(request.POST)
        if form.is_valid():
            result = ResultSet(
                itemname=form.cleaned_data['itemname'],
                iconfile_id=icon_id,
                value=form.cleaned_data['value'],
                user_id=user_id,
                )
            result.save()
            UploadedFile.objects.filter(id=icon_id).\
                update(usedcount=UploadedFile.objects.filter(id=icon_id)[0].usedcount+1)
            variables=RequestContext(request,locals())
            return HttpResponseRedirect('/result_page/%s'% str(result.id))
    else:
        form = InputValueForm()
        
    variables = RequestContext(request,locals())
    return render_to_response('input_page.html',variables)


def getmicsec(time):
    now = datetime.now()
    diff = now-time
    dd = diff.days
    ds = diff.seconds
    dm = diff.microseconds
    cdd = dd*24*60*60*1000000
    cds = ds*1000000
    total = dm + cds + cdd
    return total



TARGET_VALUE = 20*10**12

@csrf_exempt
def result_page(request,result_id):
    
    result_view = ''
    resultset=ResultSet.objects.get(id=result_id)
    resultstart = resultset.start
    target_value = TARGET_VALUE
    diffmic = getmicsec(resultstart)
    diffsec = diffmic /1000000
    fps = 30
    current_count = diffsec*30
    count = target_value/resultset.value
    ended=False
    if current_count > count:
        current_count = count
        ended=True

    im = mark_safe('<img id="icon" src="/files/using/'+smart_str(UploadedFile.objects.get(id = resultset.iconfile_id).uploaded.name)\
        +'" style="display:none"><br>')
    
    iconfile =UploadedFile.objects.get(id = resultset.iconfile_id)
    s = 'Cost of 4 Major River Project is same as '+User.objects.get(id=resultset.user_id).username+'\'s Choice(<img src="/files/using/'\
        + smart_str(iconfile.uploaded)+'"  border=0 title="'\
        + smart_str(resultset.itemname)+' : '+ smart_str(resultset.value)+' Won" border=0>) X '\
        + smart_str(count)
    result_view = mark_safe(s)
    fb_view = 'Cost of 4 Major River Project is same as '+User.objects.get(id=resultset.user_id).username+'\'s Choice( '\
        + smart_str(resultset.itemname)+' : '+ smart_str(resultset.value)+' Won ) X '\
        + smart_str(count)
    canvas_h=(count / 25 +1)*30
    variables = RequestContext(request, locals())
    
    return render_to_response('result_page.html',variables)

def reset_result(request,result_id):
    ResultSet.objects.filter(id=result_id).update(start = datetime.now())
    return HttpResponseRedirect('/result_page/%s' % str(result_id))

@login_required
def upload_file(request,user_id):
    uploadedfile = 0
    result=''
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file=form.cleaned_data['file']

            uploadedfile = handle_uploaded_file(request.FILES['file'])
            variables = RequestContext(request,locals())
            return HttpResponseRedirect('/input_page/%s/%s'%(str(uploadedfile),str(user_id)))
    else:
        form = UploadFileForm()

    variables = RequestContext(request, locals())
    
    return render_to_response('upload_file.html', variables)


def handle_uploaded_file(f):
    uploadedfile = UploadedFile(uploaded = f)
    uploadedfile.save()    
    location = uploadedfile.uploaded.name.split('/')
    basename = location[1].split('.')
    image = Image.open(MEDIA_ROOT+"/"+uploadedfile.uploaded.name)
    image.thumbnail((30,30),Image.ANTIALIAS)
    thumb=image
    gapW = thumb.size[0] - 30
    gapH = thumb.size[1] - 30
    cropped = thumb.crop((gapW/2,gapH/2,30+gapW/2,30+gapH/2))
    cropped.save(MEDIA_ROOT+"/using/"+basename[0]+"."+basename[1])
    cmd = 'rm '+MEDIA_ROOT+'/'+smart_str(uploadedfile.uploaded)
    call(cmd,shell=True)
    
    return uploadedfile.id

