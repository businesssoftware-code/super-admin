'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import LoginComponent from '@/app/components/login-component'
import useAuthStore from '@/app/libs/store/auth'
import { useRouter } from 'next/navigation'

const Page = () => {
  const controls = useAnimation()
  const textControls = useAnimation()
  const kioskmanControls = useAnimation()
  const loginControls = useAnimation();
  const router = useRouter();

    const {userAuthData} = useAuthStore();

  useEffect(()=>{

     if (userAuthData?.accessToken) {
      router.push('/home');
     } 

  },[userAuthData?.accessToken, router]);


  useEffect(() => {
    const sequence = async () => {
      await Promise.all([
        controls.start({
          scale: 0.7,
          y: -40,
          transition: { duration: 1, ease: 'easeOut', delay: 1 },
        }),
        textControls.start({
          scale: 0.7,
          y: -180,
          transition: { duration: 1, ease: 'easeOut', delay: 1 },
        }),
        kioskmanControls.start({
          opacity: 1,
          transition: { duration: 1, ease: 'easeOut', delay: 1 },
        }),
      ])

      await Promise.all([
        controls.start({
          opacity: 0,
          transition: { duration: 1, ease: 'easeOut', delay: 0.3 },
        }),
        textControls.start({
          opacity: 0,
          transition: { duration: 1, ease: 'easeOut', delay: 0.3 },
        }),
      ])

      await loginControls.start({
        opacity: 1,
        transition: { duration: 1, ease: 'easeOut' },
      })
    }

    sequence()
  }, [controls, textControls, kioskmanControls, loginControls])

  return (
    <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden">
      {/* Animated background bar */}
      <motion.div
        initial={{ height: '100vh' }}
        animate={{ height: '10vh' }}
        transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
        className="absolute top-0 left-0 w-full z-10 bg-secondary"
      />

      {/* LoginComponent (hidden initially, shown after animation) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loginControls}
        className="absolute inset-0 flex items-center justify-center z-50"
      >        
    <LoginComponent />
      </motion.div>

      {/* Logo and tomatoes */}
      <div className="relative z-10">
        <motion.img
          initial={{ scale: 1 }}
          animate={controls}
          alt="logo"
          src="/images/basil-logo.png"
          className="w-[90vw] h-[90vh] aspect-[989/334] object-contain"
        />

        <div className="absolute rotate-[-30deg] left-[100px] top-[50px] w-[180.715px] h-[180.715px]">
          <Image alt="tomato1" fill src="/images/tomato1.png" />
        </div>
        <div className="absolute rotate-[30deg] left-[50px] bottom-[-70px] w-[180.715px] h-[180.715px]">
          <Image alt="cherry" fill src="/images/cherry-tomato.png" />
        </div>
        <div className="absolute right-[140px] bottom-5 w-[160.715px] h-[160.715px]">
          <Image alt="full" fill src="/images/full-tomato.png" />
        </div>
        <div className="absolute right-[190px] rotate-[-45deg] bottom-[-10px] w-[120.715px] h-[120.715px]">
          <Image alt="tomato1" fill src="/images/tomato1.png" />
        </div>
      </div>

      {/* Heading text */}
      <motion.h1
        initial={{ y: -80 }}
        animate={textControls}
        className="text-primary text-heading1 font-bold z-10"
      >
        SUPER - ADMIN PORTAL
      </motion.h1>

      {/* AM Character with Caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={kioskmanControls}
        className="absolute bottom-[-10px] flex items-center gap-2 pl-4"
      >
        <div className="relative h-[180px] w-[150px] flex-shrink-0">
          <Image src="/images/admin-man.png" alt="admin-man" fill />
        </div>
        <p className="text-primary text-caption w-[141px] leading-tight relative right-[50px]">
        Powering the people behind every plate.
        </p>
      </motion.div>

      <motion.div className='absolute right-2 flex flex-col gap-2'>

      </motion.div>
    </div>
  )
}

export default Page
