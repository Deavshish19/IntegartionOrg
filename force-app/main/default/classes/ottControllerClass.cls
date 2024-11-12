public with sharing class ottControllerClass {
    @AuraEnabled(cacheable=true)
    public static List<Ott_Customer__c> getCustomerDetails(String phone){
       
        return [SELECT Id, First_Name__c,Last_Name__c, Phone__c, Email__c FROM Ott_Customer__c
                WHERE Phone__c = : phone 
                WITH USER_MODE 
                LIMIT 1
                ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Ott_Plan_Details__c> getPlanDetails(){
        
        return [SELECT Id, Name, End_Date__c,Half_Yearly_Amount__c,Monthly_Amount__c,Quarterly__c,Start_Date__c,Status__c,Yearly_Amount__c
                FROM Ott_Plan_Details__c
                ORDER BY Name];
    }
}