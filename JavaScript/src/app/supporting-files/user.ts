import { Trip } from './trip';

/**
 * Class User is used to handle user accounts in application.
 */
export class User{
    name: string;
    email: string;
    private _password: string;
    logInPassword: string;
    repeatPassword: string; //only used when creating account
    trips: Trip []; //unused atm
    userKey: string;
    
    /**
     * function changePassword takes in new password and old password as parameters
     * and if the oldpassword matches loginpassword then new 
     * password is assigned as users password. Returns true if password changed.
     */
    changePassword(newPassword: string, oldPassword: string): boolean{
        if(oldPassword === this.logInPassword && newPassword.length >= 8){
            this._password = newPassword;  
            this.logInPassword = newPassword;
            this.repeatPassword = newPassword;
            return true;  
        } else {
            return false;
        }
    }
    

    /**
     * Function setPassword is to be used only when user account is created for
     * the first time as it assigns users protected password. This function should
     * be removed and setting password should be instead put in constructor of class.
     */
    setPassword(firstTimePassword: string){
        if(!this._password){
            this._password = firstTimePassword;
        } 
    }
    
    /**
     * Function addTrip can be used to add trip to users assigned trips. 
     * Unused at the moment.
     */
    addTrip(trip: Trip){
        this.trips.push(trip);
    }
    
    /**
     * Function validatePassword takes given password parameter and compares
     * it against users protected password. It returns true if passwords match.
     */
    validatePassword(passwordToCompare: string): boolean{
        if(passwordToCompare === this._password){
            return true;
        } else {
            return false;
        }
    }
    
   
    /**
     * Function isUserValid checks password integrity for user account. 
     */
    isUserValid():boolean{
        if(this._password === this.logInPassword){
            return true;
        } else {
            return false;
        }
    }
    
    
    
}