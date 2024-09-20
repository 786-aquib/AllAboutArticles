import { useNavigate } from "react-router-dom";

function WebsiteName() {
  const navigate = useNavigate();

  // Handler function for navigation
  const handleClick = () => {
    navigate("/Home");
  };

  return (
    <div>
      <h3>
        <img 
          src="https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg" 
          width={140} 
          alt="Website Logo" 
          onClick={handleClick} // Use the handler function here
          style={{ cursor: 'pointer' }} // Optional: changes the cursor to a pointer
        />
      </h3>
    </div>
  );
}

export default WebsiteName;
