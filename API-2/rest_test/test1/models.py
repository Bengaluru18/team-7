from django.db import models

class Stock(models.Model):
    name=models.CharField(max_length=30)
    make=models.IntegerField()
    type=models.CharField(max_length=10)
    modelname=models.CharField(max_length=20)
    slno = models.CharField(max_length=5)

    def __str__(self):
        return self.name
# Create your models here.
