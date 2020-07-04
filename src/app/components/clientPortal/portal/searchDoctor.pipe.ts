import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchDoctorPortal'
})
export class SearchPipeDoctorPortal implements PipeTransform {

    transform(value: any, searchText?: any): any {
        if (!value) return [];
        if (!searchText) return value;
        searchText = searchText.toLowerCase();        
        return value.filter(it => {
            return it.idDoctorNavigation.nombres.toLowerCase().includes(searchText) ||
            it.idDoctorNavigation.apellidos.toLowerCase().includes(searchText);
        });
    }
}