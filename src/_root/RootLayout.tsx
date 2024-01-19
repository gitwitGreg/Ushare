import Leftbar from '@/components/shared/Leftbar'
import Topbar from '@/components/shared/Topbar'
import { Outlet } from 'react-router-dom'
import Bottombar from '@/components/shared/Bottombar'

const RootLayout = () => {
  return (
    <div
    className='flex flex-col w-[100%]'>
      <Topbar />
      <div
      className='flex flex-1'>
        <Leftbar />
        <section
        className='flex-1 p-4'>
          <Outlet />
        </section>
      </div>
      <Bottombar />
    </div>
  )
}

export default RootLayout
