import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import User from "./views/admin/user";
import Category from "./views/admin/category";
import Product from "./views/admin/product";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock, MdApartment, MdShop, MdCampaign, MdShop2, MdCategory, MdMoney,
} from "react-icons/md";
import Campaign from "./views/admin/campaign";
import Order from "./views/admin/order";

const routes = [
  {
    name: "Ana Sayfa",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Hesap Değiştir",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Kullanıcı",
    layout: "/admin",
    path: "users",
    icon: <MdPerson className="h-6 w-6" />,
    component: <User/>
  },
  {
    name: "Kategori",
    layout: "/admin",
    path: "categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <Category/>
  },
  {
    name: "Ürün",
    layout: "/admin",
    path: "products",
    icon: <MdShop2 className="h-6 w-6" />,
    component: <Product/>
  },
  {
    name: "Kampanya",
    layout: "/admin",
    path: "campaigns",
    icon: <MdCampaign className="h-6 w-6" />,
    component: <Campaign/>
  },
  {
    name: "Sipariş",
    layout: "/admin",
    path: "orders",
    icon: <MdMoney className="h-6 w-6" />,
    component: <Order/>
  }
];
const trashRoutes = [
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
];
export default routes;
