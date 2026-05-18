from django.contrib import admin

from .models import Playlist


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_featured', 'created_at')
    list_filter = ('is_featured',)
    search_fields = ('name', 'description')
    filter_horizontal = ('songs',)
