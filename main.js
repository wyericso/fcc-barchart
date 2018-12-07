const w = 800;
const h = 400;
const padding = 40;
const tooltipWidth = 100;

const svg = d3.select('body')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('viewBox', '0 0 ' + w + ' ' + h);

svg.append('title')
    .attr('id', 'title')
    .text('GDP of United States');

svg.append('text')
    .text('GDP of United States')
    .attr('transform', 'translate(' + w / 2 + ', ' + padding + ')')
    .attr('text-anchor', 'middle');

const Http = new XMLHttpRequest();
const url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
Http.open("GET", url);
Http.send();
Http.onload = function() {
    const dataset = JSON.parse(Http.responseText).data;

    const parseTime = d3.timeParse('%Y-%m-%d');
    const xScale = d3.scaleTime()
                    .domain([d3.min(dataset, (d) => parseTime(d[0])), d3.max(dataset, (d) => parseTime(d[0]))])
                    .range([padding, w - padding - tooltipWidth]);

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[1])])
                    .range([h - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
        .call(xAxis);
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr('x', (d) => xScale(parseTime(d[0])))
        .attr('y', (d) => yScale(d[1]))
        .attr('width', (w - padding * 2) / dataset.length)
        .attr('height', (d) => (h - padding) - yScale(d[1]))
        .on('mouseover', function(d) {
            const dataDate = d[0];
            d3.select(this)
                .attr('fill', '#33adff');
            svg.append('rect')
                .attr('id', 'tooltip')
                .attr('data-date', dataDate)
                .attr('x', xScale(parseTime(d[0])) + 20)
                .attr('y', h * 0.7)
                .attr('rx', 10)
                .attr('width', tooltipWidth)
                .attr('height', 60)
                .attr('fill', '#33adff')
                .attr('opacity', 0.85);
            svg.append('text')
                .attr('id', 'date')
                .attr('text-anchor', 'middle')
                .attr('x', xScale(parseTime(d[0])) + 20 + tooltipWidth / 2)
                .attr('y', h * 0.7 + 25)
                .text(d[0]);
            svg.append('text')
                .attr('id', 'gdp')
                .attr('text-anchor', 'middle')
                .attr('x', xScale(parseTime(d[0])) + 20 + tooltipWidth / 2)
                .attr('y', h * 0.7 + 45)
                .text('$ ' + d[1] + ' Bn');
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('fill', 'black');
            svg.select('#tooltip')
                .remove();
            svg.select('#date')
                .remove();
            svg.select('#gdp')
                .remove();
        });
};
