import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const LINE_COLORS = ["#8884d8", "#eac086", "#00999e", "#dbbaba"]

// xLog - xAxis on logarithmic scale. yLog same for yAxis
// yAxis - array holding different data point keys. # of lines is the length of the array
const MultiLineChart = ({ title, data, xAxis, yAxis = [], xScale = "auto", yScale = "auto" }) => {
  return (
    <div className='chart-box'>
      <h3 className='chart-title'>{title}</h3>
      <ComposedChart width={600} height={300} data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey={xAxis} scale={xScale} domain={['auto', 'auto']} />
        <YAxis dataKey={yAxis[0]} scale={yScale} domain={[0, 'dataMax']} />
        {yAxis.map((yKey, idx) => (
          <Line key={idx} type='monotone' dataKey={yKey} stroke={LINE_COLORS[idx]} dot={false} />
        ))}
        <Tooltip />

      </ComposedChart>

      <style jsx>{`
        .chart-box {
          font-size: 12px;
        }
        .chart-title {
          padding-left: 10px;
        }
      `}
      </style>
    </div>
  )
}

export default MultiLineChart
