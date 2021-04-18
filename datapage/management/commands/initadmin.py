from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings

class Command(BaseCommand):

    def handle(self, *args, **options):
        User = get_user_model() 
        if User.objects.count() == 0:
            for username, email in settings.ADMINS:
                password = 'admin'
                self.stdout.write('Creating account for %s (%s)' % (username, email))
                admin = User.objects.create_superuser(email=email, username=username, password=password)
                admin.is_active = True
                admin.is_admin = True
                admin.save()
        else:
            self.stdout.write('Admin accounts can only be initialized if no Accounts exist')