#!/bin/bash

# find venv and run
VENV=`find . -type d -name '*venv*'`
echo $VENV
source $VENV/bin/activate

# run django server port 8080
CMD="python3 manage.py runserver"
$CMD &
