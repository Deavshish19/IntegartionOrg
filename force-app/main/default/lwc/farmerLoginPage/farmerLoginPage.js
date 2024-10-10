import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class FarmerLoginPage extends NavigationMixin(LightningElement) {
    mobileNumber = '';
    showModal = false; 
    selectedUser = ''; 
    userOptions = [
        { label: 'Padmaja Paani Kawade', value: 'user1'  },
        { label: 'त्यादा आपण गाववाले', value: 'user2' },
        { label: 'Rekha Dummy K', value: 'user3' },
        { label: 'M P Patil', value: 'user4' }
    ];

    handleMobileChange(event) {
        this.mobileNumber = event.target.value;
    }

    handleNext() {
        if (this.mobileNumber) {
            // Display the modal with the list of users
            this.showModal = true;
        } else {
            console.log('Please enter a mobile number');
        }
    }

    handleUserSelection(event) {
        this.selectedUser = event.target.value;
    }

    handleCancel() {
        this.showModal = false; // Close the modal without doing anything
    }

    handleContinue() {
        if (this.selectedUser) {
            console.log('Logging in as:', this.selectedUser);
            this.showModal = false; 
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name : 'Home'  
                }
            });
        } else {
            console.log('Please select a user');
        }
    }

    handleLanguageChange(event) {
        // Logic to handle language switch (English/Marathi)
    }
}
