const url = "https://api.mtw-testnet.com/tickers/all"
let priceData = {}

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000) // Convert to milliseconds

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed

    return `${hours}:${minutes}:${seconds} ${day}/${month}`
}
const prepareData = (data) => {
    const preparedData = {}
    for (const key in data) {
        preparedData[key] = {
            time: formatTimestamp(data[key].t),
            price: parseFloat(data[key].p),
            change: parseFloat(data[key].c)
        }
    }
    return preparedData
}

const createTable = (data) => {
    const table = document.getElementById('price-table')
    for (const key in data) {
        createRow(table,data,key)        
    }
}

const createRow = (table,data,key) => {
    const row = table.insertRow()
        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        cell1.innerHTML = '<b>' + key + '</b>'
        cell2.innerHTML = data[key].price
        const color= data[key].change > 0 ? 'green' : 'red'
        cell3.innerHTML = '<b class="text-' + color + '-500">' + data[key].change + '</b>'
}

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        priceData = prepareData(data)    
        createTable(priceData)    
    })