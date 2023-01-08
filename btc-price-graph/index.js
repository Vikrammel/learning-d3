// coindesk API URL to get BTC price data
START_DATE="2022-01-01"
END_DATE="2023-01-01"
PRICE_API_URL = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${START_DATE}&end=${END_DATE}`

// load data from API once DOM content is loaded
document.addEventListener("DOMContentLoaded", function(event) {
    fetch(PRICE_API_URL)
    .then(function(response) {return response.json(); })
    .then(function(resp_data) {
        parsed_data = parse_api_resp(resp_data);
        drawChart(parsed_data);
    })
    .catch(function(err) {console.log(err); })
});

// parse API resp JSON
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

// draw chart using parsed API data
function drawChart(parsed_api_data) {
    // set up chart dimensions
    // TODO: experiment
    var svgWidth = 1000, svgHeight = 800;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // add a parent group tag
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top +")")

    // define x axis as a d3 time scale
    var x = d3.scaleTime()
        .rangeRound([0, width]);

    // define y axis as a d3 linear scale
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // define price line element as a d3 line
    var price_line = d3.line()
        .x(function(parsed_data_element){ return x(parsed_data_element.date) })
        .y(function(parsed_data_element){ return y(parsed_data_element.value) })

    x.domain(d3.extent(parsed_api_data, function(parsed_data_element) { return parsed_data_element.date }));
    y.domain(d3.extent(parsed_api_data, function(parsed_data_element) { return parsed_data_element.value }));

    // add child group to draw x axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    // add child group to draw y axis
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    // add child 'path' for line itself
    g.append("path")
        .datum(parsed_api_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", price_line);
}
