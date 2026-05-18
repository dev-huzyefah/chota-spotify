import uuid

from django.db import models


class Song(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255)
    duration = models.IntegerField()
    cover_url = models.URLField(max_length=1024)
    audio_url = models.URLField(max_length=1024)
    genre = models.CharField(max_length=100)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f'{self.title} — {self.artist}'
