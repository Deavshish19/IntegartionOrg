import { LightningElement, api, wire } from 'lwc';
import getAttendees from '@salesforce/apex/eventMangementController.getAttendees';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import ATTENDEE_OBJECT from '@salesforce/schema/Attendee__c';
import RSVP_STATUS_FEILD from '@salesforce/schema/Attendee__c.RSVP_Status__c';

const columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Email', fieldName: 'Attendee_Email__c', editable: true },
    { 
        label: 'RSVP Status', 
        fieldName: 'RSVP_Status__c', 
        editable: true, 
        type: 'customPicklist',
        typeAttributes: {
            options: { fieldName: 'picklistOptions' }, // Ensure options match here
            value: { fieldName: 'RSVP_Status__c' },
            context: { fieldName: 'Id' }
        }
    },
    {
        label: 'VIP',
        type: 'boolean',
        fieldName: 'VIP_Attendee__c',
        editable: true
    }
];

export default class ModalForm extends LightningElement {
    @api isShowModal;
    @api eventId;
    @api editForm;
    @api viewForm;
    attendeeData = [];
    columns = columns;
    refreshData;
    StatusOptions = [];

    @wire(getObjectInfo, { objectApiName: ATTENDEE_OBJECT })
    getAttendeeInfo;

    @wire(getPicklistValues, { recordTypeId: '$getAttendeeInfo.data.defaultRecordTypeId', fieldApiName: RSVP_STATUS_FEILD })
    wireStatusOptions({ data, error }) {
        if (data) {
            this.StatusOptions = data.values.map(option => ({
                label: option.label,
                value: option.value
            }));
            console.log('Status Options: ', this.StatusOptions);
        } else if (error) {
            console.error('Error retrieving picklist values', error);
        }
    }

    @wire(getAttendees, { eventRecordId: '$eventId' })
    wiredAttendee(result) {
        this.refreshData = result;
        if (result.data) {
            this.attendeeData = result.data.map(currentRecord => {
                return {
                    ...currentRecord,
                    picklistOptions: this.StatusOptions // Ensure picklist options are assigned per row
                };
            });
            console.log('Mapped Attendee Data: ', this.attendeeData);
        } else if (result.error) {
            console.error('Error retrieving attendee records', result.error);
        }
    }

    hideModalBox() {
        const closeEvent = new CustomEvent('closemodal');
        this.dispatchEvent(closeEvent);
    }

    handleSuccess() {
        const successEvent = new CustomEvent('successevent');
        this.dispatchEvent(successEvent);
    }
}
