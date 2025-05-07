'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const rightArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#e3e3e3"
  >
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
  </svg>
)

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    document.onclick = function (e) {
      console.log('jalan')
      const x = e.pageX
      const y = e.pageY

      const flies = document.createElement('img')
      flies.setAttribute('src', '/fly-2.webp')
      flies.setAttribute('height', '128px')
      flies.setAttribute('width', '128px')
      flies.classList.add('flies')
      flies.style.top = y + 'px'
      flies.style.left = x + 'px'

      document.body.appendChild(flies)

      setTimeout(() => {
        flies.remove()
      }, 1000)
    }
  })

  return (
    <main>
      <section
        id="home"
        className="w-screen h-[75vh] flex justify-center items-center bg-[url(/image.jpg)] bg-cover overflow-hidden"
      >
        <h1
          className="text-4xl md:text-6xl text-highlight font-medium 
            before:content-[''] before:bg-[url(/brush_grey.svg)] before:bg-contain before:bg-no-repeat before:bg-center before:absolute before:-z-10
            before:top-0 before:bottom-0 before:left-0 before:right-0 before:scale-x-[4.5] before:scale-y-[1.8] before:opacity-50"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
        >
          Welcome To QuaiFly
        </h1>
        <Image
          src="/moon.svg"
          alt="The Moon"
          width={128}
          height={128}
          className="absolute right-8 xl:right-24 2xl:right-40 top-24 xl:top-16 2xl:top-24"
        />
        <Image
          src="/swarm.png"
          alt="Swarm of flies"
          width={172}
          height={172}
          id="swarm"
          className="absolute -left-64 bottom-1/3"
        />
      </section>

      <section className="w-screen h-screen flex justify-center items-center">
        <p
          className="w-[90%] md:w-[60%] lg:w-1/2 text-center text-2xl md:text-3xl lg:text-4xl"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          QuaiFly is one of the first community-powered memecoins built on the
          innovative{' '}
          <a
            href="https://x.com/QuaiNetwork"
            target="_blank"
            className="text-highlight"
          >
            @QuaiNetwork
          </a>{' '}
          — fueled by good vibes, swarm energy, and a shared belief in a
          decentralized future.
        </p>
      </section>

      <section className="w-screen h-screen flex justify-center items-center mb-32 md:mb-0">
        <p
          className="w-[90%] md:w-[60%] lg:w-[40%] text-center text-2xl md:text-3xl lg:text-4xl"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          At QuaiFly, there are No venture capitalists, No empty promises, Just
          a simple mission $FLY higher together.
        </p>
      </section>

      <section className="w-screen h-screen flex justify-center items-center">
        <p
          className="w-[90%] md:w-[60%] lg:w-[40%] text-center text-2xl md:text-3xl lg:text-4xl"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          We are driven by a strong, supportive, and fun community. Organic,
          transparent growth, and passion for expanding the Quai ecosystem.
          Join us on that mission!  
        </p>
      </section>

      <section className="w-screen h-screen flex flex-col justify-center items-center">
        <h1
          className="text-4xl md:text-6xl font-medium mb-16"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          Join The Swarm!
        </h1>
        <p
          className="text-xl text-center"
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          Embrace the memes, and let&apos;s $FLY towards a brighter decentralized
          world.
        </p>
        <p
          className="text-xl font-bold mt-4 mb-8"
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          #LFF — Let’s Fucking $FLY!
        </p>
        <p
          className="text-sm md:text-xl"
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          CA: 0x0040198bD115CBC1ce165327B26af1a6d30fAc3E
        </p>

        <div
          className="flex mt-24"
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <a
            href="https://x.com/QuaiFly"
            target="_blank"
            className="flex justify-between px-4 py-4 mx-4 bg-highlight hover:bg-highlight/70 transition-all rounded-md text-white"
          >
            Twitter {rightArrow}
          </a>
          <a
            href="https://t.co/PKljESuZrS"
            target="_blank"
            className="flex justify-between px-4 py-4 mx-4 bg-highlight hover:bg-highlight/70 transition-all rounded-md text-white"
          >
            Telegram {rightArrow}
          </a>
        </div>
      </section>

      <section
        id="about"
        className="w-screen md:h-screen flex flex-col justify-center items-center mb-32 md:mb-0 bg-shade-1 py-16"
      >
        <h1
          className="text-xl text-shade-2"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          About QuaiFly
        </h1>
        <h2
          className="mt-8 text-center text-4xl md:text-5xl text-highlight font-medium"
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          Where Passion $FLYs!<br /> Meet QuaiFly!
        </h2>

        <div className="w-screen flex flex-col md:flex-row px-4 md:px-16 lg:px-40 md:mt-56">
          <div
            className="px-4 mt-16 md:mt-0 md:mr-8 lg:mr-16"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Image src="/2.png" alt="QuaiFly Mascot" width={100} height={90} />
            <h3 className="mt-16 mb-4 text-2xl">Our Mission</h3>
            <p className="text-shade-2 text-xl">
              We want to create a strong, fun community that believes in
              decentralization. At QuaiFly, it&apos;s all about lifting each
              other up and flying higher — together.
            </p>
          </div>
          <div
            className="px-4 mt-16 md:mt-0 md:mx-8 lg:mx-16"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Image src="/2.png" alt="QuaiFly Mascot" width={100} height={90} />
            <h3 className="mt-16 mb-4 text-2xl">Our Values</h3>
            <p className="text-shade-2 text-xl">
              We stand for helping each other grow, staying real and
              transparent, supporting the Quai network, No games, just goals.
            </p>
          </div>
          <div
            className="px-4 mt-16 md:mt-0 md:ml-8 lg:ml-16"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            <Image src="/2.png" alt="QuaiFly Mascot" width={100} height={90} />
            <h3 className="mt-16 mb-4 text-2xl">Join The Swarm</h3>
            <p className="text-shade-2 text-xl">
              Ready to fly with us? Join our community, share the memes, and
              let&apos;s make the future better — and a lot more fun. Follow us:{' '}
              <a
                href=""
                target="_blank"
                className="text-highlight hover:text-blue-500"
              >
                Twitter
              </a>{' '}
              |{' '}
              <a
                href=""
                target="_blank"
                className="text-highlight hover:text-blue-500"
              >
                Telegram
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="w-screen md:h-screen flex flex-col md:flex-row justify-between items-center px-4 md:px-16 lg:px-40 mb-32 md:mb-0 overflow-hidden">
        <div
          className="md:w-1/2 md:mr-16 mb-16 md:mb-0 text-xl"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <h1 className="text-4xl md:text-5xl text-highlight font-medium">
            How to buy $FLY
          </h1>
          <p className="mt-8 mb-4">
            Take a minute to write an introduction that is short, sweet, and to
            the point.
          </p>
          <p className="mb-4">
            This is your 🪙 golden ticket — don&apos;t miss the biggest
            opportunity in crypto right now!
          </p>
          <p className="mb-4">Getting started is a 🌱 breeze:</p>
          <ul>
            <li>
              ✅ 1. Download{' '}
              <a
                href="https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop?hl=en&pli=1"
                className="text-highlight hover:text-blue-500"
              >
                Pelagus Wallet
              </a>{' '}
              for Desktop or{' '}
              <a href="#" className="text-highlight hover:text-blue-500">
                Koala Wallet
              </a>{' '}
              for Mobile
            </li>
            <li>
              ✅ 2. Buy $QUAI on{' '}
              <a
                href="https://www.mexc.com/"
                className="text-highlight hover:text-blue-500"
              >
                MEXC
              </a>{' '}
              or{' '}
              <a href="" className="text-highlight hover:text-blue-500">
                Gate.io
              </a>
            </li>
            <li>✅ 3. Send $QUAI to your wallet</li>
            <li>
              ✅ 4. Checkout our pool on{' '}
              <a
                href="https://quaiswap.io/"
                className="text-highlight hover:text-blue-500"
              >
                QuaiSwap
              </a>
              . Just swap $QUAI for $FLY — easy as pie!
            </li>
          </ul>
          <p className="mt-4">
            😎 The future is $FLY. Be part of the movement.  
          </p>
        </div>

        <Image
          src="/Q_FLY_red.png"
          alt="QuaiFly logo"
          width={326}
          height={326}
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="200"
        />
      </section>

      <section className="w-screen flex flex-col justify-center items-center mb-24 text-xl overflow-hidden">
        <div className="flex flex-col md:flex-row mb-16">

          <div
            className="flex flex-col md:flex-row items-center md:w-[300px] lg:w-[400px] mx-4 md:mx-8 lg:mx-16"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Image src="/5.jpg" alt="QuaiFly mascot" width={70} height={56} />
            <div className="flex flex-col ml-8">
              <p>“$FLY on $QUAI”</p>
              <p className="mt-4">
                @basedpavel <span className="text-shade-2">Quai Team</span>
              </p>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center md:w-[300px] lg:w-[400px] mx-4 md:mx-8 lg:mx-16 mb-16 md:mb-0"
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Image src="/5.jpg" alt="QuaiFly mascot" width={70} height={56} />
            <div className="flex flex-col ml-8">
              <p>
                “QuaiFly thrives on the essentials: real community, no empty promises.”
              </p>
              <p className="mt-4">
                @Felixx86 <span className="text-shade-2">Quai Community</span>
              </p>
            </div>
          </div>
          <div
            className="flex flex-col md:flex-row items-center md:w-[300px] lg:w-[400px] mx-4 md:mx-8 lg:mx-16"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Image src="/5.jpg" alt="QuaiFly mascot" width={70} height={56} />
            <div className="flex flex-col ml-8">
              <p>“@QuaiFly appears to be a community-drive or meme-based project built on the @QuaiNetwork, a Layer-1 blockchain known for scalability, speed, and dual-token system ( $QUAI and $QI). The $FLY token is native token of @QuaiFly, and recent X posts suggest it&apos;s gaining traction within the $QUAI ecosystem...”</p>
              <p className="mt-4">
                @niole_on_chain <span className="text-shade-2">Quai Community</span>
              </p>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center md:w-[300px] lg:w-[400px] mx-4 md:mx-8 lg:mx-16"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Image src="/5.jpg" alt="QuaiFly mascot" width={70} height={56} />
            <div className="flex flex-col ml-8">
              <p>“always ready to $FLY”</p>
              <p className="mt-4">
                @tonwontonwon <span className="text-shade-2">Quai Community</span>
              </p>
            </div>
          </div>

        </div>

        <div
          className="flex flex-col items-center md:w-[300px] lg:w-[400px] mx-4 md:mx-8 lg:mx-16"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <Image src="/5.jpg" alt="QuaiFly mascot" width={70} height={56} />
          <p className="mt-8">“#LFF FLYs. Y’all are killing it”</p>
        </div>
      </section>
    </main>
  )
}
