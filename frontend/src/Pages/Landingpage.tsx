
import { BackgroundBeamsDemo } from '../Components/BackgroundBeamsDemo'
import { BackgroundBeams } from '../Components/ui/background-beams'

const Landingpage = () => {
  return (
    <>
    <div className='bg-black h-screen' style={{fontFamily:'"Baloo Bhai 2,sans-serif'}}>
        <BackgroundBeamsDemo/>
        <BackgroundBeams/>
    </div>
    </>
  )
}

export default Landingpage