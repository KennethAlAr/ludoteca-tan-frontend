import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Author } from './model/Author';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { AUTHOR_DATA } from './model/mock-authors';

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    constructor() {}

    getAuthors(pageable: Pageable): Observable<PaginatedData<Author>> {
        return of(AUTHOR_DATA);
    }

    saveAuthor(author: Author): Observable<void> {
        return of(null);
    }

    deleteAuthor(idAuthor: number): Observable<void> {
        return of(null);
    }
}
