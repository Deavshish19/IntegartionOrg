import { LightningElement, wire } from 'lwc';
import getEventList from '@salesforce/apex/eventMangementController.getEventList';
import getEventListWithLastRecordId from '@salesforce/apex/eventMangementController.getEventListWithLastRecordId';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Event Name', fieldName: 'Name' },
    { label: 'Event Start Date', fieldName: 'Start_Date__c', type: 'date', typeAttributes: { year: 'numeric', month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' } },
    { label: 'Event End Date', fieldName: 'End_Date__c', type: 'date', typeAttributes: { year: 'numeric', month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' } },
    { label: 'Event Status', fieldName: 'Event_Status__c' },
    { label: 'Event Location', fieldName: 'Location__c' },
    { label: 'Total Attendees', fieldName: 'Total_Attendees__c' },
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class EventManagementDashboard extends LightningElement {
    eventData = [];
    eventColumns = columns;
    pageSize = 10;
    lastRecordId = '';
    recordsFetched = []; // Track the records fetched so far
    isLastPage = false; // Flag to check if we reached the last page
    isFirstPage = false;
    currentPageIndex = 0; // Track the current page index
    viewClick = false;
    showModal = false;
    selectedEventId;
    editForm = false;
    viewForm = false;
    refreshData;

    // Fetch the initial page of data
    @wire(getEventList, { pageSize: '$pageSize' })
    wiredEvent(result) {
        this.refreshData = result;
        if (result.data) {
            this.processEventData(result.data);
            this.isFirstPage = true;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    processEventData(data) {
        if (data.length > 0) {
            this.eventData = data;
            this.lastRecordId = data[data.length - 1].Id; // Update lastRecordId to the last record in the current page
            console.log('Inside processEventData', this.currentPageIndex, this.recordsFetched.length)
            // Only push new data if it's not a previously fetched page
            if (this.currentPageIndex === this.recordsFetched.length) {
                this.recordsFetched.push([...data]);
                console.log(' this.recordsFetched.length',  this.recordsFetched.length);
                 // Store records for future navigation
            }
            
            this.isLastPage = data.length < this.pageSize; // Check if this is the last page based on returned data size
            
            console.log('Last Record ID:', this.lastRecordId);
        } else {
            console.log('No more records');
            this.isLastPage = true; // Set flag if no more records are available
        }
    }

    handleNext() {
        // Check if we're on the last fetched page and more data exists
        
        if (!this.isLastPage && this.currentPageIndex === this.recordsFetched.length - 1) {
            // Fetch the next page using the current lastRecordId
            getEventListWithLastRecordId({ pageSize: this.pageSize, lastRecordId: this.lastRecordId })
                .then(data => {
                    if (data.length > 0) {
                        this.currentPageIndex++;
                        this.processEventData(data);
                        this.isFirstPage = false;
                        //this.currentPageIndex++; // Move forward in the page index
                    } else {
                        this.isLastPage = true; // If no data, mark it as last page
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else if (this.currentPageIndex < this.recordsFetched.length - 1) {
            // Use previously fetched data if it's available
            this.currentPageIndex++;
            this.eventData = [...this.recordsFetched[this.currentPageIndex]]; // Load next page from cache
            this.lastRecordId = this.eventData[this.eventData.length - 1].Id; // Update last record ID to current page
            this.isFirstPage = false;
            this.isLastPage = false; // Reset the last page flag
        }
    }

    handlePrevious() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--; // Move to the previous page
            this.eventData = [...this.recordsFetched[this.currentPageIndex]]; // Load previous page from cache
            this.lastRecordId = this.eventData[this.eventData.length - 1].Id; // Update last record ID to current page
            this.isLastPage = false; // Reset the last page flag
        } else {
            console.log('No more previous records');
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.selectedEventId = row.Id;
        switch (actionName) {
            case 'view':
                this.handleView(row);
                break;
            case 'edit':
                this.handleEdit(row);
                break;
            case 'delete':
                this.handleDelete(row);
                break;
            default:
        }
    }

    handleView(row) {
        // Implement view logic
        this.viewClick = true;
        this.showModal = true;
        this.editForm = false;
        this.viewForm = true;
        console.log('View row:', row ,this.selectedEventId );
    }

    handleEdit(row) {
        // Implement edit logic
        this.viewClick = true;
        this.showModal = true;
        this.editForm = true;
        this.viewForm = false;
        console.log('Edit row:', row);
    }

    handleDelete(row) {
        // Implement delete logic
        console.log('Delete row:', row);
        deleteRecord(this.selectedEventId)
        .then(() => {
            refreshApex(this.refreshData);
            console.log('Record Deleted Successfully',this.selectedEventId);
            this.showToastNotification('Success','Record Deleted Successfully','success')
            
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleCloseModal() {
        this.showModal = false; // Close the modal
    }

    handleSuccess(event){
        console.log('Success:',event);
        refreshApex(this.refreshData);
        this.showToastNotification('Success','Record Edited Successfully','success')
    }

    handleError(event){
        console.log('Error:',event);
    }

    showToastNotification(toastTitle, toastMessage, toastVariant) {
        const evt = new ShowToastEvent({
          title: toastTitle,
          message: toastMessage,
          variant: toastVariant,
        });
        this.dispatchEvent(evt);
      }
}


