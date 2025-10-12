import { Link } from 'react-router-dom'
import Arrow from '../ui/Arrow'
import HeroImg from '../../assets/hero.png'

const Hero = () => {
    return (
        <section id="hero" className='bg-regal-white px-4'>
            <div className="container flex justify-between items-center mx-auto">
                <div className="flex flex-col items-start py-32 ">
                    <h1 className='mb-4 text-4xl font-semibold'>Fresh Arrivals Online</h1>
                    <span className='mb-14'>Discover Our Newest Collection Today.</span>
                    <Link to="/collections" className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm flex gap-x-2 items-center'>View Collection <Arrow /></Link>
                </div>
                <img src={HeroImg} alt="" className='self-end' />
            </div>
        </section>
    )
}

export default Hero