import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ChecklistChoice, ModalInstance } from '@giftdibs/ux';

import { FriendshipService, FriendshipSummary } from '../friendship';
import { User } from '../user';

import { PrivacySelectorUsersContext } from './privacy-selector-users-context';

@Component({
  selector: 'gd-privacy-selector-users',
  templateUrl: './privacy-selector-users.component.html',
  styleUrls: ['./privacy-selector-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacySelectorUsersComponent implements OnInit {
  public choices: ChecklistChoice[];
  public isReady = false;
  public usersForm: UntypedFormGroup;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private context: PrivacySelectorUsersContext,
    private formBuilder: UntypedFormBuilder,
    private friendshipService: FriendshipService,
    private modal: ModalInstance<any>
  ) {}

  public ngOnInit(): void {
    this.createForm();
    this.usersForm.controls.friends.reset(this.context.selected);

    this.friendshipService
      .getAllByUserId(this.context.user.id)
      .subscribe((friendships: FriendshipSummary) => {
        const friends = friendships.followers.concat(friendships.following);

        const unique: User[] = [];
        friends.forEach((friend) => {
          const found = unique.find((u) => u.id === friend.id);
          if (!found) {
            unique.push(friend);
          }
        });

        this.choices = unique.map((friend) => {
          return {
            value: friend.id,
            label: `${friend.firstName} ${friend.lastName}`,
          };
        });

        this.isReady = true;
        this.changeDetector.markForCheck();
      });
  }

  public save(): void {
    const value = this.usersForm.controls.friends.value;
    this.modal.close('save', { value });
  }

  public onCancelClicked(): void {
    this.modal.close('cancel');
  }

  private createForm(): void {
    this.usersForm = this.formBuilder.group({
      friends: new UntypedFormControl(null, []),
    });
  }
}
