from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Song
from .serializers import SongSerializer


@extend_schema_view(
    list=extend_schema(tags=['Songs']),
    retrieve=extend_schema(tags=['Songs']),
)
class SongViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /songs and GET /songs/<id>"""

    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'
