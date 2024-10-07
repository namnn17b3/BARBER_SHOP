export default function Gallery(props: any) {
  const children = props.children;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {children}
    </div>
  );
}
