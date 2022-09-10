#!/usr/bin/bash

pip3 install -r requirements.txt > /dev/null
npm install --global sass > /dev/null
sass src/:src/ > /dev/null
python3 csv2table.py --input master_marketcaps_list.csv --output master_marketcaps_list.html --doctype
