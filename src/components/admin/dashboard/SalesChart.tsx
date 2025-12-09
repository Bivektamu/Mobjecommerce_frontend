import { useEffect, useLayoutEffect, useRef } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// const data = [
//     { date: "2025-09-01", sales: 320, orders: 5 },
//     { date: "2025-09-02", sales: 450, orders: 7 },
//     { date: "2025-09-03", sales: 180, orders: 3 },
//     { date: "2025-09-04", sales: 520, orders: 8 },
//     { date: "2025-09-05", sales: 290, orders: 4 },
//     { date: "2025-09-06", sales: 610, orders: 9 },
//     { date: "2025-09-07", sales: 410, orders: 6 },
//     { date: "2025-09-08", sales: 340, orders: 5 },
//     { date: "2025-09-09", sales: 480, orders: 7 },
//     { date: "2025-09-10", sales: 200, orders: 3 },
//     { date: "2025-09-11", sales: 560, orders: 8 },
//     { date: "2025-09-12", sales: 370, orders: 6 },
//     { date: "2025-09-13", sales: 630, orders: 9 },
//     { date: "2025-09-14", sales: 310, orders: 4 },
//     { date: "2025-09-15", sales: 720, orders: 11 },
//     { date: "2025-09-16", sales: 280, orders: 4 },
//     { date: "2025-09-17", sales: 450, orders: 7 },
//     { date: "2025-09-18", sales: 510, orders: 8 },
//     { date: "2025-09-19", sales: 600, orders: 10 },
//     { date: "2025-09-20", sales: 330, orders: 5 },
//     { date: "2025-09-21", sales: 700, orders: 11 },
//     { date: "2025-09-22", sales: 400, orders: 6 },
//     { date: "2025-09-23", sales: 520, orders: 8 },
//     { date: "2025-09-24", sales: 180, orders: 3 },
//     { date: "2025-09-25", sales: 460, orders: 7 },
//     { date: "2025-09-26", sales: 590, orders: 9 },
//     { date: "2025-09-27", sales: 310, orders: 4 },
//     { date: "2025-09-28", sales: 640, orders: 10 },
//     { date: "2025-09-29", sales: 380, orders: 6 },
//     { date: "2025-09-30", sales: 750, orders: 12 }
// ];

type SaleData = {
    date: Date,
    sales: number
}

type Props = {
    data: SaleData[]
}
const SalesChart = ({ data }: Props) => {


    useLayoutEffect(()=> {
        console.log(window.innerWidth)
    }, [])

    const salesData = data.map(({date, sales}) => {
        return { date:new Date(date).toISOString().split('T')[0], sales }
    }

    )

    return (
        <ResponsiveContainer width="100%" height={window.innerWidth > 600?400:300}>
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