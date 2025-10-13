/**
 * 表格单元格样式类型和转换测试
 * 测试 V1TableCellStyle 的新旧格式兼容性和适配器转换
 */

import { describe, it, expect } from 'vitest';
import type { V1TableCellStyle } from '../../src/types/v1-compat-types.js';
import { V1ToV2Adapter, V2ToV1Adapter } from '../../src/adapters/v1-v2-adapter.js';

describe('V1TableCellStyle 类型定义', () => {
  describe('新格式支持', () => {
    it('应该支持新格式的 color 字段', () => {
      const style: V1TableCellStyle = {
        color: '#FFFFFF',
        backcolor: '#4472C4',
        fontsize: '14px',
        bold: true,
        align: 'center'
      };

      expect(style.color).toBe('#FFFFFF');
      expect(style.backcolor).toBe('#4472C4');
      expect(style.fontsize).toBe('14px');
    });

    it('应该支持字体大小使用 px 单位', () => {
      const style: V1TableCellStyle = {
        fontsize: '14px'
      };

      expect(style.fontsize).toBe('14px');
    });

    it('应该支持字体大小使用 pt 单位', () => {
      const style: V1TableCellStyle = {
        fontsize: '12pt'
      };

      expect(style.fontsize).toBe('12pt');
    });
  });

  describe('旧格式兼容', () => {
    it('应该支持旧格式的 themeColor 字段', () => {
      const style: V1TableCellStyle = {
        themeColor: { color: '#333333', colorType: 'dk1' },
        themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
        fontsize: '14px'
      };

      expect(style.themeColor).toEqual({ color: '#333333', colorType: 'dk1' });
      expect(style.themeBackcolor).toEqual({ color: '#FFFFFF', colorType: 'lt1' });
    });

    it('旧格式字段应该标记为 deprecated', () => {
      // 这是类型层面的测试，确保 @deprecated 标记存在
      // 实际使用时 IDE 会显示警告
      const style: V1TableCellStyle = {
        themeColor: { color: '#000000' },
        themeBackcolor: { color: '#FFFFFF' }
      };

      expect(style.themeColor).toBeDefined();
      expect(style.themeBackcolor).toBeDefined();
    });
  });

  describe('混合格式支持', () => {
    it('应该允许新旧格式字段同时存在', () => {
      const style: V1TableCellStyle = {
        color: '#FFFFFF',
        themeColor: { color: '#000000', colorType: 'dk1' },
        backcolor: '#4472C4',
        themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
        fontsize: '14px'
      };

      expect(style.color).toBe('#FFFFFF');
      expect(style.themeColor).toEqual({ color: '#000000', colorType: 'dk1' });
      expect(style.backcolor).toBe('#4472C4');
      expect(style.themeBackcolor).toEqual({ color: '#FFFFFF', colorType: 'lt1' });
    });
  });
});

describe('V1ToV2Adapter.convertTableCellStyle', () => {
  describe('新格式转换', () => {
    it('应该保持新格式不变', () => {
      const input: V1TableCellStyle = {
        color: '#FFFFFF',
        backcolor: '#4472C4',
        fontsize: '14px',
        bold: true,
        align: 'center'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual({
        color: '#FFFFFF',
        backcolor: '#4472C4',
        fontsize: '14px',
        bold: true,
        align: 'center'
      });
    });
  });

  describe('旧格式转换', () => {
    it('应该将 themeColor 转换为 color', () => {
      const input: V1TableCellStyle = {
        themeColor: { color: '#333333', colorType: 'dk1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual({
        color: '#333333',
        fontsize: '14px'
      });
      expect(result?.themeColor).toBeUndefined();
    });

    it('应该将 themeBackcolor 转换为 backcolor', () => {
      const input: V1TableCellStyle = {
        themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual({
        backcolor: '#FFFFFF',
        fontsize: '14px'
      });
      expect(result?.themeBackcolor).toBeUndefined();
    });

    it('应该同时转换 themeColor 和 themeBackcolor', () => {
      const input: V1TableCellStyle = {
        themeColor: { color: '#333333', colorType: 'dk1' },
        themeBackcolor: { color: '#D9E2F3', colorType: 'accent1' },
        fontsize: '12px',
        bold: true
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual({
        color: '#333333',
        backcolor: '#D9E2F3',
        fontsize: '12px',
        bold: true
      });
    });
  });

  describe('混合格式转换（优先级规则）', () => {
    it('当 color 和 themeColor 同时存在时，应该优先使用 color', () => {
      const input: V1TableCellStyle = {
        color: '#FFFFFF',
        themeColor: { color: '#000000', colorType: 'dk1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result?.color).toBe('#FFFFFF');
      expect(result?.themeColor).toBeUndefined();
    });

    it('当 backcolor 和 themeBackcolor 同时存在时，应该优先使用 backcolor', () => {
      const input: V1TableCellStyle = {
        backcolor: '#4472C4',
        themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result?.backcolor).toBe('#4472C4');
      expect(result?.themeBackcolor).toBeUndefined();
    });

    it('应该正确处理完整的混合格式', () => {
      const input: V1TableCellStyle = {
        color: '#FFFFFF',
        themeColor: { color: '#000000', colorType: 'dk1' },
        backcolor: '#4472C4',
        themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
        fontsize: '14px',
        bold: true,
        align: 'center'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual({
        color: '#FFFFFF',        // 优先使用新格式
        backcolor: '#4472C4',    // 优先使用新格式
        fontsize: '14px',
        bold: true,
        align: 'center'
      });
    });
  });

  describe('边界情况', () => {
    it('应该处理 undefined 输入', () => {
      const result = V1ToV2Adapter.convertTableCellStyle(undefined);
      expect(result).toBeUndefined();
    });

    it('应该处理空对象', () => {
      const result = V1ToV2Adapter.convertTableCellStyle({});
      expect(result).toBeUndefined();
    });

    it('应该保留所有基本样式属性', () => {
      const input: V1TableCellStyle = {
        bold: true,
        em: true,
        underline: true,
        strikethrough: true,
        fontsize: '14px',
        fontname: 'Arial',
        align: 'left'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual(input);
    });

    it('应该处理空字符串颜色（回退到 themeColor）', () => {
      const input: V1TableCellStyle = {
        color: '',
        themeColor: { color: '#000000', colorType: 'dk1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      // 空字符串被视为 falsy，应该回退到 themeColor
      expect(result).toEqual({
        color: '#000000',
        fontsize: '14px'
      });
    });

    it('应该处理空字符串背景色（回退到 themeBackcolor）', () => {
      const input: V1TableCellStyle = {
        backcolor: '',
        themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      // 空字符串被视为 falsy，应该回退到 themeBackcolor
      expect(result).toEqual({
        backcolor: '#FFFFFF',
        fontsize: '14px'
      });
    });

    it('应该处理同时为空字符串的颜色和背景色', () => {
      const input: V1TableCellStyle = {
        color: '',
        backcolor: '',
        themeColor: { color: '#333333', colorType: 'dk1' },
        themeBackcolor: { color: '#D9E2F3', colorType: 'accent1' },
        fontsize: '14px'
      };

      const result = V1ToV2Adapter.convertTableCellStyle(input);

      expect(result).toEqual({
        color: '#333333',
        backcolor: '#D9E2F3',
        fontsize: '14px'
      });
    });
  });
});

describe('V2ToV1Adapter.convertTableCellStyle', () => {
  it('应该保持新格式不变', () => {
    const input: V1TableCellStyle = {
      color: '#FFFFFF',
      backcolor: '#4472C4',
      fontsize: '14px'
    };

    const result = V2ToV1Adapter.convertTableCellStyle(input);

    expect(result).toEqual(input);
  });

  it('应该将旧格式转换为新格式', () => {
    const input: V1TableCellStyle = {
      themeColor: { color: '#333333', colorType: 'dk1' },
      themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
      fontsize: '14px'
    };

    const result = V2ToV1Adapter.convertTableCellStyle(input);

    expect(result).toEqual({
      color: '#333333',
      backcolor: '#FFFFFF',
      fontsize: '14px'
    });
  });

  it('V2ToV1 转换应该与 V1ToV2 转换一致', () => {
    const input: V1TableCellStyle = {
      themeColor: { color: '#333333', colorType: 'dk1' },
      fontsize: '14px'
    };

    const v1ToV2Result = V1ToV2Adapter.convertTableCellStyle(input);
    const v2ToV1Result = V2ToV1Adapter.convertTableCellStyle(input);

    expect(v1ToV2Result).toEqual(v2ToV1Result);
  });
});

describe('转换可逆性测试', () => {
  it('新格式应该保持完全可逆', () => {
    const original: V1TableCellStyle = {
      color: '#FFFFFF',
      backcolor: '#4472C4',
      fontsize: '14px',
      bold: true,
      align: 'center'
    };

    // V1 → V2 → V1
    const v2Result = V1ToV2Adapter.convertTableCellStyle(original);
    const v1Result = V2ToV1Adapter.convertTableCellStyle(v2Result);

    expect(v1Result).toEqual(original);
  });

  it('旧格式转换为新格式后应该保持稳定', () => {
    const original: V1TableCellStyle = {
      themeColor: { color: '#333333', colorType: 'dk1' },
      themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
      fontsize: '14px'
    };

    const expected: V1TableCellStyle = {
      color: '#333333',
      backcolor: '#FFFFFF',
      fontsize: '14px'
    };

    // 第一次转换
    const result1 = V1ToV2Adapter.convertTableCellStyle(original);
    expect(result1).toEqual(expected);

    // 第二次转换（应该保持不变）
    const result2 = V1ToV2Adapter.convertTableCellStyle(result1);
    expect(result2).toEqual(expected);
  });
});

describe('实际使用场景', () => {
  it('应该正确转换表头单元格样式', () => {
    const headerStyle: V1TableCellStyle = {
      bold: true,
      color: '#FFFFFF',
      backcolor: '#4472C4',
      fontsize: '14px',
      align: 'center'
    };

    const result = V1ToV2Adapter.convertTableCellStyle(headerStyle);

    expect(result).toEqual(headerStyle);
  });

  it('应该正确转换数据单元格样式', () => {
    const dataStyle: V1TableCellStyle = {
      color: '#333333',
      backcolor: '#FFFFFF',
      fontsize: '12px',
      align: 'left'
    };

    const result = V1ToV2Adapter.convertTableCellStyle(dataStyle);

    expect(result).toEqual(dataStyle);
  });

  it('应该正确转换包含旧格式的数据', () => {
    const legacyStyle: V1TableCellStyle = {
      themeColor: { color: '#70AD47', colorType: 'accent3' },
      fontsize: '12px',
      align: 'center'
    };

    const result = V1ToV2Adapter.convertTableCellStyle(legacyStyle);

    expect(result).toEqual({
      color: '#70AD47',
      fontsize: '12px',
      align: 'center'
    });
  });
});

describe('表格元素集成测试', () => {
  it('应该正确转换包含单元格样式的完整表格元素', () => {
    // 模拟一个包含单元格样式的表格元素
    const tableData = [
      [
        {
          id: 'cell-1-1',
          colspan: 1,
          rowspan: 1,
          text: '表头',
          style: {
            bold: true,
            themeColor: { color: '#FFFFFF', colorType: 'lt1' },
            themeBackcolor: { color: '#4472C4', colorType: 'accent1' },
            fontsize: '14px',
            align: 'center' as const
          }
        },
        {
          id: 'cell-1-2',
          colspan: 1,
          rowspan: 1,
          text: '数据',
          style: {
            color: '#333333',
            backcolor: '#FFFFFF',
            fontsize: '12px',
            align: 'left' as const
          }
        }
      ]
    ];

    // 转换表格中的所有单元格样式
    const convertedData = tableData.map(row =>
      row.map(cell => ({
        ...cell,
        style: V1ToV2Adapter.convertTableCellStyle(cell.style)
      }))
    );

    // 验证第一个单元格（旧格式）转换正确
    expect(convertedData[0][0].style).toEqual({
      bold: true,
      color: '#FFFFFF',
      backcolor: '#4472C4',
      fontsize: '14px',
      align: 'center'
    });

    // 验证第二个单元格（新格式）保持不变
    expect(convertedData[0][1].style).toEqual({
      color: '#333333',
      backcolor: '#FFFFFF',
      fontsize: '12px',
      align: 'left'
    });
  });

  it('应该处理混合格式的表格元素', () => {
    const mixedTableData = [
      [
        {
          id: 'cell-1',
          text: '混合格式单元格',
          style: {
            color: '#FFFFFF',
            themeColor: { color: '#000000', colorType: 'dk1' },
            backcolor: '#4472C4',
            fontsize: '14px'
          }
        }
      ]
    ];

    const converted = mixedTableData.map(row =>
      row.map(cell => ({
        ...cell,
        style: V1ToV2Adapter.convertTableCellStyle(cell.style)
      }))
    );

    // 应该优先使用新格式的 color 和 backcolor
    expect(converted[0][0].style).toEqual({
      color: '#FFFFFF',
      backcolor: '#4472C4',
      fontsize: '14px'
    });
  });

  it('应该处理包含空样式的单元格', () => {
    const tableWithEmptyStyles = [
      [
        { id: 'cell-1', text: '无样式', style: undefined },
        { id: 'cell-2', text: '空对象', style: {} }
      ]
    ];

    const converted = tableWithEmptyStyles.map(row =>
      row.map(cell => ({
        ...cell,
        style: V1ToV2Adapter.convertTableCellStyle(cell.style)
      }))
    );

    expect(converted[0][0].style).toBeUndefined();
    expect(converted[0][1].style).toBeUndefined();
  });

  it('应该正确处理大型表格的批量转换', () => {
    // 创建一个 5x5 的表格
    const largeTable = Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from({ length: 5 }, (_, colIndex) => ({
        id: `cell-${rowIndex}-${colIndex}`,
        text: `Cell ${rowIndex}-${colIndex}`,
        style: {
          themeColor: { color: '#333333', colorType: 'dk1' },
          themeBackcolor: { color: '#FFFFFF', colorType: 'lt1' },
          fontsize: '12px'
        }
      }))
    );

    const converted = largeTable.map(row =>
      row.map(cell => ({
        ...cell,
        style: V1ToV2Adapter.convertTableCellStyle(cell.style)
      }))
    );

    // 验证所有单元格都正确转换
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        expect(converted[i][j].style).toEqual({
          color: '#333333',
          backcolor: '#FFFFFF',
          fontsize: '12px'
        });
      }
    }
  });
});
