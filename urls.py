from django.conf.urls.defaults import *
from uploaders.views import *
from django.views.generic.simple import direct_to_template
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

files = os.path.join(
    os.path.dirname(__file__), 'media'
    )


urlpatterns = patterns('',
    (r'^$',main_page),
    (r'^upload_file/(\d+)$', upload_file),
    (r'^result_page/(\d+)$',result_page),
    (r'^files/(?P<path>.*)$', 'django.views.static.serve', {'document_root': files}),
    (r'^icon_page/$',icon_page),
    (r'^input_page/(\d+)/(\w+)/$',input_page),
    (r'^test/$',test),
    (r'^reset_result/(\d+)$',reset_result),
    (r'^login/$','django.contrib.auth.views.login'),
    (r'^logout/$',logout_page),
    (r'^register/$',register_page),
    (r'^register/success/$',direct_to_template,
        {'template':'registration/register_success.html'}),
    #url('^login/$', twitter_signin, name='login'),
    #url('^return/$', twitter_return, name='return'),
    # Examples:
    # url(r'^$', 'file_uploader.views.home', name='home'),
    # url(r'^file_uploader/', include('file_uploader.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
