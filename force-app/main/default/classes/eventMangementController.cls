public with sharing class eventMangementController {
    @AuraEnabled (cacheable=true)
    public static List<Event__c> getEventList(Integer pageSize){
       
       return [SELECT Id, Name, Start_Date__c, End_Date__c, Event_Status__c, Location__c, Total_Attendees__c 
               FROM Event__c 
               WITH USER_MODE 
               ORDER BY Id ASC 
               LIMIT :pageSize];
    }
    
    @AuraEnabled (cacheable=true)
    public static List<Event__c> getEventListWithLastRecordId(Integer pageSize, String lastRecordId){
        return [SELECT Id, Name, Start_Date__c, End_Date__c, Event_Status__c, Location__c, Total_Attendees__c 
               FROM Event__c 
               WHERE Id > : lastRecordId
               WITH USER_MODE 
               ORDER BY Id ASC 
               LIMIT :pageSize];
    }


    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> getAttendees(Id  eventRecordId){
        return [SELECT Id, Name, Attendee_Email__c, Attendee_Phone__c, RSVP_Status__c, VIP_Attendee__c, Event__c  
                FROM Attendee__c Where Event__c =: eventRecordId
                WITH USER_MODE];
    }            
}