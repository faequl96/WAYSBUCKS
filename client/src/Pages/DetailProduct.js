import { useContext, useEffect, useState } from "react";
import { Container, Image, Button, Badge } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import checkIcon from '../assets/check.png';
import { AppContext } from "../contexts/AppContext";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/Api";

export const DetailProduct = () => {
   const {id} = useParams();

   const contexts = useContext(AppContext);

   let { data: product } = useQuery("productCache", async () => {
      const response = await API.get("/product/" + id);
      return response.data.data;
   });

   
  
   let { data: toppings } = useQuery("toppingsCache", async () => {
      const response = await API.get("/toppings");
      return response.data.data;
   });

   const [toppingCheck, setToppingCheck] = useState([]);
   const [totalPrice, setTotalPrice] = useState();

   useEffect(() => {
      setTotalPrice(product?.price)
   }, [product])

   const handlerCheckTopping = (id, price) => {
      let filterID = toppingCheck.filter((e) => e === id);
      if (filterID[0] !== id) {
         setToppingCheck([...toppingCheck, id]);
         setTotalPrice(totalPrice + price);
      } else {
         setToppingCheck(toppingCheck.filter((e) => e !== id));
         setTotalPrice(totalPrice - price);
      }
   };

   const handlerAddCart = useMutation(async (e) => {
      try {
         e.preventDefault();
  
         const config = {headers: {"Content-type": "application/json"}};
         const body = JSON.stringify({
            product_id: parseInt(id),
            toppings_id: toppingCheck,
            price: totalPrice
         });
         await API.post("/add-cart", body, config);
   
         setToppingCheck([]);
         setTotalPrice(product.price)

         const response = await API.get("/cart");
         contexts.setCartLength(response.data.data.length);

      } catch (error) {
         console.log(error);
      }
   });
   
   return (
      <Container
         className="row m-auto"
         style={{padding : "160px 90px"}}
      >
         <div className="mb-4 col-5 pe-5">
            <Image src={product?.image} width="100%"/>
         </div>
         <div className="col-7" style={{ fontSize: "1.15rem" }}>
               <h3 className="fs-1 fw-bolder mb-3 text-danger">{product?.title}</h3>
               <p className="fs-4 fw-semibold mb-5" style={{color : "#984c4c"}}>{contexts.formatCurrency.format(product?.price)}</p>
               <p className="fs-2 fw-bold" style={{color : "#984c4c"}}>Toping</p>
               <div className="row">
                  {toppings?.map((item, index) => (
                     <div key={index} className='col-3 text-center p-0 mb-2 mt-3 position-relative'>
                        <img src={item.image} alt="" className="w-50 mb-2" style={{ cursor: 'pointer' }}
                           onClick={() =>
                              handlerCheckTopping(item.id, item.price)
                           }
                        />
                        {toppingCheck.filter((element) => element === item.id)[0] === item.id && (
                           <Badge bg='success' pill style={{ height: '25px', width: '25px', top: '60px', right: '34px' }} className='d-flex align-items-center justify-content-center position-absolute'>
                              <img src={checkIcon} alt="" style={{ height: '25px', width: '25px' }}/>
                           </Badge>
                        )}
                        <p className="fs-6 fw-semibold text-danger">{item.title}</p>
                     </div>
                  ))}
               </div>
               <div className='row justify-content-between mt-5 mb-3' style={{color : "#984c4c"}}>
                  <p className="col-3 fs-4 fw-bolder">Total</p>
                  <p className="col-3 fs-4 fw-bolder text-end">{contexts.formatCurrency.format(totalPrice)}</p>
               </div>
               <Button variant='danger' className="w-100 fw-bold" onClick={(e) => handlerAddCart.mutate(e)}>Add Cart</Button>
         </div>
      </Container>
   );
};