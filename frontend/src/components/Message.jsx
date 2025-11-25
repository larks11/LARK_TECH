import { Alert } from 'react-bootstrap';
import '../assets/styles/Message.css';

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
