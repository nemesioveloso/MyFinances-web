import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem('authToken'));

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            {isAuthenticated && (
                <Button fullWidth variant="contained" color="primary" onClick={handleLogout}>
                    Sair
                </Button>
            )}
        </>
    );
};