import { useContext } from 'react';
import {Button, Container, Nav, Navbar, Offcanvas} from 'react-bootstrap';
import logo from '../../assets/logo.png';
import NavProfile from './NavProfile';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';

const style = {
   button: {
      width : "120px",
   }
}

function Navibar() {
   const contexts = useContext(AppContext)

   return (
      <>
         {['md'].map((expand) => (
            <Navbar key={expand} expand={expand} className="mb-3 pt-4 start-0 end-0 top-0" style={{position: "fixed", zIndex: "9", background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(7px)"}}>
               <Container>
                  <Navbar.Brand>
                     <Link
                        to={'/'}
								className='text-dark text-decoration-none d-flex gap-2'
							>
								<img alt="" src={logo} width="80" height="80" className="d-inline-block align-top"/>
							</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                  <Navbar.Offcanvas
                     id={`offcanvasNavbar-expand-${expand}`}
                     aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                     placement="end"
                  >
                     <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>NavBar</Offcanvas.Title>
                     </Offcanvas.Header>
                     <Offcanvas.Body>
                        {!contexts.isLogin ? (
                           <Nav className="justify-content-end flex-grow-1 pe-3">
                              <Button onClick={() => contexts.setShowLogin(true)} variant='outline-danger' className='me-3 py-1 border border-3 border-danger fw-bold' style={style.button}>Login</Button>
                              <Button onClick={() => contexts.setShowRegister(true)} variant='outline-danger' className='py-1 border border-3 border-danger fw-bold' style={style.button}>Register</Button>
                           </Nav>
                        ) : (
                           <NavProfile 
                              setIsLogin={contexts.setIsLogin}
                              cartLength={contexts.cartLength}
                           />
                        )}
                     </Offcanvas.Body>
                  </Navbar.Offcanvas>
               </Container>
            </Navbar>
         ))}
      </>
   );
}

export default Navibar;