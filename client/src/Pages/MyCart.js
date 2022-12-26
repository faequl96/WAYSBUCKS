import { useContext, useEffect, useState } from "react";
import { Container, Image, Button, Form } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import trashIcon from "../assets/trash.png";
import attachIcon from "../assets/attache.png";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/Api";
import { useNavigate } from "react-router-dom";


export const MyCart = () => {
   const contexts = useContext(AppContext);
   const navigate = useNavigate();

   let { data: cart, refetch } = useQuery("cartsCache", async () => {
      const response = await API.get("/cart");

      if(response.data.data === 0) {
         contexts.setCartLength(0)
      } else {
         contexts.setCartLength(response.data.data.length)
         return response.data.data;
      }
   });

   let cartId = cart?.map((item) => item.id)

   let price = cart?.map((item) => item.price)
   let totalPrice = price?.reduce((a, b) => a + b, 0);

   const handlerDeleteCart = async (id) => {
      await API.delete(`/cart/` + id);
      refetch();
   }

   let [transactionData, setTransactionData] = useState({
      name: "",
      email: "",
      phone: "",
      pos_code: "",
      address: ""
   });


   const OnChangeFormTrans = (e) => setTransactionData({ ...transactionData, [e.target.name]: e.target.value })

   const handlerTransaction = useMutation(async (e) => {
      try {
         e.preventDefault();
  
         const config = {headers: {"Content-type": "application/json"}};
         let body = JSON.stringify({
            name: transactionData.name,
            email: transactionData.email,
            phone: transactionData.phone,
            pos_code: transactionData.pos_code,
            address: transactionData.address,
            total_price: totalPrice,
            status: "Waiting Approve",
            cart_id: cartId
         });
         
         const resMidtrans = await API.post("/create-transaction", body, config);
         const token = resMidtrans.data.data.token;

         window.snap.pay(token, {
            onSuccess: function (result) {
               navigate("/customer/myprofile");
            },
            onPending: function (result) {
               navigate("/customer/myprofile");
            },
            onError: function (result) {
               console.log(result);
            },
            onClose: function () {
               alert("you closed the popup without finishing the payment");
            },
         });

         const days = new Date().getDay();
         let day = ""
         if(days === 0) {
            day = "Sunday"
         } else if(days === 1) {
            day = "Monday"
         } else if(days === 2) {
            day = "Tuesday"
         } else if(days === 3) {
            day = "Wednesday"
         } else if(days === 4) {
            day = "Thursday"
         } else if(days === 5) {
            day = "Friday"
         } else if(days === 6) {
            day = "Saturday"
         }
         let second = new Date().getSeconds();
         if(second < 10) {second = `0${second}`};
         let minute = new Date().getMinutes();
         if(minute < 10) {minute = `0${minute}`}
         let hour = new Date().getHours();
         if(hour < 10) {hour = `0${hour}`};
         const date = new Date().getDate();
         const month = new Date().getMonth();
         const year = new Date().getFullYear();
         const time = `${date}-${month}-${year} at ${hour}:${minute}:${second}`;
         
         const bodyUpdateCart = JSON.stringify({
            id: cartId,
            is_payed: true,
            trans_day: day,
            trans_time: time
         });
         const response = await API.patch("/update-cart", bodyUpdateCart, config);

         if(response.data.data !== 0) {
            contexts.setCartLength(response.data.data.length)
         }

         refetch()
         setTransactionData({name: "", email: "", phone: "", pos_code: "", address: ""})

      } catch (error) {
         console.log(error);
      }
   })

   useEffect(() => {
      const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
      const myMidtransClientKey = "SB-Mid-client-oHRMncHcXqOdGAwt";

      let scriptTag = document.createElement("script");
      scriptTag.src = midtransScriptUrl;
      scriptTag.setAttribute("data-client-key", myMidtransClientKey);

      document.body.appendChild(scriptTag);
      return () => {
          document.body.removeChild(scriptTag);
      };

  }, []);
   
   return (
      <Container
         className="row m-auto"
         style={{padding : "160px 86px"}}
      >
         <div className="mb-4 col-8 pe-5">
            <div className="border-bottom border-1 border-dark">
               <h3 className="fw-bolder fs-2 mb-4 text-danger">My Cart</h3>
               <h6 className="fw-semibold fs-5 mb-3 text-danger">Review Your Order</h6>
            </div>
            <div className="border-bottom border-1 border-dark pt-2 pb-2">
               {cart?.map((item, index) => (
                  <div key={index} className="row mt-2 mb-4">
                     <div className="col-2">
                        <div className="w-100">
                           <Image className="w-100" src={item.product.image}/>
                        </div>
                     </div>
                     <div className="col-8 pe-0">
                        <p className="text-danger fw-bolder fs-5">{item.product.title}</p>
                        <div className="row">
                           <p className="col-2 fw-bold pe-0" style={{color : "#984c4c"}}>Toping :</p>
                           <div className="col-9 ps-0">
                              {item.toppings?.map((topping, index) => (
                                 <span key={index} className="fw-semibold fs-6 text-danger">{topping.title}, </span>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="col-2 d-grid">
                        <p className="text-end fw-semibold text-danger">{contexts.formatCurrency.format(item.price)}</p>
                        <Image 
                           className="ms-auto" 
                           width="26" style={{ cursor: "pointer"}} 
                           src={trashIcon}
                           onClick={() => handlerDeleteCart(item.id)}
                        />
                        <p className="opacity-0">space</p>
                     </div>
                  </div>
               ))}
            </div>
            <div className="">
               <div className="d-flex mt-4 mb-2 text-danger fw-semibold">
                  <div className="col-7 pe-4 pt-3">
                     <div className="border-top border-bottom border-1 border-dark">
                        <div className="d-flex pt-3">
                           <p className="col-6 text-start">Subtotal</p>
                           <p className="col-6 text-end">
                              {contexts.cartLength === 0 ? (
                                 contexts.formatCurrency.format(0)
                              ) : (
                                 contexts.formatCurrency.format(totalPrice)
                              )}
                           </p>
                        </div>
                        <div className="d-flex pb-1">
                           <p className="col-6 text-start">Qty</p>
                           <p className="col-6 text-end">
                              {contexts.cartLength === 0 ? (
                                 <span className="fw-bold">-</span>
                              ) : (
                                 cart?.length
                              )}
                           </p>
                        </div>
                     </div>
                     <div className="d-flex pt-3 fw-bolder">
                        <p className="col-6 text-start">Total</p>
                        <p className="col-6 text-end">
                           {contexts.cartLength === 0 ? (
										contexts.formatCurrency.format(0)
									) : (
										contexts.formatCurrency.format(totalPrice)
									)}
                        </p>
                     </div>
                  </div>
                     
                  <div className="col-5 d-grid pt-3">
                     <Image src={attachIcon} className="ms-auto" style={{ width: '240px' }}/>
                  </div>
               </div>
            </div>
         </div>
         <div className="col-4 ps-4">
            <Form onSubmit={(e) => handlerTransaction.mutate(e)} style={{ marginTop: "100px" }}>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="text"
                     name="name"
                     placeholder="Name"
                     value={transactionData.name}
                     onChange={OnChangeFormTrans}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="email"
                     name="email"
                     placeholder="Email"
                     value={transactionData.email}
                     onChange={OnChangeFormTrans}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="text"
                     name="phone"
                     placeholder="Phone"
                     value={transactionData.phone}
                     onChange={OnChangeFormTrans}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="text"
                     name="pos_code"
                     placeholder="Pos Code"
                     value={transactionData.pos_code}
                     onChange={OnChangeFormTrans}
                  />
               </Form.Group>
               <Form.Group className="mb-5">
                  <Form.Control as="textarea" 
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     rows={3} 
                     className='border border-3 border-danger fs-5'
                     name="address"
                     placeholder="Address"
                     value={transactionData.address}
                     onChange={OnChangeFormTrans}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Button type="submit" variant='danger fw-semibold' className="w-100 fs-5" style={{ paddingTop: "5px", paddingBottom: "7px" }}>
                     Pay
                  </Button>
               </Form.Group>
            </Form>
         </div>
      </Container>
   );
};