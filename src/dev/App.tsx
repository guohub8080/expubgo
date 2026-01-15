// import {ConfigProvider, theme} from "antd";
// import zhCN from "antd/locale/zh_CN";
import {RouterProvider} from "react-router";
import router from "./router";
import React from "react";
import { Toaster } from 'react-hot-toast';
import { GlobalSettingsEffects } from './store/useGlobalSettings';


const App = () => {
    return (<>
            <GlobalSettingsEffects />
            <RouterProvider router={router}/>
            <Toaster position="top-center" />
    </>)
}

export default App