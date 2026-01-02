import { Colour, User, Order, Order_Status, Product, Review, Size } from './store/types'

type Data = {
    products: Product[],
    orders: Order[],
    users: User[],
    reviews: Review[]
}

const data: Data =
{
    products:
        [
            {
                id: 'product1',
                title: 'Sleek and Cozy Black',
                sku: 'WVT002',
                price: 67,
                category: 'hoodies',
                slug: 'sleek-and-cozy-black',
                colors: [Colour.BLACK, Colour.RED],
                stockStatus: true,
                sizes: [Size.SMALL, Size.MEDIUM],
                quantity: 10000,
                description: 'Our Sleek and Cozy Black Hoodie bridges the gap between casual comfort and streetwise style. Engineered for those who seek a cozy layer without sacrificing their urban aesthetic, this hoodie is a versatile staple that can take you from lounging to out-and-about with ease.',
                featured: true,
                imgs: [
                    {
                        id: 'img1',
                        fileName: '',
                        url: 'https://zwgxcetfcxbhggokckkn.supabase.co/storage/v1/object/public/ecommerce/sleek-cozy-black.png'
                    }
                ]

            },
        ],
    orders: [
        {
            id: 'order1',
            orderNumber: 123123123123,
            total: 223,
            subTotal: 211,
            tax: 23,
            shippingAddress: {
                street: '32b hinton loop',
                city: 'sydney',
                postcode: '2570',
                state: 'nsw',
                country: 'Australia'
            },
            userId: 'user1',
            createdAt: new Date,
            items: [
                {
                    id: 'order1',
                    productId: 'product1',
                    quantity: 3,
                    size: Size.SMALL,
                    color: Colour.BLACK,
                    price: 22,
                    imgUrl: 'https://zwgxcetfcxbhggokckkn.supabase.co/storage/v1/object/public/ecommerce/sleek-cozy-black.png',
                },
            ],
            status: Order_Status.COMPLETED

        },
    ],
    users: [
        {
            id: 'user1',
            firstName: 'Bivek',
            lastName: 'Gurung',
            email: 'bivek.tamu@gmail.com',
            address: {
                street: '32b hinton loop',
                city: 'sydney',
                postcode: '2570',
                state: 'nsw',
                country: 'Australia'
            },
            isActive: true,
            isVerified: false,
            registeredDate: new Date,
        },
    ],
    reviews: [
        {
            id: 'review1',
            userId: 'user1',
            productId: 'product1',
            review: 'Great product! Great product! Great product! Great product! Great product! Great product! Great product! Great product! Great product!',
            createdAt: new Date,
            rating: 2
        }
    ]

}
export default data