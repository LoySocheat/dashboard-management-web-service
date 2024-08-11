import Image404 from '../assets/images/error_404.jpg';
const NotFound = () => {
    return ( 
        <div className="not-found-container">
            <h1>404</h1>
            <p>Oops! The page you're looking for isn't here.</p>
            <p>It might have been removed, or the URL might be incorrect.</p>
    
            {/* Include an image or creative graphic if you have one */}
            <div className="not-found-image">
            <img src={Image404} alt="Not Found" />
            </div>
      </div>
     );
}
 
export default NotFound;