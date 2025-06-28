from rest_framework.permissions import BasePermission

class IsVerifiedUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_verified

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        print("user:", request.user)
        print("is_authenticated:", request.user.is_authenticated)
        print("role:", getattr(request.user, 'role', 'None'))
        return request.user.is_authenticated and request.user.role == 'admin'

class IsInstructorUser(BasePermission):
    def has_permission(self, request, view):
        print("iuser:", request.user)
        print("is_authenticated:", request.user.is_authenticated)
        print("role:", getattr(request.user, 'role', 'None'))
        return request.user.is_authenticated and request.user.role == 'instructor'

    def has_object_permission(self, request, view, obj):
        return obj.instructor == request.user 
