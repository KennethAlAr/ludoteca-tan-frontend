import { NativeDateAdapter } from '@angular/material/core';

export class SpanishDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return [
      String(date.getDate()).padStart(2, '0'),
      String(date.getMonth() + 1).padStart(2, '0'),
      date.getFullYear()
    ].join('/');
  }
}