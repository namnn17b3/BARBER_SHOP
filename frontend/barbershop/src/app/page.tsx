import Image from "next/image";

export default function Home() {
  return (
    <section className="bg-center bg-no-repeat bg-cover bg-[url('/img/home_bg.jpg')] bg-gray-700 bg-blend-multiply">
      <div className="px-4 mx-auto max-w-screen-xl text-center pt-56 lg:pb-24">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">We provide the best hair cutting service</h1>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">With over 15 years of development in the field of hair cutting, we affirm to bring you beautiful hair, meeting the beauty needs of men.</p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <a href="/hair-style" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            Booking now
            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </a>
          <a href="#" className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400">
            Learn more
          </a>
        </div>
        <div className="pt-16">
          <iframe className="mx-auto w-full lg:max-w-xl h-64 rounded-lg sm:h-96 shadow-xl" src="https://www.youtube.com/embed/ovEo3CB_T8Q?si=zmeDzAGL1emW5Lom" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>

        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12">
              <a href="/hair-color" className="text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-700 text-green-400 mb-2">
                Hair Color
              </a>
              <h2 className="text-white text-3xl font-extrabold mb-2">Start discover extremely attractive hair colors</h2>
              <p className="text-lg font-normal text-gray-400 mb-4">A fiery hair color will leave a strong impression on the viewer, we will help you get a satisfactory hair color.</p>
              <a href="/hair-color" className="text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Detail
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path>
                </svg>
              </a>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12">
              <a href="/barber" className="text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-700 text-purple-400 mb-2">
                Barber
              </a>
              <h2 className="text-white text-3xl font-extrabold mb-2">Start discover the barbers with skilled skills</h2>
              <p className="text-lg font-normal text-gray-400 mb-4">We have professional barbers, let our barbers make you have an extremely impressive hair.</p>
              <a href="/barber" className="text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Detail
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
