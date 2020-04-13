import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchDoctor'
})
export class SearchPipeDoctor implements PipeTransform {

    transform(value: any, searchText?: any): any {
        if (!value) return [];
        if (!searchText) return value;
        searchText = searchText.toLowerCase();
        return value.filter(it => {
            return it.docs.nombres.toLowerCase().includes(searchText) ||
            it.docs.apellidos.toLowerCase().includes(searchText) ||
            it.titulos.includes(searchText) || 
            it.especialidades.includes(searchText);
        });
    }
}