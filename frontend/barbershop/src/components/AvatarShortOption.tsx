import { ApiUser } from "@/common/constant/api-url.constant";
import { Role } from "@/common/enums/role.enum";
import { useAuthen } from "@/hooks/user.authen";

export function AvatarShortOption(props: any) {
  const { user } = props;

  const { authenDispatch, authenState } = useAuthen();

  const handleSignOut = () => {
    fetch(`${ApiUser.LOGOUT}?token=${encodeURIComponent(window.localStorage.getItem('token') as any)}`)
      .then(response => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();;
      })
      .then(json => {
        authenDispatch({ type: 'LOGOUT', payload: null })
        window.localStorage.removeItem('token');
        window.location.href = '/';
      })
      .catch(error => console.log(error));
  }

  return (
    <>
      <img
        id="avatarButton"
        typeof="button"
        data-dropdown-toggle="userDropdown"
        data-dropdown-placement="bottom-start"
        data-popper-reference-hidden
        className="w-10 h-10 rounded-full cursor-pointer"
        src={user?.avatar || "/img/fb-no-img.png"}
        alt="User dropdown"
        style={{ display: `${ user !== 0 && user !== 1 ? 'block' : 'none' }` }}
      />
      {/* Dropdown menu */}
      <div
        id="userDropdown"
        className="z-100 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 hidden"
        aria-hidden="true"
        data-popper-placement="bottom-start"
        data-popper-escaped=""
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>{user?.username}</div>
          <div className="font-medium truncate">{user?.email}</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="avatarButton"
        >
          {authenState?.role === Role.ADMIN &&
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
          }
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Ordering
            </a>
          </li>
        </ul>
        <div className="py-1">
          <div
            onClick={handleSignOut}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Sign out
          </div>
        </div>
      </div>
    </>
  );
}
