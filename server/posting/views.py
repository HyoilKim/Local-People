from .models import Post
from .serializers import PostSerializer
from rest_framework import viewsets
from rest_framework.filters import SearchFilter

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    filter_backends = [SearchFilter]
    search_fields = ('category')
