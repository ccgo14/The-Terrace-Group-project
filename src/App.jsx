import { useState } from "react";
import CreateAccount from "./components/CreateAccount";
import LogInPage from "./components/LoginPage";
import Home from "./components/Home";

export default function App() {
   const [activeUser, setActiveUser] = useState(null);
   const [isLogin, setIsLogin] = useState(false);

   const handleAccountCreated = (accountData) => {
      setActiveUser(accountData);
   };

    return(
        <div className="bg-[#1e140f] min-h-screen">
           {!activeUser ? (

              isLogin ? (
                 <LogInPage onNavigateToRegister={() => setIsLogin(false)} />
              ) : (
                 <CreateAccount
                    onAccountCreated={handleAccountCreated}

                 />
              )
           ) : (
              
              <Home userData={activeUser} />
           )}
        </div>
    )
}