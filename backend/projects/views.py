from django.shortcuts import render
from rest_framework import generics, viewsets, permissions, filters
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from .models import Project
from .serializers import RegisterSerializer, ProjectSerializer
from .models import Task
from .serializers import TaskSerializer
from django_filters.rest_framework import DjangoFilterBackend

#Connecteur (Serializer) m3a l-base de données
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all() #Had l-khedma kamla ghadi t-dar f l-jadwal dyal l-Users
    # Hna gna "AllowAny" bach ay wahed i-9der i-tsajjel bla ma i-koun mconnecti qbel
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer #Had l-serializer li k-i-t-3amel m3a l-ma3loumat dyal l-user jdid



class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Had l-logic kat-7eqqeq l-Gestion de rôles
    def get_queryset(self):
        user = self.request.user
        # Ila kan l-user Admin (is_staff), k-n-3tiwh l-projets dyal n-nas kamlin
        if user.is_staff:
            return Project.objects.all()
        
        # Ila kan user 3adi, k-i-bqa i-chouf ghir dyalo kima derti f l-bedya
        return Project.objects.filter(user=user)

    def perform_create(self, serializer):
        # Rabt l-projet b l-user automatique
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    #Ma-k-i-khllich ay wa7ed ma-m-connectich i-chouf awla i-modifier l-mohimmat.
    permission_classes = [permissions.IsAuthenticated]
    
    # Zid had s-stora bach n-7eqqeqou l-matlub dyal l-filtrage
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'priority', 'project'] # Filtrer par statut, priorité
    search_fields = ['title', 'description'] # Recherche par titre

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # Admin i-chouf ghir l-tasks dyal l-projets dyal n-nas kamlin
            return Task.objects.all()
        # L-user i-chouf ghir l-tasks dyal l-projets dyalu bo7du
        return Task.objects.filter(project__user=self.request.user)


