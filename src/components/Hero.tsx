import { useState, useRef } from "react";

const Hero = () => {

    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false)
    const [isloading, setIsloading] = useState(true)
    const [loadedVideos, setLoadedVideos] = useState(0)

    const handleVideoLoad = () => {
        setLoadedVideos((prevLoaded) => prevLoaded + 1);
    }


    const totalVideos = 4;
    const nextVideoRef = useRef(null)

    
    const handleMiniVdClick = () => {
       setHasClicked(true);

       setCurrentIndex((prevIndex) => prevIndex + 1);
    }

    const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`

    
  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
        <div id= 'video-frame' className='relative h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
            <div>
                <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg bg-white/10 flex-center'>
                    <div onClick={handleMiniVdClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>
                        <video 
                        ref={nextVideoRef}
                        src={getVideoSrc(currentIndex + 1)}
                        loop
                        muted
                        autoPlay
                        playsInline
                        id="current-video"
                        className="size-64 object-cover object-center origin-center scale-150"
                        onLoadedData={handleVideoLoad}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero