/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { Bootstrap as B, injectable } from '@cloudbeaver/core-di';

import { DataExportXlsxMenuService } from './DataExportXlsxMenuService.js';

@injectable()
export class Bootstrap extends B {
  constructor(private readonly dataExportXlsxMenuService: DataExportXlsxMenuService) {
    super();
  }

  override register(): void {
    this.dataExportXlsxMenuService.register();
  }

}
