import { useContext, useEffect, useState } from "react";
import { Container, Image, Button, Form } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import barcodIcon from "../assets/barcod.png";
import logo from "../assets/logo.png";
import editProfile from '../assets/edit.png';
import profileImage from "../assets/profileImg.png";
import { API } from "../config/Api";
import { useMutation, useQuery } from "react-query";
import { UserContext } from "../contexts/UserContext";

export const MyProfile = () => {
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);
   const [trans, setTrans] = useState();
   const [profile, setProfile] = useState();
   const [isEdit, setIsEdit] = useState(false);

   useEffect(() => {
      async function getDataTrans() {
         const result = await API.get("/transaction");
         setTrans(result.data.data);
      }
      getDataTrans();

      async function getDataProfile() {
         const result = await API.get("/check-auth");
         setProfile(result.data.data);
      }
      getDataProfile();

   }, [])

   let { data: user, refetch } = useQuery("userCache", async () => {
      // setIsLoading(true);
      const response = await API.get(`/user/${state.user.id}`);
      // setIsLoading(false);
      return response.data.data;
   }, { refetchOnWindowFocus: false });

   const [preview, setPreview] = useState();
   const [editData, setEditData] = useState({
      name: "",
      email: "",
      image: "",
   });

   useEffect(() => {
      setPreview(user?.image)
      setEditData({name: user?.name, email: user?.email})
   }, [user])
 
   const handleChange = (e) => {
      setEditData({...editData, [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value});
 
      if (e.target.type === "file") {
         let url = URL.createObjectURL(e.target.files[0]);
         setPreview(url);
      }
   };

   const handleSubmit = useMutation(async (e) => {
      try {
         e.preventDefault();
   
         const formData = new FormData();
         formData.set("name", editData.name);
         formData.set("email", editData.email);
         if(editData?.image !== undefined) {
            formData.set("image", editData?.image[0], editData?.image[0]?.name);
         }

         await API.patch(`/user/${state.user.id}`, formData);

         refetch()
         contexts.refreshNavbar()
         setIsEdit(false)
      } catch (error) {
         console.log(error);
      }
   });

   return (
      <Container
      className="row m-auto"
      style={{padding : "160px 86px"}}
      >
         <div className="col-6 pe-5">
            <div>
               <h3 className="fw-bolder fs-3 mb-4 text-danger" style={{color : "#984c4c"}}>My Profile</h3>
            </div>
            
            {!isEdit ? (
               <>
                  <div className="d-flex">
                     <div className="col-5 pe-4">
                        <div className="rounded-2 overflow-hidden">
                           <Image className="w-100" src={preview}/>
                        </div>
                     </div>
                     <div className="col-7 ps-2 pt-2 pb-2">
                        <h5 className="fw-bold">Full Name</h5>
                        <h6 className="fs-5 fw-semibold mb-3">{profile?.name}</h6>
                        <h5 className="fw-bold">Email</h5>
                        <h6 className="fs-5 fw-semibold">{profile?.email}</h6>
                     </div>
                  </div>
                  <div className='col-5 pe-4'>
                     <Button onClick={() => setIsEdit(true)} variant='' className='fs-5 fw-semibold text-light w-100' style={{backgroundColor: "#dc3545", marginTop: "50px", width: "160px"}}>Edit Profile</Button>
                  </div>
               </>
            ) : (
               <>
                  <div className="d-flex">
                     <div className="col-5 pe-4 position-relative">
                        <div className="rounded-2 overflow-hidden">
                           <Image className="w-100" src={preview}/>
                        </div>
                        <label htmlFor="photo" className='position-absolute start-0 top-0 d-flex align-items-center' style={{cursor: "pointer", width: "89%", height: "100%", backgroundColor: "rgba(0,0,0,.5)"}}>
                           <img src={editProfile} width="100%" style={{zIndex: "1"}}/>
                        </label>
                     </div>
                     <div className="col-7 ps-2 pt-2 pb-2">
                        <Form id='profileField'>
                           <h5 className="fw-bold mb-1">Full Name</h5>
                           <Form.Group className="mb-3">
                              <Form.Control
                                 className='border-start-0 border-end-0 border-top-0 rounded-0 px-0 fs-5 py-0 text-muted'
                                 style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                                 type="text"
                                 name="name"
                                 placeholder="Name"
                                 value={editData.name}
                                 onChange={handleChange}
                              />
                           </Form.Group>
                           <h5 className="fw-bold mb-1">Email</h5>
                           <Form.Group className="mb-3">
                              <Form.Control
                                 className='border-start-0 border-end-0 border-top-0 rounded-0 px-0 fs-5 py-0 text-muted'
                                 style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                                 type="email"
                                 name="email"
                                 placeholder="Email"
                                 value={editData.email}
                                 onChange={handleChange}
                              />
                           </Form.Group>
                           <Form.Group className="mb-2">
                              <Form.Control
                                 id='photo'
                                 className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 py-1 text-muted invisible'
                                 style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                                 type="file"
                                 name="image"
                                 placeholder="Image"
                                 onChange={handleChange}
                              />
                           </Form.Group>
                        </Form>
                     </div>
                  </div>
                  <div className='col-5 pe-4'>
                     <Button onClick={(e) => handleSubmit.mutate(e)} type='submit' variant='' className='fs-5 fw-semibold text-light w-100' style={{backgroundColor: "#dc3545", marginTop: "50px", width: "160px"}}>Save</Button>
                  </div>
               </>
            )}
         </div>
         <div className="col-6">
            <div>
               <h3 className="fw-bolder fs-3 mb-4" style={{color : "#984c4c"}}>My Transaction</h3>
            </div>
            {trans !== 0 && trans !== undefined && (
               <>
                  {trans?.map((trans, index) => (
                     <div key={index} className="d-flex rounded rounded-3 px-2 mb-3" style={{backgroundColor: '#f6dada'}}>
                        <div className="col-9 mt-2 mb-4 pt-2 ps-3">
                        {trans.carts.map((cart, index) => (
                           <div key={index} className="d-flex mb-2"> 
                              <div className="col-3 pe-3">
                                 <div className="w-100 rounded rounded-3 overflow-hidden">
                                    <Image className="w-100" src={cart.product.image}/>
                                 </div>
                              </div>
                              <div className="col-9">
                                 <div className="mb-3">
                                    <p className="fw-bolder fs-6 mb-1" style={{color : "#c90e2d"}}>{cart.product.title}</p>
                                    <p className="text-danger fw-bold mb-2" style={{fontSize: '0.7rem'}}>
                                       <span className="fw-bolder" style={{color : "#c90e2d"}}>{cart.trans_day}, </span>
                                       {cart.trans_time}
                                    </p>
                                 </div>
                                 
                                 <div className="d-flex" style={{fontSize: "0.75rem"}}>
                                    <p className="fw-bold mb-0 d-flex justify-content-between pe-2" style={{color : "#984c4c", width: "21%"}}>
                                       <p className="mb-1">Toping</p>
                                       <p className="mb-1">:</p>
                                    </p>
                                    <div className="col-9 mb-1">
                                       {cart.toppings.map((topping, index) => (
                                          <span key={index} className="fw-semibold text-danger">{topping.title}, </span>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="d-flex" style={{fontSize: "0.75rem", color : "#984c4c"}}>
                                    <p className="fw-bold mb-0 d-flex justify-content-between pe-2" style={{width: "21%"}}><p>Price</p><p>:</p></p> 
                                    <p className="col-9 fw-semibold">{contexts.formatCurrency.format(cart.price)}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                        </div>

                        <div className="col-3 mt-2 mb-3">
                           <div className="w-50 m-auto p-2">
                              <Image className="w-100" src={logo}/>
                           </div>
                           <div className="w-75 m-auto px-3 py-2">
                              <Image className="w-100" src={barcodIcon}/>
                           </div>
                           <div className="m-auto px-0 py-2">
                              <Button
                                 variant='fw-semibold pt-1' className="w-100 fw-semibold"
                                 style={{color : "#00b1dd", backgroundColor: "rgba(0, 202, 232, .12)", fontSize: "0.75rem", paddingBottom: "7px"}}
                              >
                                 {trans.status}
                              </Button>
                           </div>
                           <div className="w-100 m-auto text-center">
                              <span className="fw-bold" style={{color : "#984c4c", fontSize: "0.75rem"}}>Total : {contexts.formatCurrency.format(trans.total_price)}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </>
            )}
         </div>
      </Container>
   );
};