import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FixedToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        top: '80px', 
        zIndex: 9999
      }}
      toastStyle={{
        marginTop: '1rem',
        background: '#fff',
        color: '#000',
        borderRadius: '4px',
      }}
    />
  );
};

export default FixedToastContainer;