const tables = document.getElementsByClassName('table')
for (const table of tables) {
    const root = document.getElementById('root')
    const rows = Array.prototype.slice.call(table.children[0].getElementsByClassName('row'))

    const headers = table.getElementsByClassName('header')
    for (const header of headers) {
        header.addEventListener('click', () => {
            let sort;
            switch (header.getAttribute('data-sort')) {
                case 'asc':
                    sort = 'desc'
                    header.classList.remove('asc')
                    header.classList.add('desc')
                    header.setAttribute('data-sort', 'desc')
                    break
                case 'desc':
                    sort = null
                    header.classList.remove('asc', 'desc')
                    header.setAttribute('data-sort', 'null')
                    break
                default:
                    sort = 'asc'
                    header.classList.add('asc')
                    header.setAttribute('data-sort', 'asc')
            }
            for (const h of headers) {
                if (h !== header) {
                    h.setAttribute('data-sort', null)
                    h.classList.remove('asc', 'desc')
                }
            }

            const sortId = +header.id.split('-')[2]
            const numericRegex = /[,.0-9]*/g
            const convertToSortable = (str) => (str ?? 'a').match(numericRegex).join('') === str ? str.replaceAll(',', '') : str
            const numeric = rows.some(row => !isNaN(+convertToSortable(document.getElementById(`data-${row.id.split('-')[1]}-${sortId}`)?.innerText ?? 'a')))

            let output = rows.sort((a, b) => {
                const aData = document.getElementById(`data-${a.id.split('-')[1]}-${sortId}`)
                const bData = document.getElementById(`data-${b.id.split('-')[1]}-${sortId}`)
                if (!aData)
                    return 1
                if (!bData)
                    return -1

                const aText = convertToSortable(aData?.innerText)
                const bText = convertToSortable(bData?.innerText)

                if (['asc', 'desc'].includes(sort)) {
                    if (numeric) {
                        if (isNaN(+(aText ?? 'a')))
                            return 1
                        if (isNaN(+(bText ?? 'a')))
                            return -1
                        return +aText - +bText
                    } else
                        return (aText ?? '').localeCompare(bText ?? '')
                }
                else {
                    const aRowId = +aData.id.split('-')[1]
                    const aDataId = +aData.id.split('-')[2]
                    const bRowId = +bData.id.split('-')[1]
                    const bDataId = +bData.id.split('-')[2]
                    if (aRowId !== bRowId)
                        return aRowId - bRowId
                    else
                        return aDataId - bDataId
                }
            })

            if (sort === 'desc') {
                output = output.reverse()
                output.filter(row => document.getElementById(`data-${row.id.split('-')[1]}-${sortId}`)?.innerText === 'None').map(row => {
                    output.splice(output.indexOf(row), 1)
                    output.push(row)
                })
            }

            for (const row of rows)
                table.children[0].removeChild(row)
            for (const row of output)
                table.children[0].appendChild(row)
        })
    }

    const copy = document.getElementById('copy')
    let copyAllowed = false
    copy.addEventListener('click', () => {
        if (copyAllowed)
            return

        copyAllowed = true
        root.classList.add('copying')
    })

    const values = table.getElementsByClassName('data')
    let copiedTimeoutId = 0
    for (const value of values) {
        value.addEventListener('click', async (event) => {
            if (!copyAllowed)
                return

            copyAllowed = false
            root.classList.remove('copying')

            const text = value?.innerText
            if (!text)
                return

            await navigator.clipboard.writeText(text)

            const copied = document.getElementById('copied')
            copied.classList.add('active')
            copied.style.top = `${event.clientY + window.scrollY}px`
            copied.style.left = `${event.clientX + window.scrollX}px`

            if (copiedTimeoutId)
                clearTimeout(copiedTimeoutId)
            copiedTimeoutId = setTimeout(() => copied.classList.remove('active'), 3000)
        })
    }
}
