from rest_framework import serializers

from .models import Song


class SongSerializer(serializers.ModelSerializer):
    coverUrl = serializers.URLField(source='cover_url')
    audioUrl = serializers.URLField(source='audio_url')

    class Meta:
        model = Song
        fields = (
            'id',
            'title',
            'artist',
            'album',
            'duration',
            'coverUrl',
            'audioUrl',
            'genre',
        )
