from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Playlist
from .permissions import IsPlaylistOwnerOrReadOnly
from .serializers import PlaylistSerializer


class FeaturedPlaylistView(APIView):
    """GET /featuredPlaylists"""

    permission_classes = [AllowAny]

    @extend_schema(
        summary='List featured playlists',
        responses={200: PlaylistSerializer(many=True)},
        tags=['Playlists'],
    )
    def get(self, request):
        playlists = Playlist.objects.filter(is_featured=True).order_by('name')
        serializer = PlaylistSerializer(playlists, many=True, context={'request': request})
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        summary='List user playlists',
        parameters=[
            OpenApiParameter(
                name='userId',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter playlists by user UUID (must match authenticated user).',
            ),
        ],
        tags=['Playlists'],
    ),
    create=extend_schema(summary='Create a playlist', tags=['Playlists']),
    retrieve=extend_schema(summary='Get a playlist', tags=['Playlists']),
    partial_update=extend_schema(summary='Update a playlist', tags=['Playlists']),
    destroy=extend_schema(summary='Delete a playlist', tags=['Playlists']),
)
class PlaylistViewSet(viewsets.ModelViewSet):
    """
    User playlists: list/create at /playlists, detail at /playlists/<id>.
    Query param ``userId`` filters playlists for that user (must match the JWT subject).
    """

    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated, IsPlaylistOwnerOrReadOnly]
    lookup_field = 'pk'

    def get_queryset(self):
        queryset = (
            Playlist.objects.filter(is_featured=False)
            .select_related('user')
            .prefetch_related('songs')
        )
        user_id = self.request.query_params.get('userId')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        else:
            queryset = queryset.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
