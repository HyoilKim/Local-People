from django.contrib import admin
from django.urls import path, include
from rest_framework import urls
from posting import urls
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posting.urls')),
    path('api-auth/', include('rest_framework.urls')) # 로그인 기능 활성화
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


