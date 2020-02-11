import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function BarChart(props) {
  const { height, width, margin, data } = props;

  //create a svg reference for d3 to prevent conflicts
  let svgRef = useRef(null);

  //draw the chart
  const draw = () => {
    const svg = d3
      .select(svgRef.current)
      .style("width", width)
      .style("heigth", height);

    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const t = g.transition().duration(1500);

    const x = d3
      .scaleBand()
      .range([0, width - margin.left - margin.right]) //range is the pixelsize of the svg element for said axis
      .domain(data.map(x => x.name)) //domain is the range of values from the data
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .range([height - margin.top - margin.bottom, 0])
      .domain([0, d3.max(data.map(fruit => fruit.value))]);

    //prettier-ignore
    const bars = g
      .selectAll("UltimateBarChart")
      .data(data)
      .join("rect")
      .attr("x", d => {return x(d.name)})
      .attr("y", d => {return y(0)})
      .attr("width", x.bandwidth())
      .attr("height", d => {return (height - y(0)-40)})
      .attr("fill","cadetblue")

    const xAxis = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (height - margin.bottom) + ")"
      )
      .transition()
      .duration(250)
      .call(d3.axisBottom(x));

    //prettier-ignore
    const barAnimation = d3
      .selectAll("rect")
      .transition()
      .duration(500)
      .attr("y", d => { return y(d.value) - 40;})
      .attr("height", d => { return height - y(d.value);});

    // xAxis2.transition().duration(1000);
  };

  //React magic!
  useEffect(() => {
    draw();
    return () => {
      d3.selectAll("g").remove();
    };
  });

  return (
    <div>
      <h3>BarChart</h3>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
}

export default BarChart;