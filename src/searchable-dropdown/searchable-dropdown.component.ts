/*
 * This file is part of ng2-json-editor.
 * Copyright (C) 2016 CERN.
 *
 * ng2-json-editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * ng2-json-editor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ng2-json-editor; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'searchable-dropdown',
  styleUrls: [
    './searchable-dropdown.component.scss'
  ],
  templateUrl: './searchable-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchableDropdownComponent {

  @Input() items: Array<string>;
  @Input() shortcutMap: Object;
  @Input() value: string;
  @Input() tabindex: string;
  expression: string = '';
  status: { isOpen: boolean } = { isOpen: false };

  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  onExpressionChange(expression: string) {
    this.expression = expression;
  }

  onItemClick(item: string) {
    this.value = item;
    this.expression = '';
    this.onSelect.emit(item);
  }

  onKeypress(key: string) {
    if (key === 'Enter') {
      this.status.isOpen = false;
      if (this.shortcutMap && this.shortcutMap[this.expression]) {
        this.onItemClick(this.shortcutMap[this.expression]);
      }
      this.expression = '';
    }
  }

}
