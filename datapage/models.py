from django.db import models
from django.template import Context, Template

# Create your models here.

# python manage.py dumpdata datapage --exclude auth.permission --exclude contenttypes --indent 2 > datapage.json

class Object_type(models.Model):
    """ Типы обьектов энергосистемы """
    object_type = models.CharField(max_length = 20)

    def __str__(self): 
        return self.object_type

class Region(models.Model):
    """ Таблица областей РБ """
    region = models.CharField(max_length = 150)

    def __str__(self): 
        return self.region

class District(models.Model):
    """ Таблица районов РБ """
    region  = models.ForeignKey(Region, on_delete=models.CASCADE) 
    district = models.CharField(max_length = 150)

    def __str__(self): 
        return self.district

class RUP(models.Model):
    """ Таблица РУПов энергосистемы """
    rup = models.CharField(max_length = 150)

    def __str__(self): 
        return self.rup

class Branch(models.Model):
    """ Таблица филиалов энергосистемы """
    rup = models.ForeignKey(RUP, on_delete=models.CASCADE) 
    branch = models.CharField(max_length = 150)

    def __str__(self): 
        return self.branch

class EnergyObjects(models.Model):
    """ Таблица ВЛ и ПС по РБ """
    #number = models.IntegerField(primary_key=True)
    object_type = models.ForeignKey(Object_type, on_delete=models.CASCADE) 
    name = models.CharField(max_length = 200)
    voltage_class = models.IntegerField(blank=True)

    def __str__(self): 
        return self.name


class Coordinates_PS(models.Model):
    """ Таблица ПС по РБ """
    energy_objects = models.ForeignKey(EnergyObjects, on_delete=models.CASCADE) 
    lat = models.FloatField()
    lon = models.FloatField()
    #square_lat = models.IntegerField()
    #square_lon = models.IntegerField()

    def __str__(self): 
        return self.energy_objects.name

    
class Coordinates_VL(models.Model):
    """ Таблица координат ВЛ """
    energy_objects = models.ForeignKey(EnergyObjects, on_delete=models.CASCADE) 
    line = models.IntegerField()
    iterate = models.IntegerField()
    lat = models.FloatField()
    lon = models.FloatField()
    #square_lat = models.IntegerField()
    #square_lon = models.IntegerField()
    first = models.IntegerField()
    last = models.IntegerField()

    def __str__(self): 
        return self.energy_objects.name

    

class Strikes(models.Model):
    """ Таблица ударов молний по РБ """
    lat = models.FloatField()
    lon = models.FloatField()
    date_time = models.DateTimeField()
    #square_lat = models.IntegerField()
    #square_lon = models.IntegerField()

    def __str__(self): 
        t = Template("{{date_time}}")
        c = Context({"date_time": self.date_time})
        return t.render(c)
    


class Log_Strikes(models.Model):
    """ Журнал ударов молний вблизи обьектов энергосистемы """
    energy_objects = models.ForeignKey(EnergyObjects, on_delete=models.CASCADE) 
    strikes = models.ForeignKey(Strikes, on_delete=models.CASCADE) 
    distance = models.FloatField()

    
        

class Links(models.Model):
    """ Принадлежность обьекта к полям """
    energy_objects = models.ForeignKey(EnergyObjects, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)

    
    
    




