from django.contrib import admin

from .models import RecentlyPlayed


@admin.register(RecentlyPlayed)
class RecentlyPlayedAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'played_at')
    list_filter = ('played_at',)
