import { prettyDate, ema, sma } from '../utils'
import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const MovingAvgChart = ({ data, title }) => {
  const mavgArr = ema(data.map(day => day.new), 5)
  const chartData = data.map((day, index) => { return { ...day, mavg: index > 5 ? mavgArr[index] : 0 } })
  return (
    <div className='chart-box'>
      <h3 className='chart-title'>{title}</h3>
      <ComposedChart width={600} height={300} data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey='date' />
        <YAxis dataKey='new' />

        <Bar dataKey='new' fill='#413ea0' dot={false} />
        <Line type='monotone' dataKey='mavg' stroke='#ff8b65' />
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

export default MovingAvgChart
