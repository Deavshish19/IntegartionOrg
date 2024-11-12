import { LightningElement } from 'lwc';
import OTT_CUSTOMER_OBJECT from '@salesforce/schema/Ott_Customer__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ott_CreateAccountPage extends LightningElement {
    objectApiName = OTT_CUSTOMER_OBJECT;

    handleSuccess(event) {
        this.showToastNotification('Success', 'New Customer Created Successfully, Please Relogin', 'success');
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
        console.log('after reset');
        
        const successEvent = new CustomEvent('creation');
        this.dispatchEvent(successEvent); 
    }

    handleError(event) {
        this.showToastNotification('Error', 'Error Occurred', 'error');
    }

    showToastNotification(toastTitle, toastMessage, toastVariant) {
        const evt = new ShowToastEvent({
            title: toastTitle,
            message: toastMessage,
            variant: toastVariant,
        });
        this.dispatchEvent(evt);
    }

    handleCancel(event) {
        const cancelEvent = new CustomEvent('cancel');
        this.dispatchEvent(cancelEvent);
    }
}
