import { api, LightningElement } from 'lwc';

import SUBSCRIPTION_OBJECT from '@salesforce/schema/Ott_Subscription_Details__c';
import CUSTOMERDETAILS_FIELD from '@salesforce/schema/Ott_Subscription_Details__c.Ott_Customer_Details__c';
import PLANNAME_FIELD from '@salesforce/schema/Ott_Subscription_Details__c.Plan_Name__c';
import PLANTYPE_FIELD from '@salesforce/schema/Ott_Subscription_Details__c.Plan_Type__c';
import STARTDATE_FIELD from '@salesforce/schema/Ott_Subscription_Details__c.Start_Date_Time__c';
//import ENDDATE_FIELD from '@salesforce/schema/Ott_Subscription_Details__c.End_Date_Time__c';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";


export default class Ott_PaymentPage extends LightningElement {
    value = '';
    cardNumber;
    mm;
    yy;
    name;
    cardType = '';
    @api planDetails;
    @api customerId;
    startDate;
   /*  endDate; */

    get options() {
        return [
            { label: 'Debit Card', value: 'Debit Card' },
            { label: 'Credit Card', value: 'Credit Card' },
        ];
    }

    handleChange(event) {
        /* console.log('plandetails>> ', JSON.stringify(this.planDetails)) */
        let { name, value } = event.target;

        if (name === 'cardNumber') {
            this.cardNumber = value;
            /*  console.log('cardNumber:', this.cardNumber) */
        }
        else if (name === 'mm') {
            this.mm = value;
        }
        else if (name === 'yy') {
            this.yy = value;
        }
        else if (name === 'name') {
            this.name = value;
        }
        else if(name ==='cardType'){
            this.cardType = value;
            console.log(this.cardType)
        }
    }

    backButton(event) {
        const evt = new CustomEvent('backtoselectplan');
        this.dispatchEvent(evt);
    }

    handleSubmit() {
        this.handleSubscriptionCreation();
    }

    handleSubscriptionCreation() {
        this.startDate = new Date();

        const inputFields = {};
        inputFields[CUSTOMERDETAILS_FIELD.fieldApiName] = this.customerId;
        inputFields[PLANNAME_FIELD.fieldApiName] = this.planDetails.planName;
        inputFields[PLANTYPE_FIELD.fieldApiName] = this.planDetails.planType;
        inputFields[STARTDATE_FIELD.fieldApiName] = this.startDate;
        /* inputFields[ENDDATE_FIELD.fieldApiName] = this.endDate; */
        console.log('fields: ', JSON.stringify(inputFields));

        const recordInput = {
            apiName : SUBSCRIPTION_OBJECT.objectApiName,
            fields : inputFields
        }

        createRecord(recordInput)
        .then((result)=>{
            this.handleInvoiceCreation(result.id);
            this.showNotification('Success', 'Records Created Successfully', 'success');
        })
        .catch(error => {
            console.log('error in subscription',error.body.message);
            this.showNotification('Error', 'Error While Creating Subscription Record', 'error');
        });
    }

    handleInvoiceCreation(subscriptionId){
        console.log('cardType:',this.cardType)
        const invoiceFields = {
            'Amount__c': this.planDetails.planAmount,
            'Customer_Name__c': this.customerId,
            'Payment_Status__c': 'Completed',
            'Subscription_Number__c': subscriptionId,
            'Payment_Date_Time__c' : new Date(),
            'Card_Holder_Name__c': this.name,
            'Card_Number__c': this.cardNumber,
            'Card_Type__c':this.cardType,
        }
        console.log('invoicefields:',  JSON.stringify(invoiceFields));
        
        const recordDetails = {
            apiName : 'Ott_Invoice_Details__c',
            fields : invoiceFields
        }

        createRecord(recordDetails)
        .then((result)=>{
            //this.showNotification('Success', 'Records Created Successfully', 'success');
            console.log(result);
            
        })
        .catch(error => {
            /* this.errorMessage = error.body.message; */
            console.log('error in invoice', error.body.message);
            
            this.showNotification('Error', 'Error While Creating Invoice Records', 'error');
        });
    }

    showNotification(toastTitle, toastMessage, toastVariant) {
        const evt = new ShowToastEvent({
          title: toastTitle,
          message: toastMessage,
          variant: toastVariant,
        });
        this.dispatchEvent(evt);
    }
}