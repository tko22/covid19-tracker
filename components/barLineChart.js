import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const BarLineChart = ({ title, data, xAxis, yAxis }) => {
  return (
    <div className='chart-box'>
      <h3 className='chart-title'>{title}</h3>
      <ComposedChart width={600} height={300} data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey={xAxis} />
        <YAxis dataKey={yAxis} />

        <Bar dataKey={yAxis} fill='#413ea0' />
        <Line type='monotone' dataKey={yAxis} stroke='#eac086' dot={false} />
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

export default BarLineChart
