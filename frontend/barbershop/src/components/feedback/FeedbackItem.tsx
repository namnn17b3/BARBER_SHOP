import { ColorMaper } from "@/common/constant/color.constant";
import { capitalize } from "@/common/utils/utils";

export default function FeedbackItem(props: any) {
  const {
    isFirst,
    star,
    comment,
    time,
    user,
  } = props;

  return (
    <div className={`gap-3 ${isFirst ? 'pb-6' : 'py-6'} sm:flex sm:items-start`}>
      <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
        <div className="flex">
          <img className="w-10 h-10 mr-3 rounded my-auto" src={user?.avatar || '/img/fb-no-img.png'} alt="Default avatar" />
          <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
            <div className="flex items-center gap-0.5">
              {
                [1, 2, 3, 4, 5].map((s: number) => (
                  <svg
                    className={`h-4 w-4 ${s <= star ? "text-yellow-300" : "text-gray-300"}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    key={s}
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))
              }
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </p>
              <p className="text-sm font-normal dark:text-gray-400" style={{ color: user?.hairColor?.colorCode ||  ColorMaper['NORMAL'] }}>
                {user.hairColor ? capitalize(user.hairColor.color) : 'Normal'}
              </p>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {time}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="m-auto min-w-0 flex-1 space-y-4 sm:mt-0l">
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">
          {comment}
        </p>
      </div>
    </div>
  );
}
