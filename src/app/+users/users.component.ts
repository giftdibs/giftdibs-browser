import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  template: `
    <h1>Users</h1>
    <div class="media" *ngFor="let user of users">
      <div class="media-left">
        <a [routerLink]="[user.id]">
          <img class="media-object" src="">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">
          <a [routerLink]="[user.id]">
            {{user.firstName}} {{user.lastName}}
          </a>
        </h4>
      </div>
    </div>
  `,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [
    {
      id: 1,
      firstName: 'Steve',
      lastName: 'Brush'
    }
  ];
  constructor() { }
  ngOnInit() { }
}
