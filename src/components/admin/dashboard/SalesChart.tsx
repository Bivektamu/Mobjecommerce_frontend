import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
type SaleData = {
    date: Date,
    sales: number
}

type Props = {
    data: SaleData[]
}
const SalesChart = ({ data }: Props) => {

    const salesData = data.map(({ date, sales }) => {
        return { date: new Date(date).toISOString().split('T')[0], sales }
    })

    return (
        <ResponsiveContainer width="100%" height={window.innerWidth > 600 ? 400 : 300}>
            <LineChart data={salesData} >
                <CartesianGrid strokeDasharray={"1 1"} />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                />
                <YAxis
                    tick={{ fontSize: 10 }}
                />
                <Tooltip
                    contentStyle={{ fontSize: 10 }}

                />
                <Line type="monotone" dataKey="sales" stroke='rgba(99,102,241, 0.7)' strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default SalesChart