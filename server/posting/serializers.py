from .models import Posting, Comment
from rest_framework import serializers

class PostingSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False, allow_null=True) # 둘 중 하나만 넣어도 됨
    like = serializers.ReadOnlyField()
    class Meta:
        model = Posting
        fields = ('pk', 'image', 'content', 'category', 'lat', 'lng', 'like', 'created_at')

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    like = serializers.ReadOnlyField()
    class Meta:
        model = Comment
        fields = ('pk', 'posting', 'user', 'comment', 'like', 'created_at')

class LikeSerializer():
    pass