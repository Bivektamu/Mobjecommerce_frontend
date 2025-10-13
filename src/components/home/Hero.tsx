import { Link } from 'react-router-dom'
import Arrow from '../ui/Arrow'
import HeroImg from '../../assets/hero.png'

const Hero = () => {
    return (
        <section id="hero" className='bg-regal-white px-4 overflow-hidden relative'>
            <div className="container flex justify-between mx-auto pb-[200px] pt-[40px] md:pb-0 md:pt-0">
                <div className="flex flex-col items-start md:py-32">
                    <h1 className='mb-4 text-2xl md:text-4xl font-semibold'>Fresh Arrivals Online</h1>
                    <span className='mb-4 md:mb-14 text-xs md:text-base'>Discover Our Newest Collection Today.</span>
                    <Link to="/collections" className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-xs md:text-sm flex gap-x-2 items-center'>View Collection <Arrow /></Link>
                </div>
                <img src={HeroImg} alt="" className='self-end w-1/2 md:w-auto absolute md:static right-0 bottom-0' />
            </div>
        </section>
    )
}

export default Hero