import { Address } from '../../store/types'

interface Props {
    address: Address
}

const AddressItem = ({ address }: Props) => {
    const {  building, label, street, city, postcode, country, state } = address
    return (
        <div className='flex justify-between items-start border p-4 rounded shadow gap-6'>
            <div>
                <div className="flex gap-4 mb-4">
                    <span className='font-semibold block capitalize '>{label}</span>
                   {
                    address.setAsDefault && <span className='text-xs  border-[1px] bg-slate justify-center  py-1 px-4 text-slate-400 rounded-full'>Default</span>
                   }
                    
                </div>
                {building && <p>{building}</p>}
                <p className='text-sm'>
                    {street}<br />
                    {city}, {state}, {postcode}<br />
                    {country}</p>
            </div>
            <div className='flex gap-4'>
                <button className='md:text-sm text-xs  border-[1px] border-black justify-center flex items-center rounded py-1 px-4'>Edit</button>
                <button className='md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4 text-white'>Delete</button>
            </div>

        </div>
    )
}


export default AddressItem