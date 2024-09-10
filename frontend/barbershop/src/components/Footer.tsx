export default function Footer() {
  return (
    <footer className="bg-white text-white shadow dark:bg-gray-900 m-0" style={{ backgroundColor: '#1d1d1d' }}>
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/img/gen_logo.png"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Barber Shop
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="https://www.facebook.com/namnn.17b3" className="text-white hover:underline me-4 md:me-6">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@BDCCN-NguyenNgocNam" className="text-white hover:underline me-4 md:me-6">
                Youtube
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@namnn.17b3" className="text-white hover:underline me-4 md:me-6">
                Tiktok
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:underline">
                Phone: 0977.963.450
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Barber Shop
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
