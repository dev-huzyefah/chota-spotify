from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    displayName = serializers.CharField(source='display_name')
    avatarUrl = serializers.URLField(source='avatar_url', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'displayName', 'email', 'avatarUrl')
        read_only_fields = fields


class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    displayName = serializers.CharField(source='display_name', max_length=255)
    avatarUrl = serializers.URLField(
        source='avatar_url',
        required=False,
        allow_blank=True,
        default='',
    )

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        email = validated_data['email']
        display_name = validated_data['display_name']
        avatar_url = validated_data.get('avatar_url') or ''
        password = validated_data['password']

        if not avatar_url:
            avatar_url = f'https://picsum.photos/id/{hash(email) % 70}/200/200'

        return User.objects.create_user(
            username=email,
            email=email,
            password=password,
            display_name=display_name,
            avatar_url=avatar_url,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs['email'].lower()
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=attrs['password'],
        )
        if user is None:
            raise serializers.ValidationError('Invalid email or password.')
        attrs['user'] = user
        return attrs


def issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


class AuthResponseSerializer(serializers.Serializer):
    """User profile plus JWT tokens (matches frontend User + token fields)."""

    id = serializers.UUIDField(read_only=True)
    displayName = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    avatarUrl = serializers.URLField(read_only=True, allow_blank=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def to_representation(self, user):
        data = UserSerializer(user).data
        data.update(issue_tokens(user))
        return data
