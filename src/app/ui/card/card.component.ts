import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';

import {
  NavigationExtras
} from '@angular/router';

@Component({
  selector: 'gd-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input()
  public route: {
    commands: any[],
    extras?: NavigationExtras;
  };

  @Output()
  public actionClick = new EventEmitter<void>();

  public hasActionClick = false;

  public ngOnInit(): void {
    this.hasActionClick = (this.actionClick.observers.length > 0);
  }

  public onClick(): void {
    this.actionClick.emit();
  }
}
