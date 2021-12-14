/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled, { css, use } from 'reshadow';

import { ADMINISTRATION_TOOLS_PANEL_STYLES } from '@cloudbeaver/core-administration';
import { Table, TableHeader, TableColumnHeader, TableBody, ToolsAction, ToolsPanel, Loader, useTable, useMapResource } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { NotificationService } from '@cloudbeaver/core-events';
import { useTranslate } from '@cloudbeaver/core-localization';
import { CachedMapAllKey } from '@cloudbeaver/core-sdk';
import { composes, useStyles } from '@cloudbeaver/core-theming';
import { VersionResource } from '@cloudbeaver/core-version';

import { Version } from './Version';

const layoutStyles = composes(
  css`
    layout-grid-cell {
      composes: theme-background-surface theme-text-on-surface from global;
    }

    layout-grid-cell {
      composes: theme-border-color-background from global;
    }
  `,
  css`
    layout-grid {
      width: 100%;
      overflow: auto;
    }

    layout-grid-inner {
      min-height: 100%;
    }

    layout-grid-cell {
      position: relative;
      border: solid 1px;
    }
  `
);

const loaderStyle = css`
  ExceptionMessage {
    padding: 24px;
  }
`;

const styles = css`
  Table {
    width: 100%;
  }

  ToolsPanel {
    border-bottom: none;
  }
`;

export const VersionsTable = observer(function VersionsTable() {
  const translate = useTranslate();
  const style = useStyles(styles, ADMINISTRATION_TOOLS_PANEL_STYLES, layoutStyles);
  const notificationService = useService(NotificationService);
  const versionResource = useMapResource(VersionsTable, VersionResource, CachedMapAllKey);
  const table = useTable();

  const refresh = useCallback(async () => {
    try {
      versionResource.resource.markOutdated();
      await versionResource.resource.load(CachedMapAllKey);
      notificationService.logSuccess({ title: 'version_update_versions_refresh_successful' });
    } catch (exception) {
      notificationService.logException(exception, 'version_update_versions_refresh_fail');
    }
  }, [versionResource, notificationService]);

  return styled(style)(
    <layout-grid>
      <layout-grid-inner>
        <layout-grid-cell {...use({ span: 12 })}>
          <ToolsPanel>
            <ToolsAction
              title={translate('authentication_administration_tools_refresh_tooltip')}
              icon="refresh"
              viewBox="0 0 24 24"
              onClick={refresh}
            >
              {translate('ui_refresh')}
            </ToolsAction>
          </ToolsPanel>
        </layout-grid-cell>
        <layout-grid-cell {...use({ span: 12, table: true })}>
          <Loader style={loaderStyle} state={[versionResource]} overlay>
            <Table
              selectedItems={table.selected}
              expandedItems={table.expanded}
              {...use({ size: 'big' })}
            >
              <TableHeader>
                <TableColumnHeader min />
                <TableColumnHeader>{translate('version')}</TableColumnHeader>
                <TableColumnHeader>{translate('version_date')}</TableColumnHeader>
              </TableHeader>
              <TableBody>
                {versionResource.resource.values.map(version => (
                  <Version key={version.number} version={version} />
                ))}
              </TableBody>
            </Table>
          </Loader>
        </layout-grid-cell>
      </layout-grid-inner>
    </layout-grid>
  );
});
