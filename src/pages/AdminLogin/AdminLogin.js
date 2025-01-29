import "./AdminLogin.css"; 
import Button from "../../components/Button/Button.js";

function AdminLogin(){
    return(
        
        <div className="admin-login">
            <h1 className="admin-login__title">Admin Login</h1>
            <form className="form" action="post">
                <label for="admin-login__username-input" class="admin-login__username-label" placeholder="Enter Your Username" >Username</label>
                <input type="text" id= "admin-login__username-input" class="admin-login__username-input" required/>
                <label for="admin-login__password-input" class="admin-login__username-label margin--top" placeholder="Enter Your Password">Password</label>
                <input type="password" id= "admin-login__password-input" class="admin-login__password-input margin--bottom" required/>
                {/* <btn class="form__btn">Login</btn> */}
                <Button buttonType="card" buttonSize="small" buttonText="Login" buttonWidth="form" className="student--btn login--btn" buttonNavigateTo="/admin" type="submit"/>
            </form>
            
        </div>
    );
}
export default AdminLogin;