const url = "https://mtw-api-app-775a39b811e0.herokuapp.com/tickers/all"
const $from = document.getElementById("from")
const $to = document.getElementById("to")
const $fromC = document.getElementById("fromC")
const $toC = document.getElementById("toC")
const fromDefault = "BTC"
const toDefault = "USD"
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

const createOptions = ($el, def) => {
    for (const key in priceData) {
        const option = document.createElement("option")
        option.value = key
        option.innerText = key
        if (key === def) option.selected = true
        $el.appendChild(option)
    }
}

const prepareData = (data) => {
    const preparedData = {}
    for (const key in data) {
        preparedData[key] = {
            time: formatTimestamp(data[key].t),
            price: parseFloat(data[key].p)
        }
    }
    preparedData['USD'] = { price: 1 }
    return preparedData
}

const calculate = (src) => {
    const fromPrice = parseFloat(priceData[$from.value].price) 
    const toPrice = parseFloat(priceData[$to.value].price)
    if(src === "from") {
        $toC.value = $fromC.value * fromPrice / toPrice
    }  else {
        $fromC.value = $toC.value * toPrice / fromPrice
    }

}

fetch(url)
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        priceData = prepareData(data)
        createOptions($from, fromDefault)
        createOptions($to, toDefault)
        console.log(priceData)
        $fromC.value = 1
        calculate("from")

        $fromC.addEventListener("input", () => {
            calculate("from")
        })
        $toC.addEventListener("input", () => {
            calculate("to")
        })

        $from.addEventListener("change", () => {
            $fromC.value = 1
            calculate("from")
        })
        $to.addEventListener("change", () => {
            $fromC.value = 1
            calculate("from")
        })
        
    })