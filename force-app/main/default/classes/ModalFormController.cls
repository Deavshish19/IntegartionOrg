public with sharing class ModalFormController {
    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> getAttendees(Id  eventId){
        return [SELECT Id, Name, Attendee_Email__c, Attendee_Phone__c, RSVP_Status__c, VIP_Attendee__c, Event__c  
                FROM Attendee__c Where Event__c =: eventId
                WITH USER_MODE];
    }            
}