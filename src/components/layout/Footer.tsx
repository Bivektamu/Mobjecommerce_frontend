import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import GithubIcon from '../ui/GithubIcon'
import InstagramIcon from '../ui/InstagramIcon'
import YoutubeIcon from '../ui/YoutubeIcon'

const Footer = () => {
  return (
    <footer>
      <section id="footer" className='bg-white px-4'>
        <div className="container flex flex-wrap justify-between items-start mx-auto py-14 gap-8">
          <div className="flex flex-col gap-8 ">
            <Link to='/'><Logo /></Link>
            <p className='text-slate-600 max-w-[300px]'>DevCut is a YouTube channel for practical project-based learning.</p>
            <div className="flex gap-4">
              <Link to=''><GithubIcon /></Link>
              <Link to=''><InstagramIcon /></Link>
              <Link to=''><YoutubeIcon /></Link>
            </div>
          </div>

          <div className="flex justify-center gap-8 md:gap-16">
            <div className='flex flex-col gap-2 md:gap-6 text-xs md:text-base'>
              <p className="text-slate-500 uppercase mb-4 md:mb-6 font-medium">support</p>
              <Link to='' className=''>FAQ</Link>
              <Link to='' className=''>Terms of use</Link>
              <Link to='' className=''>Privacy Policy</Link>
            </div>

            <div className='flex flex-col gap-2 md:gap-6 text-xs md:text-base'>
              <p className="text-slate-500 uppercase mb-4 md:mb-6 font-medium">COMPANY</p>
              <Link to='' className=''>About us</Link>
              <Link to='' className=''>Contact</Link>
              <Link to='' className=''>Careers</Link>
            </div>

            <div className='flex flex-col gap-2 md:gap-6 text-xs md:text-base'>
              <p className="text-slate-500 uppercase mb-4 md:mb-6 font-medium">SHOP</p>
              <Link to='' className=''>My Account</Link>
              <Link to='' className=''>Checkout</Link>
              <Link to='' className=''>Cart</Link>
            </div>
          </div>

          <div className="">
            <p className="text-slate-500 uppercase mb-4 md:mb-12 font-medium">ACCEPTED PAYMENTS</p>
            <svg width="185" height="40" viewBox="0 0 185 40" fill="none" xmlns="http://www.w3.org/2000/svg" className='grayscale'>
              <g opacity="0.8" filter="url(#filter0_d_5507_350)">
                <g clipPath="url(#clip0_5507_350)">
                  <path d="M19.017 22.85C17.3637 24.2432 15.27 25.005 13.108 25C8.078 25 4 20.97 4 16C4 11.03 8.078 7.00002 13.108 7.00002C15.363 7.00002 17.426 7.81002 19.017 9.15002C20.67 7.75705 22.7633 6.99526 24.925 7.00002C29.955 7.00002 34.033 11.03 34.033 16C34.033 20.97 29.955 25 24.925 25C22.7633 25.0048 20.67 24.243 19.017 22.85Z" fill="#ED0006" />
                  <path d="M19.017 22.85C20.0186 22.0115 20.8242 20.9636 21.377 19.7801C21.9299 18.5966 22.2166 17.3063 22.217 16C22.217 13.257 20.975 10.8 19.017 9.15002C20.67 7.75705 22.7633 6.99526 24.925 7.00002C29.955 7.00002 34.033 11.03 34.033 16C34.033 20.97 29.955 25 24.925 25C22.7633 25.0048 20.67 24.243 19.017 22.85Z" fill="#F9A000" />
                  <path d="M19.017 22.85C20.975 21.2 22.217 18.743 22.217 16C22.217 13.257 20.975 10.8 19.017 9.15002C18.0154 9.98856 17.2098 11.0365 16.657 12.22C16.1041 13.4035 15.8174 14.6938 15.817 16C15.817 18.743 17.058 21.2 19.017 22.85Z" fill="#FF5E00" />
                </g>
                <path fillRule="evenodd" clipRule="evenodd" d="M68.224 10L63.033 21.826H69.248L70.018 19.941H71.779L72.55 21.827H79.39V20.387L80 21.827H83.54L84.149 20.357V21.827H98.376L100.106 19.99L101.726 21.827L109.033 21.842L103.825 15.946L109.033 10H101.839L100.155 11.803L98.586 10H83.109L81.779 13.053L80.42 10H74.219V11.39L73.529 10H68.226H68.224ZM69.427 11.68H72.457L75.9 19.699V11.679H79.219L81.879 17.429L84.329 11.679H87.633V20.166H85.623L85.607 13.516L82.677 20.166H80.88L77.935 13.516V20.166H73.801L73.018 18.263H68.783L68.001 20.164H65.787L69.427 11.679V11.68ZM97.64 11.68H89.47V20.16H97.513L100.106 17.35L102.605 20.16H105.217L101.42 15.945L105.217 11.679H102.718L100.138 14.458L97.64 11.679V11.68ZM70.9 13.115L69.506 16.505H72.294L70.901 13.115H70.9ZM91.487 14.985V13.435H96.585L98.809 15.912L96.486 18.404H91.487V16.712H95.944V14.986H91.487V14.985Z" fill="#016FD0" />
                <g clipPath="url(#clip1_5507_350)">
                  <path d="M165.515 9.00008C166.56 8.99548 167.596 9.19135 168.567 9.57708L168.104 12.5031L167.796 12.3601C167.003 11.9927 166.136 11.8147 165.262 11.8401C163.919 11.8401 163.316 12.4311 163.302 13.0081C163.302 13.6431 164.032 14.0611 165.222 14.6811C167.182 15.6471 168.09 16.8291 168.077 18.3711C168.049 21.1841 165.725 23.0001 162.155 23.0001C160.629 22.9851 159.159 22.6531 158.361 22.2791L158.837 19.2361L159.285 19.4531C160.391 19.9581 161.119 20.1731 162.477 20.1731C163.457 20.1731 164.507 19.7551 164.52 18.8481C164.52 18.2561 164.073 17.8241 162.757 17.1601C161.469 16.5111 159.747 15.4301 159.775 13.4841C159.789 10.8451 162.155 9.00008 165.515 9.00008ZM152.831 22.7981H156.233L158.361 9.24608H154.959L152.831 22.7981Z" fill="#00579F" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M177.288 9.24608H174.657C173.845 9.24608 173.229 9.49108 172.878 10.3701L167.825 22.7981H171.395L172.109 20.7651H176.477C176.575 21.2411 176.883 22.7981 176.883 22.7981H180.033L177.288 9.24608ZM173.088 17.9961L174.448 14.2061C174.441 14.2161 174.486 14.0901 174.552 13.9011C174.65 13.6211 174.795 13.2081 174.895 12.9081L175.132 14.0751C175.132 14.0751 175.777 17.3191 175.917 17.9971H173.089L173.088 17.9961Z" fill="#00579F" />
                  <path d="M146.657 18.4871L149.989 9.24608H153.587L148.239 22.7841H144.641L141.589 10.9321C143.745 12.1001 145.677 14.4501 146.293 16.6121L146.657 18.4871Z" fill="#00579F" />
                  <path d="M143.563 9.24608H138.089L138.033 9.51908C142.303 10.6441 145.131 13.3551 146.293 16.6131L145.103 10.3851C144.907 9.51908 144.305 9.27508 143.563 9.24508V9.24608Z" fill="#FAA61A" />
                </g>
              </g>
              <defs>
                <filter id="filter0_d_5507_350" x="0" y="0" width="184.066" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5507_350" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5507_350" result="shape" />
                </filter>
                <clipPath id="clip0_5507_350">
                  <rect width="30.033" height="32" fill="white" transform="translate(4)" />
                </clipPath>
                <clipPath id="clip1_5507_350">
                  <rect width="42" height="32.0001" fill="white" transform="translate(138.033)" />
                </clipPath>
              </defs>
            </svg>

          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer