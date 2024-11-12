import { api, LightningElement, wire } from 'lwc';
import getPlanDetails from '@salesforce/apex/ottControllerClass.getPlanDetails';

const columns = [
    {
        label: 'Name',
        fieldName: 'Name'
    },
    {
        label: 'Monthly',
        fieldName: 'Monthly_Amount__c'
    },
    {
        label: 'Quarterly',
        fieldName: 'Quarterly__c'
    },
    {
        label: 'Half Yearly',
        fieldName: 'Half_Yearly_Amount__c'
    },
    {
        label: 'Yearly',
        fieldName: 'Yearly_Amount__c'
    },
    
]

export default class Ott_PlanDetails extends LightningElement {

    planDetails = [];
    columns = columns;
    displaySelectPlan= false;
    displayPlanDetails = true;
    @api customerId;

    @wire (getPlanDetails)
    wiredPlanData({ error, data }) {
            if (data) {
                this.planDetails = data;
                console.log('planDetails: '+JSON.stringify(this.planDetails));
                
            }
            else if(error){
                console.log('error: '+JSON.stringify(error));
            }
    }
    
    handleBack(){
        const evt = new CustomEvent('planback');
        this.dispatchEvent(evt);
    }    

    handleSelectPlan(){
        this.displayPlanDetails = false;
        this.displaySelectPlan = true;
    }

    handleBackToPlanDetails(){
        this.displayPlanDetails = true;
        this.displaySelectPlan = false;
    }
}
