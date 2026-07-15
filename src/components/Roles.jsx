

export default function Roles (){
    return(
               <div className="flex flex-col space-y-2">
               <label htmlFor="origin" className="text-amber-400 font-medium text-sm tracking-wide">Role:
               </label>
               <select name="Admin" id="admin"></select>
               <select name="Article Author" id="Author"></select>
               <select name="User" id="User"></select>
               </div>
              
              )
            }