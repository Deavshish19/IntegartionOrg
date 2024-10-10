import { LightningElement } from 'lwc';

export default class GatMembersPage extends LightningElement {
    totalMembers = 5;
    totalArea = 7.25;

    members = [
        { id: 1, name: 'Padmaja P Kawade', phone: '9657829822', role: 'Admin', acre: '1.50' },
        { id: 2, name: 'राजेश चंदू काले', phone: '7588846544', role: 'Member', acre: '1.50' },
        { id: 3, name: 'त्यांना आण्णा गाववाले', phone: '9321656565', role: 'Admin', acre: '1.00' },
        { id: 4, name: 'Gramhal dummy 1', phone: '8888888821', role: 'Admin', acre: '1.00' },
        { id: 5, name: 'M P Patil', phone: '9321656565', role: 'Member', acre: '2.25' }
    ];
}