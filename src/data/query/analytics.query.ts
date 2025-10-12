import { gql } from "@apollo/client";

export const GET_ORDER_ANALYTICS = gql`
    query OrderAnalytics {
        orderAnalytics {
            orders
            changeInOrders
        }
    }
`

export const GET_SALES_ANALYTICS = gql`
    query SalesAnalytics {
        salesAnalytics {
            sales
            changeInSales
        }
    }
`


export const GET_USERS_ANALYTICS = gql`
    query UserAnalytics {
        userAnalytics {
            users
            changeInUsers
        }
    }
`

export const GET_LOW_STOCK_PRODUCTS = gql`
    query LowStockProducts {
        lowStockProducts {
            _id
            title
            quantity
            heroImg
            sku
        }
    }
`

export const GET_SALES_OVER_TIME = gql`
    query SalesOverTime {
        salesOverTime {
            date
            sales
        }
    }
`

export const GET_ORDERS_BY_CATEGORY = gql`
    query OrdersByCategory {
        ordersByCategory {
            
            count
            category
        }
    }
`