export default function HairColorItem(props: any) {
  const { url } = props;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="h-56 w-full">
        <div style={{ width: '100%', height: '100%' }}>
          <img
            className="mx-auto h-full dark:hidden"
            src={url}
            alt=""
            style={{ objectFit: 'cover' }}
          />
          <img
            className="mx-auto hidden h-full dark:block"
            src={url}
            alt=""
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}
