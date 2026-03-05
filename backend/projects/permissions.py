from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Hada permission k-i-khalli ghir l-Admin (Staff) i-douz
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff) #m-connecti aslan? wach Authentication wla Admin

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Hada k-i-khalli ghir moul l-projet (Owner) awla l-Admin i-chouf/i-modifi
    """
    def has_object_permission(self, request, user, obj):
        # Admin 3ndou l-7aqq f kolchi
        if request.user.is_staff:
            return True
        # L-user l-3adi 3ndou l-7aqq ghir f dakchi dyalo
        return obj.owner == request.user