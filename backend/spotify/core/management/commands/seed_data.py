from django.core.management.base import BaseCommand
from django.db import transaction

from playlists.models import Playlist
from songs.models import Song
from users.models import CustomUser

SAMPLE_SONGS = [
    {
        'title': 'Blinding Lights',
        'artist': 'The Weeknd',
        'album': 'After Hours',
        'duration': 200,
        'cover_url': 'https://picsum.photos/seed/blinding/300/300',
        'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'genre': 'Pop',
    },
    {
        'title': 'Levitating',
        'artist': 'Dua Lipa',
        'album': 'Future Nostalgia',
        'duration': 203,
        'cover_url': 'https://picsum.photos/seed/levitating/300/300',
        'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'genre': 'Pop',
    },
    {
        'title': 'Save Your Tears',
        'artist': 'The Weeknd',
        'album': 'After Hours',
        'duration': 215,
        'cover_url': 'https://picsum.photos/seed/save/300/300',
        'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        'genre': 'Pop',
    },
    {
        'title': 'Good 4 U',
        'artist': 'Olivia Rodrigo',
        'album': 'SOUR',
        'duration': 178,
        'cover_url': 'https://picsum.photos/seed/good4u/300/300',
        'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        'genre': 'Rock',
    },
    {
        'title': 'Stay',
        'artist': 'The Kid LAROI & Justin Bieber',
        'album': 'F*CK LOVE 3',
        'duration': 141,
        'cover_url': 'https://picsum.photos/seed/stay/300/300',
        'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        'genre': 'Pop',
    },
]

FEATURED_PLAYLISTS = [
    {
        'name': "Today's Top Hits",
        'description': 'The hottest tracks right now.',
        'cover_url': 'https://picsum.photos/seed/tophits/300/300',
    },
    {
        'name': 'Chill Vibes',
        'description': 'Relax and unwind.',
        'cover_url': 'https://picsum.photos/seed/chill/300/300',
    },
    {
        'name': 'Rock Classics',
        'description': 'Legendary rock anthems.',
        'cover_url': 'https://picsum.photos/seed/rock/300/300',
    },
]


class Command(BaseCommand):
    help = 'Seed the database with sample songs, featured playlists, and a demo user.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete existing songs and featured playlists before seeding.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['flush']:
            Playlist.objects.filter(is_featured=True).delete()
            Song.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared songs and featured playlists.'))

        songs = []
        for data in SAMPLE_SONGS:
            song, created = Song.objects.get_or_create(title=data['title'], defaults=data)
            songs.append(song)
            if created:
                self.stdout.write(f'Created song: {song.title}')

        for index, data in enumerate(FEATURED_PLAYLISTS):
            playlist, created = Playlist.objects.get_or_create(
                name=data['name'],
                is_featured=True,
                defaults={
                    'description': data['description'],
                    'cover_url': data['cover_url'],
                    'user': None,
                },
            )
            if created or not playlist.songs.exists():
                playlist.songs.set(songs[index : index + 3])
            if created:
                self.stdout.write(f'Created featured playlist: {playlist.name}')

        demo_user, user_created = CustomUser.objects.get_or_create(
            email='demo@chota.spotify',
            defaults={
                'username': 'demo@chota.spotify',
                'display_name': 'Demo User',
                'avatar_url': 'https://picsum.photos/seed/demo-user/200/200',
            },
        )
        if user_created:
            demo_user.set_password('demo12345')
            demo_user.save()
            self.stdout.write(self.style.SUCCESS('Created demo user: demo@chota.spotify / demo12345'))

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
