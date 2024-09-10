export default function BarberItem({ img, name }: { img: string, name: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="h-56 w-full">
        <a href="?x=1">
          <img
            className="mx-auto h-full dark:hidden"
            src={img}
            alt=""
          />
          <img
            className="mx-auto hidden h-full dark:block"
            src={img}
            alt=""
          />
        </a>
      </div>
      <div className="pt-6 text-center">
        <a
          href="?x=1"
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
        >
          {name}
        </a>
      </div>
    </div>
  );
}
