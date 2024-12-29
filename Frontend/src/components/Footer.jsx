import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#3f3f3f] text-white flex md:flex-row flex-col gap-6 justify-around p-4'>
        <div className='flex flex-col'>
            <div className='font-bold mb-3'>MediFirst</div>
            <div>Home</div> 
            <div>About Us</div> 
            <div>Contact Us</div> 
            <div>Help</div> 
        </div>
        <div className='flex flex-col'>
            <div className='font-bold mb-3'>Discover</div>
            <div>Practice Resource for providers</div> 
            <div>Community Standard</div> 
            <div>Data and Privacy</div> 
            <div>Verified Reviews</div> 
        </div>
        <div className='flex flex-col'>
            <div className='font-bold mb-3'>Are You a top doctor</div>
            <div>List your practice on MediFirst</div> 

        </div>
            <div className='font-bold mb-3'>Insurance Carriers</div>

     

    </div>
  )
}

export default Footer