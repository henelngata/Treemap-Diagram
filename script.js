const dataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

// Fetch data and create visualization
d3.json(dataUrl).then(data => {
    const width = 960;
    const height = 570;

    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root);

    const color = d3.scaleOrdinal()
        .domain(data.children.map(d => d.name))
        .range(d3.schemeCategory10);

    const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    cell.append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.category))
        .on('mousemove', showTooltip)
        .on('mouseout', hideTooltip);

    cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text(d => d);

    // Create legend
    const categories = root.leaves().map(nodes => nodes.data.category);
    const uniqueCategories = [...new Set(categories)];

    const legend = d3.select('#legend')
        .append('svg')
        .attr('width', 500)
        .attr('height', 50)
        .selectAll('g')
        .data(uniqueCategories)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(${i * 60}, 0)`);

    legend.append('rect')
        .attr('class', 'legend-item')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', d => color(d));

    legend.append('text')
        .attr('x', 25)
        .attr('y', 15)
        .text(d => d);

    function showTooltip(event, d) {
        const tooltip = d3.select('#tooltip')
            .style('display', 'block')
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 'px')
            .attr('data-value', d.data.value);

        tooltip.html(`
            Name: ${d.data.name}<br>
            Category: ${d.data.category}<br>
            Value: $${d.data.value.toLocaleString()}
        `);
    }

    function hideTooltip() {
        d3.select('#tooltip').style('display', 'none');
    }
});
