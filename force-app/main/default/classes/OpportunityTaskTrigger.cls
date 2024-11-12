public with sharing class OpportunityTaskTrigger {
    
    public Static void triggerMethod(List<opportunity> deletedOpp){

        set<Id> accIds = new set<Id>();
        Map<Id,Opportunity> oppMap = new Map<Id,Opportunity>();
        if(!deletedOpp.isEmpty()){
            for (Opportunity opp : deletedOpp )  {
                if(opp.AccountId != null){
                    accIds.add(opp.AccountId);
                    deletedOppMap.put(opp.Id,opp);
                }
            }
        }
        if(!accIds.isEmpty()){
            Map<Id,Opportunity> accountToOpenOppMap = new Map<Id,Opportunity>();
            List<Task> relatedTask = [SELECT ID,WhatId FROM Task WHERE  WhatId IN : deletedOppMap.keySet()];
            if(!relatedTask.isEmpty()){
                List<Opportunity> openOpp = [SELECT ID,AccountId FROM Opportunity WHERE AccountId IN:accIds 
                                            AND IsClosed =false AND ID NOT IN:deletedOppMap.keySet()];
                
                for(Opportunity relatedOpp : openOpp){
                    accountToOpenOppMap.put(relatedOpp.AccountId,opp);
                }

                List<Task> taskToUpdate = new List<Task>();
                List<Task> taskToDelete = new List<Task>();

                for(Task tsk : relatedTask){
                    Opportunity relatedDeletedOpp = deletedOppMap.get(tsk.WhatId);
                    if(relatedDeletedOpp != null && accountToOpenOppMap.containsKey(relatedDeletedOpp.AccountId)){
                        tsk.WhatId = accountToOpenOppMap.get(relatedDeletedOpp.AccountId).Id;
                        taskToUpdate.add(tsk);
                    }
                    else {
                        taskToDelete.add(tsk);
                    }
                }

                if(!taskToUpdate.isEmpty()){
                    update taskToUpdate;
                }

                if(!taskToDelete.isEmpty()){
                    delete taskToDelete;
                }
            }
        }
    }
}