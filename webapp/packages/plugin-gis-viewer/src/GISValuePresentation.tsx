/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./terraformer-wkt.d.ts" />

import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';

import { TextPlaceholder } from '@cloudbeaver/core-blocks';
import { useTranslate } from '@cloudbeaver/core-localization';
import { IDatabaseResultSet, ResultSetSelectAction, IResultSetElementKey, IDatabaseDataModel } from '@cloudbeaver/plugin-data-viewer';
import { wktToGeoJSON } from '@terraformer/wkt';

import { IGeoJSONFeature, IAssociatedValue, LeafletMap } from './LeafletMap';
import { ResultSetGISAction } from './ResultSetGISAction';

interface Props {
  model: IDatabaseDataModel<any, IDatabaseResultSet>;
  resultIndex: number;
}

export const GISValuePresentation: React.FC<Props> = observer(function GISValuePresentation({
  model,
  resultIndex,
}) {
  const translate = useTranslate();

  const modelResultData = model.getResult(resultIndex);
  const selection = model.source.getAction(resultIndex, ResultSetSelectAction);
  const gis = model.source.getAction(resultIndex, ResultSetGISAction);

  const focusedCell = selection.getFocusedElement() as Required<IResultSetElementKey> | null;
  const selectedCells = selection.getSelectedElements();

  if (selectedCells.length === 0 && focusedCell) {
    selectedCells.push(focusedCell);
  }

  const parsedGISData = useMemo(() => {
    const result: IGeoJSONFeature[] = [];

    for (const cell of selectedCells) {
      const cellValue = gis.getCellValue(cell);

      if (!cellValue) {
        continue;
      }

      try {
        const parsedCellValue = wktToGeoJSON(cellValue.mapText || cellValue.text);
        result.push({ type: 'Feature', geometry: parsedCellValue, properties: { associatedCell: cell, srid: cellValue.srid } });
      } catch (exception) {
        console.error(`Failed to parse "${cellValue.mapText || cellValue.text}" value.`);
        console.error(exception);
      }
    }

    return result;
  }, [selectedCells, gis]);

  const getAssociatedValues = useCallback((cell: Required<IResultSetElementKey>): IAssociatedValue[] => {
    if (!modelResultData?.data?.columns || !modelResultData?.data?.rows) {
      return [];
    }

    const { column: columnIndex, row: rowIndex } = cell;

    return modelResultData.data.columns.reduce((result: IAssociatedValue[], column, i) => {
      if (i !== columnIndex) {
        result.push({
          key: column.name!,
          value: model.source
            .getEditor(resultIndex)
            .getCell(rowIndex, i),
        });
      }

      return result;
    }, []);
  }, [modelResultData, model, resultIndex]);

  if (!parsedGISData.length) {
    return <TextPlaceholder>{translate('gis_presentation_placeholder')}</TextPlaceholder>;
  }

  return (
    <LeafletMap geoJSON={parsedGISData} getAssociatedValues={getAssociatedValues} />
  );
});
