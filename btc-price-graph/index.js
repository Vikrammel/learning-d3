// coindesk API URL to get BTC price data
START_DATE="2022-01-01"
END_DATE="2023-01-01"
PRICE_API_URL = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${START_DATE}&end=${END_DATE}`

// load data from API once DOM content is loaded
document.addEventListener("DOMContentLoaded", function(event) {
    fetch(PRICE_API_URL)
    .then(function(response) {return response.json(); })
    .then(function(resp_data) {
        parsed_data = parse_api_resp(resp_data)
        console.log(parsed_data);
    })
    .catch(function(err) {console.log(err); })
});

function parse_api_resp(api_resp_json) {
    parsed_data = []
    bpi_data = api_resp_json.bpi
    for (var date in bpi_data) {
        parsed_data.push({
            date: new Date(date),
            value: +bpi_data[date] // convert to number
        });
    }
    return parsed_data;
}
