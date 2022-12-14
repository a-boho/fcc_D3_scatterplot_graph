let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()

// let data
let values = []

// let heightScale
let xScale
let yScale

let xAxisScale
let yAxisScale

let width = 1200
let height = 800
let padding = 60

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    // let timesArray = values.map((item) => {
    //     return item.Time
    // })

    // console.log(timesArray)

    // let datesArray = values.map((item) => {
    //     return item.Year
    // })

    // console.log(datesArray)

    // heightScale = d3.scaleTime()
    //                 .domain([d3.min(timesArray), d3.max(timesArray)])
    //                 .range([0, height - (2 * padding)])
    // console.log(heightScale)

    xScale = d3.scaleLinear()
               .domain([d3.min(values, (item) => {
                    return item['Year']
               }) - 1, d3.max(values, (item) => {
                    return item['Year']
               }) + 1])
               .range([padding, width - padding])

    yScale = d3.scaleTime()
               .domain([d3.min(values, (item) => {
                    return new Date((item['Seconds'] - 5) * 1000)
               }), d3.max(values, (item) => {
                    return new Date((item['Seconds'] + 5) * 1000)
               })])
               .range([padding, height - padding])

    // xAxisScale = d3.scaleLinear().range([0, width])
                //    .domain([d3.min(datesArray), d3.max(datesArray)])
                //    .range([padding, width - padding])

    // yAxisScale = d3.scaleTime().range([0, height])
                //    .domain([d3.min(timesArray), d3.max(timesArray)])
                //    .range([height - padding, padding])
}

let drawPoints = () => {
    
    svg.selectAll('circle')
       .data(values)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('r', '5')
       .attr('data-xvalue', (item) => {
           return item['Year']
       })
       .attr('data-yvalue', (item) => {
           return new Date(item['Seconds'] * 1000)
       })
       .attr('cx', (item) => {
           return xScale(item['Year'])
       })
       .attr('cy', (item) => {
           return yScale(item['Seconds'] * 1000)
       })
       .attr('fill', (item) => {
           if(item['Doping'] != '') {
                return 'orange'
           } else {
                return 'lightgreen'
           }
       })
       .on('mouseover', (event, item) => {
           tooltip.transition()
                  .style('visibility', 'visible')
        if(item['Doping'] != '') {
            tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
        }
        else {
            tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
        }

        tooltip.attr('data-year', item['Year'])
       })
       .on('mouseout', (event, item) => {
            tooltip.transition()
                   .style('visibility', 'hidden')
       })
}

let generateAxes = () => {

        // let timeFormat = d3.timeFormat('%M:%S')

        let xAxis = d3.axisBottom(xScale)
                      .tickFormat(d3.format('d'))

        let yAxis = d3.axisLeft(yScale)
                      .tickFormat(d3.timeFormat('%M:%S'))

        svg.append('g')
           .call(xAxis)
           .attr('id', 'x-axis')
           .attr('transform', 'translate(0, ' + (height - padding) + ')')

        svg.append('g')
           .call(yAxis)
           .attr('id', 'y-axis')
           .attr('transform', 'translate(' + padding + ', 0)')
}

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    // console.log(data[0].Time)

    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
}
req.send()


