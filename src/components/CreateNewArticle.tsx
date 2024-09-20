import { Button } from "@mui/material";

import { useNavigate } from 'react-router-dom';





  // https://api.realworld.io/api/articles
const CreateNewArticle = () => {
    const navigate = useNavigate();

    const AddNewArticle = () => {
        navigate('/AddNewArticle');
    }

   return(  
    <div
       style={{
           marginTop: 12,
           paddingRight: 9,
       }}
    >
        <Button
            onClick={ AddNewArticle }
            variant="text"
            color= "secondary"

        >
          New Article
        </Button>                         
    </div>
   )
}

export default CreateNewArticle;                       