import { Dropdown, Image, Badge, Nav } from 'react-bootstrap';

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import cartIcon from '../../assets/cartIcon.png';
import profileIcon from '../../assets/profile.png';
import logoutIcon from '../../assets/logout.png';
import transIcon from '../../assets/transactions.png';
import productIcon from '../../assets/drink.png';
import toppingIcon from '../../assets/toping.png';
import { UserContext } from '../../contexts/UserContext';
import { AppContext } from '../../contexts/AppContext';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';


const NavProfile = ({ cartLength }) => {
	const navigate = useNavigate();
	const [state, dispatch] = useContext(UserContext);
	const contexts = useContext(AppContext);

	const handlerLogout = () => {
		dispatch({
			type: "LOGOUT",
		});
		contexts.setIsLogin(false)
		contexts.setCartLength(0)
		navigate("/");
	};

	return (
		<>
         <Nav className="justify-content-end flex-grow-1 fs-5 pe-0">
            <div className='d-flex align-items-center gap-4'>
               {state.user.role === 'customer' && (
                  <>
                     <Image src={cartIcon} width='40px' height='40px' onClick={() => navigate('/mycart')} style={{ cursor: 'pointer' }}/>
                     {cartLength !== 0 && (
                        <Badge bg='danger' pill style={{ height: '25px', width: '25px' }} className='d-flex align-items-center justify-content-center fs-6 position-absolute ms-4'>
                           {cartLength}
                        </Badge>
                     )}
                  </>
               )}
               <Dropdown>
                  <DropdownToggle variant='' className="pt-0 position-relative px-0" style={{border: "1px solid #fff", height: "60px"}}>
                     <div className='rounded-pill overflow-hidden mb-0' style={{border: "2px solid #454545", marginTop: "-1px", height: "62px", width: "62px"}}>
                        <Image src={contexts.profilePhoto} width='100%'/>
                     </div>
                     <div className='position-absolute' style={{height: "13px", width: "60px", backgroundColor: "#fff"}}></div>
                  </DropdownToggle>
                  <Dropdown.Menu
                     align="end"
                     title="Dropdown end"
                     id="dropdown-menu-align-end"
                     className='rounded-3 mt-3 position-absolute pb-0'
                     style={{zIndex: "9", background: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .4)", border: "2px solid rgba(220,53,69, .5)"}}
                  >
                     <div className='position-absolute' 
                        style={{width: "20px", height: "20px", transform: "rotate(45deg)", right: "21px", top: "-11px", backgroundColor: "white", zIndex: "1", borderTop: "2px solid rgba(220,53,69, .5)", borderLeft: "2px solid rgba(220,53,69, .5)"}}
                     ></div>
                     <Dropdown.Item as={Link} to={state.user.role === 'customer' ? '/customer/profile' : '/admin/transaction'} className='fs-5 mb-3 mt-2' style={{width: "220px"}}>
                        {state.user.role === 'customer' ? (
									<div className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                              <Image src={profileIcon} width='40px' className='me-3'/>
                              <span className='d-inlineblock'>Profile</span>
                           </div>
								) : (
									<div className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                              <Image src={transIcon} width='40px' className='me-3'/>
                              <span className='d-inlineblock'>Transactions</span>
                           </div>
								)}
                     </Dropdown.Item>
                     {state.user.role === 'admin' && (
								<>
									<Dropdown.Item as={Link} to='/add-product' className='fs-5 mb-3'>
                              <div className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                 <Image src={productIcon} width='40px' className='me-3'/>
                                 <span className='d-inlineblock'>Add Product</span>
                              </div>
                           </Dropdown.Item>
									<Dropdown.Item as={Link} to='/add-topping' className='fs-5 mb-3'>
                              <div className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                 <Image src={toppingIcon} width='40px' className='me-3'/>
                                 <span className='d-inlineblock'>Add Topping</span>
                              </div>
                           </Dropdown.Item>
									</>
								)}
                     <Dropdown.Item className='fs-5 pt-3 pb-3' style={{ borderTop: "2px solid rgba(120, 120, 120, .4)"}}>
                        <div onClick={handlerLogout} className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                           <Image src={logoutIcon} width='40px' className='me-3'/>
                           <span className='d-inlineblock'>Logout</span>
                        </div>
                     </Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
            </div>
         </Nav>
         
			{/* <Nav className='ms-auto'>
				<div className='d-flex align-items-center gap-3' style={{ cursor: 'pointer' }}>
					{state.user.role === 'customer' && (
						<>
							<Image src={cartIcon} width='40px' height='40px' onClick={() => navigate('/mycart')}/>
							{cartLength > 0 && (
								<Badge bg='danger' pill style={{ height: '25px', width: '25px' }} className='d-flex align-items-center justify-content-center fs-6 position-absolute ms-4'>
									{cartLength}
								</Badge>
							)}
						</>
					)}

					<Dropdown>
						<Dropdown.Toggle variant='' id='dropdown-basic'>
							<Image src={profileImage} width='45px' height='45px' className='rounded-pill'/>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item className=' align-items-center border-bottom' style={{ height: '50px' }} >
								<Link
									to={state.user.role === 'customer' ? '/customer/myprofile' : '/admin/transaction'}
									className='text-dark text-decoration-none d-flex gap-2'
								>
									{state.user.role === 'customer' ? (
										<>
											<Image src={profileIcon} width='25px' />
											<span>Profile</span>
										</>
									) : (
										<>
											<Image src={profileIcon} width='25px' />
											<span>Transaction</span>
										</>
									)}
								</Link>
							</Dropdown.Item>
								{state.user.role === 'admin' && (
									<>
										<Dropdown.Item className='d-flex gap-2 align-items-center border-bottom' style={{ height: '50px' }}>
											<Link to='/add-product' className='text-dark text-decoration-none d-flex gap-2'>
												<Image src={drinkIcon} width='25px' />
												Add Product
											</Link>
										</Dropdown.Item>
										<Dropdown.Item className='d-flex gap-2 align-items-center border-bottom' style={{ height: '50px' }}>
											<Link to='/add-topping' className='text-dark text-decoration-none d-flex gap-2'>
												<Image src={topingIcon} width='25px' />
												Add Topping
											</Link>
										</Dropdown.Item>
									</>
								)}
							<Dropdown.Item
								className='d-flex gap-2 align-items-center'
								style={{ height: '50px' }}
								onClick={handlerLogout}
							>
								<Image src={logoutIcon} width='25px' />
								Logout
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</Nav> */}
         
		</>
	);
};

export default NavProfile;