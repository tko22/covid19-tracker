import { prettyDate, ema, sma } from '../utils'
import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const RANGE = 7 // 7 day moving average
const MovingAvgChart = ({ data, title }) => {
  const mavgArr = ema(data.map(day => day.new), RANGE)
  const chartData = data.map((day, index) => { return { ...day, mavg: index > RANGE ? mavgArr[index] : 0 } })
  return (
    <div className='chart-box'>
      <h3 className='chart-title'>{title}</h3>
      <ComposedChart width={600} height={300} data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey='date' />
        <YAxis dataKey='new' type='number' domain={[0, 'auto']} />

        <Bar dataKey='new' fill='#9dcbe1' dot={false} />
        <Line type='monotone' dataKey='mavg' stroke='#ff8b65' dot={false} />
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
