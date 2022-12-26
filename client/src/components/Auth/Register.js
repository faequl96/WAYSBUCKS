import React, { useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';

function Register() {
	const contexts = useContext(AppContext)

   return (
      <Modal show={contexts.showRegister} onHide={() => contexts.setShowRegister(false)} centered>
         <Modal.Body>
         <Modal.Title className="mb-5 fw-bolder fs-1 text-danger">Register</Modal.Title>
         <Form onSubmit={(e) => contexts.handlerRegister.mutate(e)}>
            {contexts.regisMessage !== '' && (contexts.regisMessage)}
            <Form.Group className="mb-4">
               <Form.Control
                  className='border border-3 border-danger'
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={contexts.regisData.email}
                  onChange={contexts.OnChangeFormRegis}
               />
               </Form.Group>
            <Form.Group className="mb-4">
               <Form.Control
                  className='border border-3 border-danger'
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={contexts.regisData.password}
                  onChange={contexts.OnChangeFormRegis}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Form.Control
                  className='border border-3 border-danger'
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={contexts.regisData.name}
                  onChange={contexts.OnChangeFormRegis}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Form.Select
               className='border border-3 border-danger'
               name='role'
               value={contexts.regisData.role}
               onChange={contexts.OnChangeFormRegis}
               >
                  <option>Choose Role</option>
                  <option value='customer'>As Customer</option>
                  <option value='admin'>As Admin</option>
               </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
               <Button variant='danger' className="w-100" type='submit'>Register</Button>
            </Form.Group>
         </Form>
         <p className='text-muted'>
            Already have an account ? Click{' '}
            <span
               style={{ cursor: 'pointer' }}
               className='text-primary cursor-pointer'
               onClick={() => {
                  contexts.setShowRegister(false);
                  contexts.setShowLogin(true);
               }}
            >
               Here
            </span>
         </p>
         </Modal.Body>
      </Modal>
   );
}

export default Register;