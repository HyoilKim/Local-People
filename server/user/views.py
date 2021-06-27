import json

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import User


class UserView(APIView):
    permission_classes(IsAuthenticated,)

    def put(self, request):
        email = request.data.get('email')

        updating = User.objects.get(email=email)

        nick_name = request.data.get('nick_name')
        profile_image = request.data.get('profile_image')
        region = request.data.get('region')

        if nick_name:
            updating.nick_name = nick_name
        if profile_image:
            updating.profile_image = profile_image
        if region:
            updating.region = region

        updating.save()

        return JsonResponse({'result': 'ok'})

    def delete(self, request):
        email = request.data.get('email')

        deleting = User.objects.get(email=email)
        deleting.delete()

        return JsonResponse({'result': 'ok'})

    def get(self, request):
        email = request.data.get('email')

        retrieved = User.objects.get(email=email)

        return JsonResponse({'result': 'ok', 'email': str(retrieved.email), 'nick_name': str(retrieved.nick_name),
                             'region': str(retrieved.region),'period': str(retrieved.period)})


@require_http_methods(['POST'])
def sign_up(request):
    data = json.loads(request.body.decode("utf-8"))
    email = data['email']
    password = data['password']

    try:
        user = User.objects.create_user(email, password)
    except ValueError:
        return JsonResponse({'result': 'ValueError'})
    except IntegrityError:
        return JsonResponse({'result': 'IntegrityError'})

    try:
        token = Token.objects.get(user=user)
    except Token.DoesNotExist:
        return JsonResponse({'result': 'Token does not exist'})

    return JsonResponse({'result': 'ok', 'id': str(user.pk), 'token': str(token.key)})

