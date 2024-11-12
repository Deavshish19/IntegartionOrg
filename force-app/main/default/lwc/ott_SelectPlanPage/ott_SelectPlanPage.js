import { api, LightningElement } from 'lwc';
const planMap = new Map([
    ['Monthly', 'Monthly_Amount__c'],
    ['Quarterly', 'Quarterly__c'],
    ['Half-yearly', 'Half_Yearly_Amount__c'],
    ['Yearly', 'Yearly_Amount__c']
])

export default class Ott_SelectPlanPage extends LightningElement {
    @api planData = [];
    selectedPlan;
    planColumns;
    planInfo={};
    displayPaymentPage = false;
    displaySelectPlanPage = true;
    @api customerId;

    handleSelectChange(event){
        this.selectedPlan = event.target.value;
        console.log('plandata: '+JSON.stringify(this.planData));
        this.planColumns = [
            {label:'Name',fieldName:'Name'},
            {label:this.selectedPlan,fieldName:planMap.get(this.selectedPlan)}
        ]
    }

    handleRowSelection(event){
        const selectedRow = event.detail.selectedRows;
        /* console.log('selectedRow>> ',JSON.stringify(selectedRow)); */

        this.planInfo = {
            planName : selectedRow[0].Name,
            planAmount : selectedRow[0][planMap.get(this.selectedPlan)],
            planType : this.selectedPlan
        };

        /* console.log('planInfo>> ',JSON.stringify(this.planInfo)); */
    }

    handlePayment(event){
        this.displayPaymentPage = true;
        this.displaySelectPlanPage = false;
    }

    handleBackToPlanDetails(event){
        const evt = new CustomEvent('backtoplandetails')
        this.dispatchEvent(evt);
    }

    handleBackToSelectPlan(event){
        this.displaySelectPlanPage = true;
        this.displayPaymentPage = false;
    }
}