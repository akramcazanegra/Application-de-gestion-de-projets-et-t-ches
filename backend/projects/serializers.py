from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Project, Task
from rest_framework.validators import UniqueValidator

# Hada hwa li k-i-t-3amel m3a l-ma3loumat dyal l-user jdid
class RegisterSerializer(serializers.ModelSerializer):
    # Password khass i-koun write_only (ma-i-ban f hta blassa khrwa)
    password = serializers.CharField(write_only=True)#required
    email = serializers.EmailField(required=True,
            validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already in use.")]
            )#required

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        # Hna Django k-i-dir l-hachage automatique (sécurisé)
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        return user
    
# Hada hwa l-serializer dyal l-projets f Phase 2 [cite: 23, 24]
class ProjectSerializer(serializers.ModelSerializer):
    # L-user k-i-ban ghir s-miya dyalo w ma-k-i-t-beddelch mn React [cite: 25, 57]
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'user', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    # Bach n-choufou smiya d l-projet daxel l-task
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Task
        fields = '__all__' # Titre, Description, Statut, Priorité, Deadline, etc.




































































        