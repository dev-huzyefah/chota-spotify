from rest_framework_simplejwt.authentication import JWTAuthentication as SimpleJWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class JWTAuthentication(SimpleJWTAuthentication):
    """
    JWT auth that treats invalid/expired tokens as unauthenticated instead of 401.

    Allows public endpoints (songs, featured playlists) to work when localStorage
    still holds a stale token from a previous session.
    """

    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, TokenError):
            return None
