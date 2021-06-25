from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Post
        fields = ('pk', 'uid', 'image', 'content', 'category', 'date')