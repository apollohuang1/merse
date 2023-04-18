import React, { Children, useEffect } from "react";
import NavigationBar from "./navigation-bar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import useColorScheme from "@/hooks/useColorScheme";
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiFeather,
  FiHome,
  FiMenu,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiSidebar,
  FiSun,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import ProfileMenu from "./wrapper/profile-menu";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // redux
  const auth = useAppSelector((state) => state.auth);

  const { toggleColorScheme } = useColorScheme();
  const router = useRouter();

  const [showFullSidebar, setShowFullSidebar] = React.useState(true);

  const toggleSidebar = () => {
    setShowFullSidebar(!showFullSidebar);
  };

  const pathName = usePathname();

  const isCreateRoute = pathName?.split("/")[1] === "create";

  const { reloadCurrentUser } = useAuth();

  useEffect(() => {
    reloadCurrentUser()
      .then((user) => {
        console.log("User reloaded");
        console.log(user);
      })
      .catch((error) => {
        console.log("No authenticated user found");

        // redirect to login page
        // if current route or path name is not /, then redirect to pathname and don't use router
        if (window.location.pathname !== "/") {
          window.location.pathname = "/";
        }
      });
  }, []);

  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen w-screen">
      <div
        className={clsx(
          "w-full h-full max-sm:flex max-sm:flex-col",
          { "flex flex-col": !auth?.currentUser }, // unauthenticated
          {
            "grid grid-cols-[80px_auto] duration-300":
              auth?.currentUser && !showFullSidebar && !isCreateRoute,
          }, // authenticated, hide sidebar
          {
            "grid grid-cols-[250px_auto] duration-300":
              auth?.currentUser && showFullSidebar && !isCreateRoute,
          } // authenticated, show sidebar
        )}
      >
        {/* left side bar */}
        {auth?.currentUser && (
          <div
            className={clsx(
              "flex flex-col w-full h-full bg-light-background-primary dark:bg-dark-background-primary items-center justify-start border-r border-r-light-divider dark:border-dark-divider max-sm:hidden",
              { hidden: isCreateRoute }
            )}
          >
            {/* sidebar show toggle button */}
            <div
              className={clsx(
                "flex h-navigationBar w-full items-center p-3 duration-300",
                { "justify-end": showFullSidebar },
                { "justify-center": !showFullSidebar }
              )}
            >
              <button
                onClick={() => {
                  toggleSidebar();
                }}
                className="flex w-10 h-10 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary items-center justify-center rounded-xl"
              >
                {showFullSidebar ? (
                  <FiChevronsLeft className="text-light-text-secondary dark:text-dark-text-secondary w-5 h-5" />
                ) : (
                  <FiMenu className="text-light-text-primary dark:text-dark-text-primary w-5 h-5" />
                )}
              </button>
            </div>

            {/* side menus */}

            <div className="flex flex-col w-full p-3 gap-2 items-center">
              {/* home */}
              <SidebarMenuButton
                icon={<FiHome />}
                label="Home"
                href="/"
                isFull={showFullSidebar}
              />

              {/* subscription */}
              <SidebarMenuButton
                icon={<FiFeather />}
                label="Subscriptions"
                href="/subscriptions"
                isFull={showFullSidebar}
              />

              {/* read */}
              <SidebarMenuButton
                icon={<FiBookOpen />}
                label="Read Sample"
                href="/read?id=643d84f5f181248a5028ec42"
                isFull={showFullSidebar}
                isNew={true}
              />

            </div>

            {/* create */}
          </div>
        )}
        <div className="flex flex-col h-screen w-full overflow-auto">
          {/* top navigation bar */}
          {auth?.currentUser && !isCreateRoute && (
            <>
              <div className="flex flex-row w-full px-6 py-3 items-center justify-between sticky top-0 bg-light-background-primary dark:bg-dark-background-primary dark:bg-opacity-80 backdrop-blur-xl z-50">
                {/* arrow left and right */}
                <div className="flex flex-row gap-3 items-center">
                  <button
                    onClick={() => {
                      router.back();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      router.forward();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-row gap-3 items-center justify-center">
                  {/* search bar */}
                  <div className="group flex flex-row gap-3 px-4 items-center w-80 h-8 border border-light-divider dark:border-dark-divider rounded-full bg-light-background-secondary dark:bg-dark-background-secondary focus-within:ring-1 focus-within:ring-emerald-500 transition-all max-md:hidden">
                    <FiSearch className="text-light-text-secondary dark:text-dark-text-secondary group-focus-within:text-accent" />
                    <input
                      type="text"
                      placeholder="Enter the work, artist, or genre"
                      className="w-full bg-transparent outline-none placeholder:text-light-text-tertiary placeholder:dark:text-dark-text-tertiary"
                    />
                  </div>

                  <button
                    onClick={() => {
                      toggleColorScheme();
                    }}
                    className="flex flex-row gap-2 text-light-text-primary dark:text-dark-text-primary w-8 h-8 items-center justify-center rounded-full hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary"
                  >
                    <FiSun className="w-5 h-5" />
                  </button>

                  <ProfileMenu>
                    <div className="flex items-center justify-center aspect-square">
                      <img
                        src={auth?.currentUser?.profile_image_url}
                        className={"h-8 w-8 aspect-square rounded-full"}
                        alt="user profile image"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://media.discordapp.net/attachments/1090027780525273153/1095187382095061085/markrachapoom_boy_and_girl_looking_at_each_other_with_a_smile_i_fe116faf-39b2-46d2-8dbe-b46f9b0b4ef1.png?width=686&height=686";
                        }}
                      />
                    </div>
                  </ProfileMenu>
                </div>
              </div>
            </>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

const SidebarMenuButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  href: string;
  isFull: boolean;
  variant?: "normal" | "solid";
  isNew?: boolean;
}> = ({ icon, label, href, isFull, variant = "normal", isNew=false }) => {
  return (
    <Link
      href={href}
      className="flex w-full h-full items-center justify-center"
    >
      <button
        className={clsx(
          "flex flex-row items-center gap-3 w-full transition-all rounded-xl",
          // { "bg-accent hover:bg-emerald-600": variant === "solid" },
          {
            "hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary":
              variant === "normal",
          },
          { "flex-col justify-center h-12 w-12 aspect-square": !isFull },
          { "flex-row justify-between pl-6 pr-3 h-12": isFull }
        )}
      >
        <div className="flex flex-row items-center gap-3">
          {icon}
          {isFull && <span className="flex flex-shrink-0">{label}</span>}
        </div>

        {isNew && isFull && <span className="text-accent text-sm font-medium px-2 py-[2px] bg-emerald-500 bg-opacity-30 rounded-lg">New</span>}
      </button>
    </Link>
  );
};

export default HomeLayout;
