import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';
import { Subscription } from 'rxjs/Subscription';

import { User, WishList, Friendship } from '../_models';
import {
  AlertService,
  FriendshipService,
  SessionService,
  UserService,
  WishListService
} from '../_services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, OnDestroy {
  public isLoading = false;

  public user: User;
  public isCurrentUser = false;

  public wishLists: WishList[];
  public activeWishList: WishList;

  public friendships: Friendship[];
  public isFollowing = false;

  private routeParamSubscription: Subscription;

  constructor(
    private alertService: AlertService,
    private friendshipService: FriendshipService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private wishListService: WishListService
  ) { }

  public ngOnInit(): void {
    this.routeParamSubscription = this.route.params
      .subscribe((params: any) => {
        this.userService
          .getById(params.id)
          .first()
          .subscribe(
            (user: User) => {
              this.user = user;
              this.isCurrentUser = this.sessionService.isCurrentUser(this.user._id);
              this.getWishLists();
              this.getFriendships();
            },
            (error: any) => {
              if (error.status === 400) {
                this.alertService.error('User not found.', true);
                this.router.navigate(['/']);
              }
            });
      });
  }

  public ngOnDestroy(): void {
    this.routeParamSubscription.unsubscribe();
  }

  public onCreateSuccess(): void {
    this.getWishLists();
  }

  public onEditSuccess(): void {
    this.activeWishList = undefined;
    this.getWishLists();
  }

  public deleteWishList(wishListId: string): void {
    this.isLoading = true;
    this.wishListService
      .remove(wishListId)
      .first()
      .finally(() => this.isLoading = false)
      .subscribe(
        (data: any) => {
          this.alertService.success(data.message);
          this.getWishLists();
        },
        (err: any) => {
          this.alertService.error(err.message);
        }
      );
  }

  public createFriendship(): void {
    this.isLoading = true;
    const friendship: Friendship = {
      _friend: this.user._id
    };
    console.log('providing:', friendship);
    this.friendshipService
      .create(friendship)
      .first()
      .finally(() => this.isLoading = false)
      .subscribe(
        (data: any) => this.getFriendships(),
        (err: any) => this.alertService.error(err.message)
      );
  }

  public removeFriendship(): void {
    this.isLoading = true;

    const currentUserId = this.sessionService.user._id;
    let friendshipId: string;

    this.friendships.forEach((friendship: Friendship) => {
      if (friendship._user._id === currentUserId) {
        friendshipId = friendship._id;
      }
    });

    this.friendshipService
      .remove(friendshipId)
      .first()
      .finally(() => this.isLoading = false)
      .subscribe(
        (data: any) => this.getFriendships(),
        (err: any) => this.alertService.error(err.message)
      );
  }

  private getWishLists(): void {
    this.wishListService
      .getAllByUserId(this.user._id)
      .first()
      .subscribe((data: any) => {
        this.wishLists = data.wishLists;
      });
  }

  private getFriendships(): void {
    this.friendshipService
      .getAllByUserId(this.user._id)
      .first()
      .subscribe((data: any) => {
        const currentUserId = this.sessionService.user._id;
        this.friendships = data.friendships;
        this.isFollowing = false;
        data.friendships.forEach((friendship: Friendship) => {
          if (
            friendship._user._id === currentUserId &&
            friendship._friend._id === this.user._id
          ) {
            this.isFollowing = true;
          }
        });
      });
  }
}
