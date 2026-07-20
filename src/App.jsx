import { useState } from "react";
import CreateAccount from "./components/CreateAccount";
import UserProfile from "./components/UserProfile";
import LogInPage from "./components/LoginPage";

export default function App (){
   const [activeUser, setActiveUser] = useState(null);

   const handleAccountCreated = (accountData) => {
      setActiveUser(accountData);
   };

    return(
        <div className="bg-[#1e140f] min-h-screen">
             {!activeUser ? (
            <CreateAccount onAccountCreated={handleAccountCreated} />
            ) : (
            /*  Once created, swap to the profile page and pass the data down */
            <UserProfile userData={activeUser} />
            )}http://localhost:5173/

            <LogInPage />
         </div>
     )
}


           