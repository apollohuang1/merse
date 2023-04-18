import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux-store/hooks";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { FiBookOpen, FiChevronRight, FiLogOut, FiUser } from "react-icons/fi";

type Props = { children: React.ReactNode };

const ProfileMenu = (props: Props) => {

  const { logOut } = useAuth();
  const router = useRouter();

  const auth = useAppSelector((state) => state.auth);

  const menuItems = [
    {
      icon: <FiUser />,
      label: "Profile",
      onClick: () => {
        if (auth?.currentUser) {
          router.push(`/${auth.currentUser._id}`);
        }
      },
    },
    {
      icon: <FiBookOpen />,
      label: "Create Comic",
      onClick: () => {
        window.location.href = "/create/styles";
      },
    },
    {
      icon: <FiLogOut />,
      label: "Logout",
      onClick: () => {
        logOut();
      },
    },
  ];

  return (
    <>
      <Menu>

        <MenuButton>{props.children}</MenuButton>

        <MenuList className="bg-light-background-primary dark:bg-dark-background-secondary w-48 rounded-lg drop-shadow-2xl border border-light-divider dark:border-dark-divider">
          {menuItems.map((item, index) => {
            return (
              <MenuItem
                onClick={item.onClick}
                key={index}
                className={clsx(
                  "flex flex-row justify-between px-3 h-12 transition-all duration-[275ms]",
                  {
                    "focus:bg-light-background-tertiary dark:focus:bg-dark-background-tertiary border-b border-b-light-divider dark:border-b-dark-divider":
                      index !== menuItems.length - 1,
                  },
                  { "rounded-t-lg": index === 0 },
                  {
                    "rounded-b-lg focus:bg-red-500 focus:bg-opacity-30":
                      index === menuItems.length - 1,
                  }
                )}
              >
                <div
                  className={clsx(
                    "flex flex-row gap-3 items-center",
                    {
                      "text-light-red dark:text-dark-red":
                        item.label === "Logout",
                    },
                    {
                      "text-light-text-primary dark:text-dark-text-primary":
                        item.label !== "Logout",
                    }
                  )}
                >
                  {item.icon}
                  <span
                    className={clsx("text-base font-normal", {
                      "text-light-text-primary dark:text-dark-text-primary":
                        item.label !== "Logout",
                    })}
                  >
                    {item.label}
                  </span>
                </div>

                {item.label !== "Logout" && (
                  <FiChevronRight className="text-light-text-secondary dark:text-dark-text-secondary w-[18px] h-[18px]" />
                )}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </>
  );
};

export default ProfileMenu;
