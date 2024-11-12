import { LightningElement } from 'lwc';
import ottImage from '@salesforce/resourceUrl/ottImage';
import salesforceImage from '@salesforce/resourceUrl/LoginLogo';
import getCustomerDetails from '@salesforce/apex/ottControllerClass.getCustomerDetails';

export default class Ott_loginPage extends LightningElement {

    ottLogo;
    loginLogo;
    displayMainPage = true;
    //displayCreateAccount = false;
    errorMessage;
    customerDetails;
    displayLoginContent = true;
    cardTitle = 'Login Page';
    displayCreateAccountPage  =false;
    displayPlanDetailPage = false;
    customerId;

    connectedCallback() {
        this.ottLogo = ottImage;
        this.loginLogo = salesforceImage;
    }

    handlePhoneChange(event) {
        this.phoneNumber = event.target.value;
        this.errorMessage = ''; // Reset the error message when the input changes
    }

    async handleLogin() {
        this.errorMessage = '';
        if (!this.phoneNumber) {
            this.errorMessage = 'Phone number is required.';
            return;
        }
        else {
            try {
                const Customer = await getCustomerDetails({ phone: this.phoneNumber });
                console.log('Customer :', JSON.stringify(Customer[0]));
                this.customerDetails = Customer[0];
                if (!Customer[0] || Customer[0] == undefined) {
                    this.errorMessage = 'No Customer found with this phone number.';
                } else {
                    this.errorMessage = '';
                    console.log('Customer found:', JSON.stringify(this.customerDetails));
                    this.customerId = this.customerDetails.Id;
                    this.displayLoginContent = false;
                    this.cardTitle = 'Customer Information';
                    console.log('customer Id:', this.customerId);
                }
            }
            catch (error) {
                this.errorMessage = 'An error occurred while logging in. Please try again.';
                console.error('Error during login:', error);
            }
        }
    }

    handleCreate() {
        this.displayMainPage = false;
        this.displayCreateAccountPage = true;
        //this.displayCreateAccount = true;
    }

    handleCancel() {
        this.displayMainPage = true;
        this.displayCreateAccountPage =false;
    }

    handleCreation() {
        this.displayMainPage = true;
    }

    handleBack(event) {
        this.displayLoginContent = true;
        this.displayMainPage = true;
        this.cardTitle = 'Login Page';
    }

    handlePlanDetails(event){
        this.displayMainPage = false;
        this.displayPlanDetailPage = true;
    }

    handlePlanBack(event){
        this.displayPlanDetailPage = false;
        this.displayMainPage = true;
        this.displayLoginContent = true;
    }
}