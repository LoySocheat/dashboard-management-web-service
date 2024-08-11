import {Navigate, createBrowserRouter} from "react-router-dom"
import Login from "./views/Login";
import Signup from "./views/Signup";
import Users from "./views/Users";
import Orders from "./views/Orders";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Product from "./views/Product";
import UserForm from "./views/UserForm";
import ProductForm from "./views/ProductForm";
import Laptops from "./views/Laptops";
import App from "./App";
import LaptopForm from "./views/LaptopForm"
import ChartDashboard from "./views/ChartDashboard";
import ClientLogs from "./views/ClientLogs";
import AppFunctionsStatuses from "./views/AppFunctionsStatuses";
import AppFunctions from "./views/AppFunctions";


import Roles from "./views/Roles";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            // Users
            {
                path: '/',
                element: <Navigate to="/users" />
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate"/>
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate"/>
            },

            {
                path: '/products',
                element: <Product />
            },
            {
                path: '/products/new',
                element: <ProductForm key="productCreate" />
            },
            {
                path: '/products/:id',
                element: <ProductForm key="productUpdate" />
            },
            {
                path: '/laptops',
                element: <Laptops />
            },
            {
                path: '/laptops/new',
                element: <LaptopForm key="laptopCreate" />
            },
            {
                path: '/laptops/:id',
                element: <LaptopForm key="laptopUpdate" />
            },
            {
                path: '/orders',
                element: <Orders />
            },
            {
                path: '/app',
                element: <App />
            },
            {
                path: '/report-graph',
                element: <ChartDashboard />
            },


            // Roles
            {
                path: '/roles',
                element: <Roles />
            },


            // Client Logs
            {
                path: '/client-logs',
                element: <ClientLogs />
            },

            // function statuses
            {
                path: '/function-statuses',
                element: <AppFunctionsStatuses />

            },

            // App Functions
            {
                path: '/app-functions',
                element: <AppFunctions />
            }

        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router;
