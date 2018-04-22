import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { User } from '../../features/users/user';

import { TypeaheadSearchFunction } from '../typeahead/typeahead-search-function';

import { SearchService } from './search.service';
import { TypeaheadSearchResultAction } from '../typeahead/typeahead-search-result-action';
import { Router } from '@angular/router';

let autoIncrementedId = 0;

@Component({
  selector: 'gd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  public elementId: number;

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {
    autoIncrementedId++;
    this.elementId = autoIncrementedId;
  }

  public searchFunction: TypeaheadSearchFunction<User> = (searchText: string) => {
    return this.searchService.searchUsers(searchText);
  }

  public searchResultAction: TypeaheadSearchResultAction<User> = (searchResult: User) => {
    this.router.navigate(['/users', searchResult._id]);
    return searchResult.firstName + ' ' + searchResult.lastName;
  }
}
