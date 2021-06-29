from .models import Posting, Comment
from rest_framework import serializers

class PostingSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False, allow_null=True) # 둘 중 하나만 넣어도 됨
    user_id = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Posting
        fields = ('pk', 'user_id', 'image', 'content', 'category', 'lat', 'lng', 'created_at')

class CommentSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Comment
        fields = ('pk', 'user_id', 'posting', 'comment', 'created_at')