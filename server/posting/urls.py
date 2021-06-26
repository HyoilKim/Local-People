from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostingViewSet, MyPostingViewSet

router = DefaultRouter()
router.register(r'^postings', PostingViewSet)
router.register(r'^my-postings', MyPostingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
