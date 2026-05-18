from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'display_name', 'username', 'is_staff')
    search_fields = ('email', 'display_name', 'username')
    ordering = ('email',)
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('display_name', 'avatar_url')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile', {'fields': ('display_name', 'avatar_url')}),
    )
