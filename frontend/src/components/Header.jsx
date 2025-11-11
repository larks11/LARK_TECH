import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar
        expand="lg"
        collapseOnSelect
        variant="dark"
        style={{
          backgroundColor: '#000', // Black background
          borderBottom: '2px solid #FFD700', // Gold accent
        }}
      >
        <Container>
          {/* ✅ Logo + Brand */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Logo"
              style={{
                width: '55px',
                height: '55px',
                marginRight: '10px',
              }}
            />
            <span
              className="logo-text"
              style={{
                fontWeight: 'bold',
                fontSize: '1.7rem',
                color: '#FFD700', // Gold text
                letterSpacing: '1px',
              }}
            >
              LARKTECHS
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <SearchBox />

              <Nav.Link
                as={Link}
                to="/cart"
                style={{ color: '#FFD700', fontWeight: '500' }}
              >
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="warning" style={{ marginLeft: '5px', color: 'black' }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo ? (
                <>
                  <NavDropdown
                    title={<span style={{ color: '#FFD700' }}>{userInfo.name}</span>}
                    id="username"
                    menuVariant="dark"
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={Link} to="/login" style={{ color: '#FFD700' }}>
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={<span style={{ color: '#FFD700' }}>Admin</span>}
                  id="adminmenu"
                  menuVariant="dark"
                >
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
