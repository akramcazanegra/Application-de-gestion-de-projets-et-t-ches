from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    name = models.CharField(max_length=255) #
    description = models.TextField() #
    #  k-t-rbat l-projet b l-user (Relation Many-to-One)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects') 
    # 4. (Extra) Date dyal création automatique
    created_at = models.DateTimeField(auto_now_add=True)

    # 5. Bach n-choufou smiya d l-projet f Django Admin
    def __str__(self):
        return self.name



class Task(models.Model):
    # L-Khayarat dyal l-Statut (Status)
    STATUS_CHOICES = [
        ('TODO', 'À faire'),
        ('IN_PROGRESS', 'En cours'),
        ('DONE', 'Terminée'),
    ]

    # L-Khayarat dyal l-Priorité (Priority)
    PRIORITY_CHOICES = [
        ('LOW', 'Faible'),
        ('MEDIUM', 'Moyenne'),
        ('HIGH', 'Élevée'),
    ]

    # Rabt l-Task b l-Projet (Relationship: Many Tasks -> One Project)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    
    title = models.CharField(max_length=200) # Titre
    description = models.TextField() # Description
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO') # Statut
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM') # Priorité
    deadline = models.DateField(null=True, blank=True) # Date limite (facultative)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.project.name})" # Hadi bach n-choufou titre d l-task m3a smiya d l-projet f Django Admin