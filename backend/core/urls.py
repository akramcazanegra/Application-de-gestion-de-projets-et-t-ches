from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)
from projects.views import RegisterView, ProjectViewSet, TaskViewSet
from rest_framework.routers import DefaultRouter

# 1. Setup router
router = DefaultRouter() 
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # HNA FIN KAN L-MOUCHKIL: 
    # Sifet router.urls nishan bach t-fada l-error d "ModuleNotFoundError"
    path('api/', include(router.urls)), 
]