from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AuthResponseSerializer, LoginSerializer, SignupSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Log in',
        request=LoginSerializer,
        responses={200: AuthResponseSerializer},
        tags=['Auth'],
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(AuthResponseSerializer().to_representation(serializer.validated_data['user']))


class SignupView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Sign up',
        request=SignupSerializer,
        responses={201: AuthResponseSerializer},
        tags=['Auth'],
    )
    def post(self, request):
        serializer = SignupSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            AuthResponseSerializer().to_representation(user),
            status=status.HTTP_201_CREATED,
        )
