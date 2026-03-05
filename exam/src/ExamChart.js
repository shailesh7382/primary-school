import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ExamChart({ data, width = 400, height = 200 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.subject))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.score)])
      .range([innerHeight, 0]);

    const bars = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => margin.left + xScale(d.subject))
      .attr('y', d => margin.top + yScale(d.score))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.score))
      .attr('fill', '#3b82f6');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('text')
      .attr('transform', `translate(${innerWidth / 2 + margin.left}, ${height - 10})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Subjects');

    svg.append('text')
      .attr('transform', `translate(${margin.left / 2}, ${innerHeight / 2 + margin.top}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Score (%)');
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default ExamChart;