#!/bin/sh

echo "${0}: Prepere server" 
python manage.py migrate --no-input 
python manage.py initadmin 
python manage.py loaddata db.json 
echo "${0}: Server is ready" 