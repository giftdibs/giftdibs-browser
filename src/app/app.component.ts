import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalClosedEventArgs, ModalService } from '@giftdibs/ux';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  GiftDetailComponent,
  GiftDetailContext,
} from 'src/app/shared/modules/gift-detail';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        if (params.giftId) {
          this.openGiftDetailModal(params.giftId);
        }
      });
  }

  private openGiftDetailModal(giftId: string): void {
    const modal = this.modalService.open(GiftDetailComponent, {
      clickOverlayToClose: true,
      providers: [
        {
          provide: GiftDetailContext,
          useValue: {
            giftId,
          },
        },
      ],
    });

    const currentRoute = this.router.url.split('?')[0].split('/');

    modal.closed.subscribe((args: ModalClosedEventArgs) => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          giftId: null,
        },
        queryParamsHandling: 'merge',
      };

      if (args.reason === 'cancel') {
        this.router.navigate([], navigationExtras);
        return;
      }

      // If we're on the home page, just do a full page reload.
      if (currentRoute.join('/') === '/') {
        window.location.href = window.location.href.split('?')[0];
        return;
      }

      // Trigger a route reload.
      // See: https://stackoverflow.com/a/53003923/6178885
      this.router
        .navigateByUrl('/', {
          skipLocationChange: true,
        })
        .then(() => this.router.navigate(currentRoute, navigationExtras));
    });
  }
}
