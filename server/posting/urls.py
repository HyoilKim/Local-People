from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register('post', PostViewSet)
# router.register('main-post', MainPostViewSet)

urlpatterns = [
    path('', include(router.urls))
]
