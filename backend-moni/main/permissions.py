from rest_framework.permissions import BasePermission


class IsAnalystOrAdmin(BasePermission):
    """Allow Analysts to list and retrieve, but only Admins to update."""

    def has_permission(self, request, view):
        if view.action in ["list", "retrieve"]:
            return request.user.groups.filter(name="Analyst").exists() or request.user.groups.filter(name="Admin").exists()

        if not view.action in ["list", "retrieve"]:
            return request.user.groups.filter(name="Admin").exists()

        return False
