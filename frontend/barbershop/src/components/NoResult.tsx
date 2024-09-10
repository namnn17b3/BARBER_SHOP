export default function NoResult() {
  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="flex p-10 flex-col">
          <img className="m-auto" src="/img/no-result.png" alt="" />
          <p className="text-center text-gray-500 dark:text-gray-300 mt-1">No result</p>
        </div>
      </div>
    </section>
  );
}
