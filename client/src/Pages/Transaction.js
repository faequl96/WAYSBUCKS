import { useContext, useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { API } from "../config/Api";
import { AppContext } from "../contexts/AppContext";


export const Transactions = () => {
   const contexts = useContext(AppContext);
   const [trans, setTrans] = useState();

   useEffect(() => {
      async function getDataTrans() {
         const result = await API.get("/transactions");
         setTrans(result.data.data);
      }
      getDataTrans();
   }, [])

   return (
      <Container style={{padding : "160px 90px"}}>
         <h1>Income Transaction</h1>
         <div className="me-2">
            <Table hover>
               <thead>
                  <tr className="bg-secondary">
                     <th>No</th>
                     <th>Name</th>
                     <th>Address</th>
                     <th>Post Code</th>
                     <th>Income</th>
                     <th>Status</th>
                  </tr>
               </thead>
               <tbody>
               {trans !== 0 && trans !== undefined && (
                  <>
                     {trans?.map((tran, index) => (
                        <tr key={index}>
                           <td>{index + 1}</td>
                           <td>{tran?.name}</td>
                           <td>{tran?.address}</td>
                           <td>{tran?.pos_code}</td>
                           <td>{contexts.formatCurrency.format(tran?.total_price)}</td>
                           <td>{tran?.status}</td>
                        </tr>
                     ))}
                  </>
               )}
               </tbody>
            </Table>
         </div>
      </Container>
   )
   
};
