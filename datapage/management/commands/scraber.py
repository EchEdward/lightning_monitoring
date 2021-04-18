from django.core.management.base import BaseCommand

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from _tasks import notify_user

import time


class Command(BaseCommand):
    """ Django command to pause execution until database is available"""
    def handle(self, *args, **kwargs):
        while True:
            notify_user()
            self.stdout.write("end scrab point")
            time.sleep(60)