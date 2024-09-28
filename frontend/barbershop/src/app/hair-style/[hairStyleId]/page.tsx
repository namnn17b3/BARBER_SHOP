import Feedbacks from "@/components/feedback/Feedbacks";
import HairStyleDetail from "@/components/hair-style/HairStyleDetail";

export default function HairStyleDetailPage(props: any) {
  const { hairStyleId } = props.params;

  return (
    <>
      <HairStyleDetail hairStyleId={props.params.hairStyleId} />
      <hr className="my-6 md:my-8 border-gray-300 dark:border-gray-800" />
      <Feedbacks hairStyleId={hairStyleId}/>
    </>
  );
}
