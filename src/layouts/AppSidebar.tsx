import { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  divider?: boolean;
  icon?: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    name: "Main",
    divider: true,
  },
  {
    icon: <SpaceDashboardIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "System",
    divider: true,
  },
  {
    icon: <SettingsIcon />,
    name: "Pengaturan Sistem",
    subItems: [
      {
        name: "Menu",
        path: "/settings/menu",
      },
      {
        name: "Role",
        path: "/settings/role",
      },
      {
        name: "Akun User",
        path: "/settings/user-account",
      },
      {
        name: "Profil Akun",
        path: "/settings/profile",
      },
    ],
  },
];

const AppSidebar = () => {
  const location = usePathname();
  const { isExpanded, isHovered, setIsHovered, isMobileOpen } = useSidebar();

  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location === path,
    [location]
    
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.index === index) {
        return null;
      }
      return { index };
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) =>
        nav.divider ? (
          <li key={`divider-${index}`}>
            <h2
              className={
                "text-xs uppercase text-gray-400 leading-[20px] flex " +
                (!isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "justify-start")
              }
            >
              {isExpanded || isHovered || isMobileOpen ? (
                nav.name
              ) : (
                <MoreHorizIcon className="size-6" />
              )}
            </h2>
          </li>
        ) : (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={
                  "flex items-center w-full px-3 py-2 rounded-lg transition-colors " +
                  (openSubmenu?.index === index
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-blue-50 text-gray-700") +
                  " " +
                  (!isExpanded && !isHovered && !isMobileOpen
                    ? "lg:justify-center"
                    : "lg:justify-start")
                }
              >
                <span className="w-6 h-6 flex items-center justify-center mr-3 text-gray-700 active:text-blue-600">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ExpandMoreIcon
                    className={
                      "ml-auto w-5 h-5 text-gray-500 transition-transform duration-200 " +
                      (openSubmenu?.index === index
                        ? "rotate-180 text-blue-500"
                        : "")
                    }
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={
                    "flex items-center w-full px-3 py-2 rounded-lg transition-colors " +
                    (isActive(nav.path)
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "hover:bg-blue-50 text-gray-700")
                  }
                >
                  <span className="w-6 h-6 flex items-center justify-center mr-3 text-blue-600">
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={
                          "flex justify-between items-center px-3 py-1.5 rounded-md text-sm transition-colors " +
                          (isActive(subItem.path)
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "hover:bg-blue-50 text-gray-700")
                        }
                      >
                        <span>{subItem.name}</span>
                        <span className="flex gap-1">
                          {subItem.new && (
                            <span
                              className={
                                "text-xs px-2 py-0.5 rounded-full font-semibold " +
                                (isActive(subItem.path)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-500")
                              }
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={
                                "text-xs px-2 py-0.5 rounded-full font-semibold " +
                                (isActive(subItem.path)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-500")
                              }
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        )
      )}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}>
        <Link href='/'>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex flex-row gap-2 text-2xl font-bold items-center">
              <img
                src='/assets/favicon.ico'
                alt='Logo'
                width={50}
                height={50}
              />
              OBE Dashboard
            </div>
          ) : (
            <img
              src='/assets/favicon.ico'
              alt='Logo'
              width={50}
              height={50}
            />
          )}
        </Link>
      </div>
      <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>{renderMenuItems(navItems)}</div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
