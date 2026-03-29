import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UIPage from "./UIPage";
import App from "./App";
import UserDetailPage from "./UserDetailPage";


const appRoute = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
           
            {
                index:true,
                element: <UIPage />
            },
            {
                path: "/userDetail/:id",
                element: <UserDetailPage />
            }
            
           ]
    }
]
           
        
     )

const RoutePage = () => {
    return (
        <RouterProvider router={appRoute}/>
    )
}

export default RoutePage;