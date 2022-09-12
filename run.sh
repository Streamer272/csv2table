#!/usr/bin/bash

sass src/:src/ > /dev/null
python3 csv2table.py --input master_marketcaps_list.csv --output master_marketcaps_list.html --doctype
