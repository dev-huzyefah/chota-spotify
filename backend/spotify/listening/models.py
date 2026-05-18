import uuid

from django.conf import settings
from django.db import models


class RecentlyPlayed(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recently_played',
    )
    song = models.ForeignKey('songs.Song', on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-played_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'song'],
                name='unique_user_song_recently_played',
            ),
        ]

    def __str__(self):
        return f'{self.user_id} played {self.song_id} at {self.played_at}'
