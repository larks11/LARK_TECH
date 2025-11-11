import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <div
      style={{
        backgroundColor: '#000',
        width: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        borderBottom: '2px solid #FFD700',
      }}
    >
      <Carousel
        pause="hover"
        indicators={true}
        style={{
          backgroundColor: '#000',
          height: '600px', // ✅ same dako nga size sa una
        }}
      >
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '600px',
                  backgroundColor: '#000',
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxHeight: '500px',
                    width: 'auto',
                    objectFit: 'contain',
                    border: '2px solid #FFD700',
                    borderRadius: '10px',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                  }}
                  fluid
                />
              </div>

              <Carousel.Caption
                style={{
                  background: 'rgba(0, 0, 0, 0.75)',
                  padding: '15px',
                  borderTop: '2px solid #FFD700',
                  borderBottom: '2px solid #FFD700',
                }}
              >
                <h2
                  style={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
                    fontSize: '1.8rem',
                  }}
                >
                  {product.name} (₱{product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-color: #FFD700;
          border-radius: 50%;
        }
        .carousel-indicators [data-bs-target] {
          background-color: #FFD700;
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;
