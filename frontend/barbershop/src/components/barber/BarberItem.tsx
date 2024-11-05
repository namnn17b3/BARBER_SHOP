import Link from "next/link";

export default function BarberItem(props: any) {
  const { id, img, name } = props;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="h-56 w-full">
        <Link href={`/barber/${id}`}>
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
        </Link>
      </div>
      <div className="pt-6 text-center">
        <Link 
          href={`/barber/${id}`}
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
        >
          {name}
        </Link>
      </div>
    </div>
  );
}
