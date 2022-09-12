import csv
import logging
import click
import dominate
from dominate.tags import *


@click.command()
@click.option('-i', '--input', default='data.csv', help='Input csv file')
@click.option('-o', '--output', default='output.html', help='Output html file')
@click.option('-d/-nd', '--doctype/--no-doctype', default=False, help='Wrap the table with doctype')
def main(input, output, doctype):
    logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(asctime)s - %(message)s', datefmt='%H:%M:%S %m/%d/%Y')

    logging.info('Opening files')

    try:
        csv_file = open(input, 'r')
        html_file = open(output, 'w')
        js_file = open('src/script.js', 'r')
        css_file = open('src/style.css', 'r')
    except Exception:
        logging.error('Exception occurred', exc_info=True)
        return

    html_table = table(_class='table')
    with html_table:
        first = True
        csv_reader = csv.reader(csv_file)
        row_count = 0
        for row in csv_reader:
            if row[0] == 'Timestamp':
                continue

            html_row = tr() if first else tr(_class='row', _id=f'row-{row_count}')

            value_count = 0
            for value in row:
                try:
                    number = float(value) if '.' in value else int(value)
                    value = f'{number:,}'
                except ValueError:
                    pass
                html_row += th(value, _class='header', _id=f'header-{row_count}-{value_count}') if first else td(value, _class='data', _id=f'data-{row_count}-{value_count}')
                value_count += 1

            if not first:
                row_count += 1

            if first:
                first = False

            print(f'\r{row_count} rows added', end='')
        print('')

    copied_div = div(_class='copied', _id='copied')
    with copied_div:
        p('Copied to clipboard!')

    logging.info('Exporting HTML')
    html_file.write(str(html_table))
    html_file.write(str(copied_div))
    logging.info('Exported JS')
    html_file.write(f'\n<script>\n{js_file.read()}</script>')
    logging.info('Exported CSS')
    html_file.write(f'\n<style>\n{css_file.read()}</style>')

    logging.info('Closing files')

    try:
        csv_file.close()
        html_file.close()
        js_file.close()
        css_file.close()
    except Exception:
        logging.error('Exception occurred', exc_info=True)

    logging.info("Operation successful")


if __name__ == '__main__':
    main()
