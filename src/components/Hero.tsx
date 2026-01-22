import { useState, useRef, useEffect } from "react";

const Hero = () => {

    const [activeVideoIndex, setActiveVideoIndex] = useState(1);
    const [activeVideoElement, setActiveVideoElement] = useState<'video1' | 'video2'>('video1');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasClicked, setHasClicked] = useState(false)
    const [isloading, setIsloading] = useState(true)
    const [loadedVideos, setLoadedVideos] = useState(0)

    const video1Ref = useRef<HTMLVideoElement>(null);
    const video2Ref = useRef<HTMLVideoElement>(null);
    const miniVideoRef = useRef<HTMLVideoElement>(null);

    const handleVideoLoad = () => {
        setLoadedVideos((prevLoaded) => prevLoaded + 1);
    }

    const totalVideos = 4;
    const upcomingVideoIndex = (activeVideoIndex % totalVideos) + 1;
    
    const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`

    // Initialize videos on mount
    useEffect(() => {
        if (video1Ref.current && video2Ref.current) {
            // Video 1 shows the active video
            video1Ref.current.src = getVideoSrc(activeVideoIndex);
            video1Ref.current.load();
            video1Ref.current.play().catch(() => {});
            
            // Video 2 preloads the next video
            video2Ref.current.src = getVideoSrc(upcomingVideoIndex);
            video2Ref.current.load();
        }
    }, []);

    const handleMiniVdClick = () => {
       setHasClicked(true);
       
       if (isTransitioning) return; // Prevent multiple clicks during transition
       
       const nextIndex = upcomingVideoIndex;
       const activeVideo = activeVideoElement === 'video1' ? video1Ref.current : video2Ref.current;
       const hiddenVideo = activeVideoElement === 'video1' ? video2Ref.current : video1Ref.current;
       
       if (!hiddenVideo || !activeVideo) return;
       
       setIsTransitioning(true);
       
       // Load the next video in the hidden element
       hiddenVideo.src = getVideoSrc(nextIndex);
       hiddenVideo.load();
       
       // Wait for the video to be ready before transitioning
       const handleCanPlay = () => {
           // Start playing the next video from the beginning
           hiddenVideo.currentTime = 0;
           hiddenVideo.play().catch(() => {});
           
           // Small delay to ensure video is playing
           requestAnimationFrame(() => {
               // Start crossfade transition - opacity changes happen via CSS
               // After transition completes, swap which element is active
               setTimeout(() => {
                   // Update the active index
                   setActiveVideoIndex(nextIndex);
                   
                   // Reset transition state and swap active element after animation completes
                   setTimeout(() => {
                       // Swap which element is active (after transition completes)
                       const newActiveElement = activeVideoElement === 'video1' ? 'video2' : 'video1';
                       setActiveVideoElement(newActiveElement);
                       
                       // Preload the next video in the now-hidden element
                       const newNextIndex = (nextIndex % totalVideos) + 1;
                       const newHiddenVideo = newActiveElement === 'video1' ? video2Ref.current : video1Ref.current;
                       if (newHiddenVideo) {
                           newHiddenVideo.src = getVideoSrc(newNextIndex);
                           newHiddenVideo.load();
                       }
                       
                       setIsTransitioning(false);
                   }, 500); // Match transition duration
               }, 50);
           });
       };
       
       hiddenVideo.addEventListener('canplaythrough', handleCanPlay, { once: true });
    }

    
  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
        <div id= 'video-frame' className='relative h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
            <div className='relative w-full h-full'>
                {/* Video 1 */}
                <video 
                    ref={video1Ref}
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    style={{ 
                        opacity: isTransitioning 
                            ? (activeVideoElement === 'video1' ? 0 : 1)
                            : (activeVideoElement === 'video1' ? 1 : 0),
                        zIndex: activeVideoElement === 'video1' ? 10 : 20
                    }}
                />
                
                {/* Video 2 */}
                <video 
                    ref={video2Ref}
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    style={{ 
                        opacity: isTransitioning 
                            ? (activeVideoElement === 'video2' ? 0 : 1)
                            : (activeVideoElement === 'video2' ? 1 : 0),
                        zIndex: activeVideoElement === 'video2' ? 10 : 20
                    }}
                />

                <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg bg-white/10 flex-center'>
                    <div onClick={handleMiniVdClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>
                        <video 
                        ref={miniVideoRef}
                        src={getVideoSrc(upcomingVideoIndex)}
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