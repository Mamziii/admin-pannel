import Home from "./pages/Home";
import NavigateToLastRoute from "./pages/NavigateToLastRoute";
import Pannel from "./pages/Pannel";
import UsersList from "./pages/UsersList";
import ProductsList from "./pages/ProductsList";
import Orders from "./pages/Orders";
import AddNewProduct from "./pages/AddNewProduct";
import Sale from "./pages/Sale";

const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/pannel/*",
    element: <Pannel />,
    children: [
      { index: true, element: <NavigateToLastRoute /> },
      { path: "users-list", element: <UsersList /> },
        { path: "products-list", element: <ProductsList /> },
        { path: "sales", element: <Sale /> },
        { path: "orders", element: <Orders /> },
        { path: "add-product", element: <AddNewProduct /> },
    ],
  },
];

export default routes;
