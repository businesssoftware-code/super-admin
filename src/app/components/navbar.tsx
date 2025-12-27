"use client";


import { Calendar, Search } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {

  const router = useRouter();
  
  const handleRedirect = () => {
    router.push("/home");
  }

  return (
    <div className='w-full h-[96px] bg-secondary flex-shrink-0 flex items-center justify-around'>
      {/* Left section: logo and home icon */}
      <div className='flex items-center justify-center gap-[25px]'>
        <div className='relative w-[141px] h-[48px] aspect-[47/16] flex-shrink-0'>
          <Image onClick={handleRedirect} alt='basil-logo' src={"/images/basilLogo.png"} fill />
        </div>
        <div className='relative w-[31px] h-[37px]'>
          <Image onClick={handleRedirect} src={"/images/home-icon-green.svg"} alt='home-icon' fill />
        </div>
      </div>

      {/* Center section: search input with icon */}
      <div className='relative'>
        <input
          placeholder='Search features'
          type="search"
          style={{
            boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)"
          }}
          className='rounded-[25px] bg-[#fff] border border-neutralBg min-w-[735px] h-[35px] placeholder:text-center text-bodyRegular outline-none text-neutralText pl-4 pr-10'
        />
        <Search
          className="absolute right-[70px] top-1/2 transform -translate-y-1/2 text-neutralText"
          size={18}
        />
      </div>

      {/* Right section: calendar and bell icon */}
      <div className='flex items-center justify-center gap-[25px]'>
        <div>
          <Calendar strokeWidth={2} className='text-primary h-[43px] w-[43px]' />
        </div>
        <div className='relative w-[30px] h-[36px]'>
          <Image src="/images/bell-icon.svg" alt='bell-icon' fill />
        </div>
      </div>
    </div>
  )
}

export default Navbar
