import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SessionService } from '@giftdibs/session';
import { AlertService } from '@giftdibs/ux';

import { finalize } from 'rxjs/operators';

import { Friendship } from './friendship';
import { FriendshipService } from './friendship.service';

@Component({
  selector: 'gd-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowButtonComponent implements OnInit {
  @Input()
  public friendId: string;

  public isLoading = true;
  public isSessionUser = false;
  public isFollowing = false;

  private friendshipId: string;

  constructor(
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private friendshipService: FriendshipService,
    private sessionService: SessionService
  ) {}

  public ngOnInit(): void {
    const sessionUserId = this.sessionService.user.id;
    const ownerId = this.friendId;

    this.isSessionUser = this.sessionService.isSessionUser(ownerId);

    if (!this.isSessionUser) {
      this.friendshipService
        .getFollowingByUserId(sessionUserId)
        .subscribe((friendships: any) => {
          const found = friendships.find((friendship: Friendship) => {
            return friendship.friendId === ownerId;
          });

          if (found) {
            this.isFollowing = true;
            this.friendshipId = found.id;
          }

          this.isLoading = false;
          this.changeDetector.markForCheck();
        });
    }
  }

  public createFriendship(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();

    this.friendshipService
      .create(this.friendId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe(
        (result: any) => {
          this.isFollowing = true;
          this.friendshipId = result.data.friendshipId;
        },
        (err: any) => {
          this.alertService.error(err.error.message);
        }
      );
  }

  public removeFriendship(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();

    this.friendshipService
      .remove(this.friendshipId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe(
        () => {
          this.isFollowing = false;
        },
        (err: any) => {
          this.alertService.error(err.error.message);
        }
      );
  }
}
