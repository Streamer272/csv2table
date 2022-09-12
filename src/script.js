const tables = document.getElementsByClassName('table')
for (const table of tables) {
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
            const numeric = rows.some(row => !isNaN(+(document.getElementById(`data-${row.id.split('-')[1]}-${sortId}`)?.innerText ?? 'a')))

            let output = rows.sort((a, b) => {
                const aData = document.getElementById(`data-${a.id.split('-')[1]}-${sortId}`)
                const bData = document.getElementById(`data-${b.id.split('-')[1]}-${sortId}`)
                if (!aData)
                    return 1
                if (!bData)
                    return -1

                if (['asc', 'desc'].includes(sort)) {
                    if (numeric) {
                        if (isNaN(+(aData?.innerText ?? 'a')))
                            return 1
                        if (isNaN(+(bData?.innerText ?? 'a')))
                            return -1
                        return +aData.innerText - +bData.innerText
                    } else
                        return (aData?.innerText ?? '').localeCompare(bData?.innerText ?? '')
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

    const values = table.getElementsByClassName('data')
    let copiedTimeoutId = 0
    for (const value of values) {
        value.addEventListener('click', async (event) => {
            const text = value?.innerText
            if (!text)
                return

            await navigator.clipboard.writeText(text)

            const copied = document.getElementById('copied')
            copied.classList.add('active')
            copied.style.top = `${event.clientY}px`
            copied.style.left = `${event.clientX}px`

            if (copiedTimeoutId)
                clearTimeout(copiedTimeoutId)
            copiedTimeoutId = setTimeout(() => copied.classList.remove('active'), 3000)
        })
    }
}
