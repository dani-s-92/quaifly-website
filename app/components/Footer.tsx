const xIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32px"
    // fill="white"
    viewBox="0 0 512 512"
    className="fill-white hover:fill-shade-2"
  >
    Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License -
    https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
)

const telegramIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32px"
    // fill="white"
    viewBox="0 0 496 512"
    className="fill-white hover:fill-shade-2"
  >
    Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License -
    https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.
    <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
  </svg>
)

const Footer = () => {
  return (
    <footer className="w-screen flex flex-col justify-center items-center px-4 md:px-16 lg:px-40 py-8 bg-foreground text-white">
      <div className="flex mb-8">
        <a href="https://x.com/QuaiFly" target="_blank" className="mx-4">
          {xIcon}
        </a>
        <a href="https://t.co/PKljESuZrS" target="_blank" className="mx-4">
          {telegramIcon}
        </a>
      </div>

      <p>&copy; 2025 All rights reserved.</p>
    </footer>
  )
}

export default Footer
