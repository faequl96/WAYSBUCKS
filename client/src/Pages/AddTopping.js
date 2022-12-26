import { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "../config/Api";
import blankImage from "../assets/blankImage.png"

export const AddTopping = () => {

   const [preview, setPreview] = useState(blankImage);
   let [toppingData, setToppingData] = useState({
      title: "",
      price: "",
      image: ""
   });

   const handleOnChange = (e) => {
      setToppingData({...toppingData, [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value});
      
      if (e.target.type === "file") {
         let url = URL.createObjectURL(e.target.files[0]);
         setPreview(url);
      }
   };

   const handlerAddTopping = useMutation(async (e) => {
      try {
         e.preventDefault();

         const formData = new FormData();
         formData.set("title", toppingData.title);
         formData.set("price", toppingData.price);
         if(toppingData?.image !== undefined) {
            formData.set("image", toppingData?.image[0], toppingData?.image[0]?.name);
         }
         
         await API.post("/topping", formData);

         setToppingData({title: "", price: "", image: ""})
         setPreview(blankImage)

      } catch (error) {
         console.log(error);
      }
   })
   
   return (
      <Container
         className="row m-auto"
         style={{padding : "160px 86px"}}
      >
         <div className="col-7 ps-4 pe-5">
            <h1 className="fw-bolder fs-2 mb-4 text-danger">Topping</h1>
            <Form onSubmit={(e) => handlerAddTopping.mutate(e)} style={{ marginTop: "100px" }}>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="text"
                     name="title"
                     placeholder="Title"
                     value={toppingData.title}
                     onChange={handleOnChange}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="number"
                     name="price"
                     placeholder="Price"
                     value={toppingData.price}
                     onChange={handleOnChange}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Form.Control
                     style={{ paddingTop: "8px", paddingBottom: "8px" }}
                     className='border border-3 border-danger fs-5'
                     type="file"
                     name="image"
                     placeholder="Image"
                     {...toppingData.image === "" && ({value:""})}
                     onChange={handleOnChange}
                  />
                  
               </Form.Group>
               <Form.Group className="mb-4 mt-5 pt-5">
                  <Button type="submit" variant='danger fw-semibold' className="w-100 fs-5" style={{ paddingTop: "5px", paddingBottom: "7px" }}>
                     Add Topping
                  </Button>
               </Form.Group>
            </Form>
         </div>
         <div className="mb-4 col-5 pe-4 ps-5 mt-5">
            <div style={{width: "100%"}}>
               <img src={preview} width="100%"/>
            </div>
         </div>
      </Container>
   );
};