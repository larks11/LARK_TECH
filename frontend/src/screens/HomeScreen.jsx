import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <div
      style={{
        backgroundColor: '#000', // full black background
        minHeight: '100vh',
        color: '#FFD700',
        padding: 0,
        margin: 0,
        width: '100%',
        overflowX: 'hidden', // ✅ prevents white edges
      }}
    >
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <div style={{ padding: '20px' }}>
          <Link
            to="/"
            className="btn"
            style={{
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              marginBottom: '20px',
            }}
          >
            Go Back
          </Link>
        </div>
      )}

      <div
        style={{
          backgroundColor: '#000',
          paddingTop: '30px',
          paddingBottom: '50px',
        }}
      >
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Meta />
            <h1
              className="text-center mb-4"
              style={{
                color: '#FFD700',
                fontWeight: 'bold',
                letterSpacing: '1px',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
            >
              Latest Products
            </h1>

            <Container
              fluid
              className="px-5" // remove auto side padding
              style={{
                backgroundColor: '#000',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Row className="g-4 justify-content-center">
                {data.products.map((product) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className="d-flex justify-content-center"
                  >
                    <div
                      style={{
                        backgroundColor: '#111',
                        border: '1px solid #FFD700',
                        borderRadius: '12px',
                        padding: '10px',
                        width: '100%',
                        maxWidth: '250px',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                        transition: 'transform 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = 'scale(1.03)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = 'scale(1)')
                      }
                    >
                      <Product product={product} />
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>

            <div className="mt-4 d-flex justify-content-center">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
