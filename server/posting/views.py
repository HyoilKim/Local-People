from django.db import reset_queries
from .models import Posting, Comment
from .serializers import PostingSerializer, CommentSerializer
from rest_framework import viewsets, mixins, generics, status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly

class PostingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Posting.objects.all()
    serializer_class = PostingSerializer
    filter_backends = [SearchFilter]
    search_fields = ('content', 'category') # only tuple

class MyPostingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Posting.objects.all()
    serializer_class = PostingSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        qs = Posting.objects.all()
        qs = qs.filter(user=self.request.user)   
        return qs

class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        print(self.request.query_params) 

        try:
            posting_id = int(self.request.query_params['posting'])
        except:
            return Response(data=0,status=status.HTTP_400_BAD_REQUEST)
            
        if posting_id:
            return Comment.objects.filter(posting=posting_id)
        else:
            return Comment.objects.all()
        
class CommentListOfPosting(generics.ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    serializer_class = CommentSerializer

    def get_queryset(self):
        posting_id = self.kwargs['posting']
        return Comment.objects.filter(posting=posting_id)