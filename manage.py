#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lightning_server.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    print(sys.argv)
    if len(sys.argv)>1:
        if sys.argv[1] =='runserver':
            cmd = ['python', 'manage.py','scraber']
            subprocess.Popen(cmd)

    execute_from_command_line(sys.argv)
    
    if len(sys.argv)>1:
        if sys.argv[1] =='runserver':
            my_process = my_process.kill()



if __name__ == '__main__':
    main()
