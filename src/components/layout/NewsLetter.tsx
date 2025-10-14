import { Link } from 'react-router-dom'

const NewsLetter = () => {
    return (

        <section id="newsletter" className='px-4'>
            <div className="container flex flex-wrap gap-8 justify-between items-center mx-auto md:py-14 py-6">
                <div className="flex flex-col items-start ">
                    <h1 className='mb-4 text-2xl md:text-4xl font-semibold'>Join Our Newsletter</h1>
                    <p className='text-xs md:text-base text-slate-600'>We love to surprise our subscribers with occasional&nbsp;gifts.</p>
                </div>

                <div className="flex gap-x-4 ">
                    <div className='relative'>
                        <input type='text' readOnly className='text-black py-2 px-4 rounded cursor-pointer border-slate-400 border-[1px] text-sm text-left outline-none ' value={''} placeholder='Your email address' />
                    </div>

                    <Link to="/admin/products/add" className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm'>Subscribe</Link>
                </div>
            </div>
        </section>
    )
}

export default NewsLetter