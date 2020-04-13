import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchClinica'
})
export class SearchPipe implements PipeTransform {

    transform(value: any, searchText?: any): any {
        if (!value) return [];
        if (!searchText) return value;
        searchText = searchText.toLowerCase();
        return value.filter(it => {
            return it.nombre.toLowerCase().includes(searchText) ||
            it.direccion.toLowerCase().includes(searchText) ||
            it.infoGeneral.toLowerCase().includes(searchText) ||
            it.idProvinciaNavigation.nombre.toLowerCase().includes(searchText) || 
            it.idCiudadNavigation.nombre.toLowerCase().includes(searchText);
        });
    }
}