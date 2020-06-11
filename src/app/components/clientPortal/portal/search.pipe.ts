import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchPortal'
})
export class SearchPipePortal implements PipeTransform {

    transform(value: any, searchText?: any): any {
        if (!value) return [];
        if (!searchText) return value;
        searchText = searchText.toLowerCase();
        return value.filter(it => {
            return it.nombre.toLowerCase().includes(searchText);
        });
    }
}