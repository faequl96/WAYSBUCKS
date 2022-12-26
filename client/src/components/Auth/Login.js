import React, { useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';

function Login() {
   const contexts = useContext(AppContext)

   return (
      <Modal show={contexts.showLogin} onHide={() => contexts.setShowLogin(false)} centered>
         <Modal.Body>
         <Modal.Title className="mb-5 fw-bolder fs-1 text-danger">Login</Modal.Title>
         <Form onSubmit={(e) => contexts.handlerLogin.mutate(e)}>
            {contexts.loginMessage !== '' && (contexts.loginMessage)}
            <Form.Group className="mb-4">
               <Form.Control
                  className='border border-3 border-danger'
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={contexts.loginData.email}
                  onChange={contexts.OnChangeFormLogin}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Form.Control
                  className='border border-3 border-danger'
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={contexts.loginData.password}
                  onChange={contexts.OnChangeFormLogin}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Button variant='danger' className="w-100" type='submit'>Login</Button>
            </Form.Group>
            
         </Form>
         <p className="text-muted">
            Don't have an account ? click{" "}
            <span
               style={{ cursor: "pointer" }}
               className="text-primary"
               onClick={() => {
                  contexts.setShowLogin(false);
                  contexts.setShowRegister(true);
               }}
            >
               Here
            </span>
         </p>
         </Modal.Body>
      </Modal>
   );
}

export default Login;