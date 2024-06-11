/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import type { PluginManifest } from '@cloudbeaver/core-di';

export const dataExportXlsxManifest: PluginManifest = {
  info: {
    name: 'Data Export Xlsx Plugin',
  },

  providers: [
    () => import('./Bootstrap').then(m => m.Bootstrap),
    () => import('./DataExportXlsxMenuService').then(m => m.DataExportXlsxMenuService),
    () => import('./DataExportXlsxSettingsService').then(m => m.DataExportXlsxSettingsService),
    () => import('./DataExportXlsxService').then(m => m.DataExportXlsxService),
    () => import('./DataExportXlsxProcessService').then(m => m.DataExportXlsxProcessService),
    () => import('./DataTransferProcessorsResource').then(m => m.DataTransferProcessorsResource),
    () => import('./LocaleService').then(m => m.LocaleService),
    () => import('./Dialog/DefaultExportOutputSettingsResource').then(m => m.DefaultExportOutputSettingsResource),
  ],
};
