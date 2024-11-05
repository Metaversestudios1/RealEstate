import './App.css';
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./components/utils/PrivateRoute";
import Home from  "./components/Home";
import Login from "./components/Login"
import Error from "./components/Error"

import AuthProvider from "./context/AuthContext";

import Client from "./components/Client/Client"
import AddClient from "./components/Client/AddClient"
import AddAgent from './components/Agent/AddAgent';
import Agent from './components/Agent/Agent';
import AddProperty from './components/Property/AddProperty';
import Property from './components/Property/Property';
import AddSite from './components/Sites/AddSite';
import EditSite from './components/Sites/EditSite';
import Sites from './components/Sites/Sites';
import AddPropertyDetails from './components/Sites/AddPropertyDetails';
import ViewSites from './components/Sites/ViewSites';
import EditClient from './components/Client/EditClient';
import EditRank from './components/Rank/EditRank';
import AddRank from './components/Rank/AddRank';
import Ranks from './components/Rank/Ranks';
import EditAgent from './components/Agent/EditAgent';
import AssignProperties from './components/Agent/AssignProperties';
import EditProperty from './components/Property/editproperty';
import Hierarchy from './components/Agent/hierarchy';
import Booking from './components/payouts/booking';
import Commission from './components/payouts/commission';



function App() {
  const [sideBar, setSideBar] = useState(true);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    
    {
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Home/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
   

    {
      path: "/clients",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Client/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/clients/addclient",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddClient/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/clients/editclient/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditClient/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
   
    {
      path: "/agents",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Agent/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/agents/addagent",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddAgent/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/agents/editagent/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditAgent/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/hierarchy/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Hierarchy/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/properties",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Property/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/properties/addproperty",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddProperty/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/EditProperty/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditProperty/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/sites",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Sites/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/sites/addSite/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddSite/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/sites/addSite",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddSite/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {

      path: "/sites/editsite/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditSite/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {

      path: "/sites/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Sites/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/addPropertyDetails/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddPropertyDetails/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/viewsite/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <ViewSites/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/ranks",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Ranks/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/ranks/addrank",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddRank/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/ranks/editrank/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditRank/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/assignproperties/:id",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AssignProperties/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/booking",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Booking/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/commission",
      element: (
        <PrivateRoute>
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" toggleSideBar={toggleSideBar}/>
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Commission/>
          </div>
        </div>
        </PrivateRoute>
      ),
    },
    
    {
      path: "*",
      element: (
        <Error/>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App;
