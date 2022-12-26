import "bootstrap/dist/css/bootstrap.min.css";

import Navibar from "./components/navbar/Navibar";
import { LandingPage } from "./Pages/LandingPage";
import { DetailProduct } from "./Pages/DetailProduct";

import { Route, Routes } from 'react-router-dom'
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { MyCart } from "./Pages/MyCart";
import { MyProfile } from "./Pages/MyProfile";
import { useContext, useEffect } from "react";
import { AppContext } from "./contexts/AppContext";
import { Transactions } from "./Pages/Transaction";
import { AddProduct } from "./Pages/AddProduct";
import { AddTopping } from "./Pages/AddTopping";


function App() {
   const contexts = useContext(AppContext)
   useEffect(() => {contexts.checkUserAuth()}, []);

   return (
      <>
         <Navibar />
         <Login />
         <Register /> 
         <Routes>
            <Route exact path='/' element={<LandingPage/>} ></Route>
            <Route exact path='/menu/:id/:menuName' element={<DetailProduct/>}></Route>
            <Route exact path='/mycart' element={<MyCart/>}></Route>
            <Route exact path='/customer/profile' element={<MyProfile/>}></Route>
            <Route exact path='/admin/transaction' element={<Transactions/>}></Route>
            <Route exact path='/add-product' element={<AddProduct/>}></Route>
            <Route exact path='/add-topping' element={<AddTopping/>}></Route>
         </Routes>
      </>
   );
}

export default App;
