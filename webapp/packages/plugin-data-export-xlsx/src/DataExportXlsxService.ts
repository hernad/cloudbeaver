/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { injectable } from '@cloudbeaver/core-di';
import { NotificationService } from '@cloudbeaver/core-events';
import type { DataTransferParameters } from '@cloudbeaver/core-sdk';

import { DataExportXlsxProcessService } from './DataExportXlsxProcessService.js';
import { ExportNotification } from './ExportNotification/ExportNotification.js';
import type { IExportContext } from './IExportContext.js';

@injectable()
export class DataExportXlsxService {
  constructor(private readonly notificationService: NotificationService, private readonly dataExportProcessService: DataExportXlsxProcessService) {}

  async cancel(exportId: string): Promise<void> {
    await this.dataExportProcessService.cancel(exportId);
  }

  async delete(exportId: string): Promise<void> {
    await this.dataExportProcessService.delete(exportId);
  }

  download(exportId: string): void {
    this.dataExportProcessService.download(exportId);
  }

  async exportData(context: IExportContext, parameters: DataTransferParameters): Promise<string> {
    const taskId = await this.dataExportProcessService.exportData(context, parameters);

    this.notificationService.customNotification(() => ExportNotification, { source: taskId });
    return taskId;
  }
}
