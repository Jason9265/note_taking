from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.CharField(max_length=200, blank=True, null=True)  # This could also be a many-to-many field to a Tag model

    def __str__(self):
        return self.title
