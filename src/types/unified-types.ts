/**
 * 统一类型接口
 * 提供统一的类型接口，自动处理版本转换
 */

import type { V1CompatiblePPTElement } from './v1-compat-types.js';
import type { PPTElement } from './v2-standard-types.js';
import { V1ToV2Adapter, V2ToV1Adapter, VersionDetector } from '../adapters/v1-v2-adapter.js';

/**
 * 统一PPT元素包装器
 * 自动处理V1/V2版本转换，提供统一的操作接口
 */
export class UnifiedPPTElement {
  private _data: V1CompatiblePPTElement | PPTElement;
  private _version: 'v1' | 'v2';

  constructor(data: V1CompatiblePPTElement | PPTElement) {
    this._data = data;
    this._version = VersionDetector.isV1Element(data) ? 'v1' : 'v2';
  }

  /**
   * 获取V1格式数据
   */
  asV1(): V1CompatiblePPTElement {
    if (this._version === 'v1') {
      return this._data as V1CompatiblePPTElement;
    }
    return V2ToV1Adapter.convertElement(this._data as PPTElement);
  }

  /**
   * 获取V2格式数据
   */
  asV2(): PPTElement | null {
    if (this._version === 'v2') {
      return this._data as PPTElement;
    }
    return V1ToV2Adapter.convertElement(this._data as V1CompatiblePPTElement);
  }

  /**
   * 获取原始数据
   */
  raw(): V1CompatiblePPTElement | PPTElement {
    return this._data;
  }

  /**
   * 获取版本信息
   */
  version(): 'v1' | 'v2' {
    return this._version;
  }

  /**
   * 获取元素ID
   */
  getId(): string {
    return this._data.id;
  }

  /**
   * 获取元素类型
   */
  getType(): string {
    return this._data.type;
  }

  /**
   * 获取元素位置
   */
  getPosition(): { left: number; top: number; width: number; height: number } {
    return {
      left: this._data.left,
      top: this._data.top,
      width: this._data.width,
      height: (this._data as any).height || 0
    };
  }

  /**
   * 设置元素位置
   */
  setPosition(position: Partial<{ left: number; top: number; width: number; height: number }>): void {
    Object.assign(this._data, position);
  }

  /**
   * 获取元素旋转角度
   */
  getRotation(): number {
    return (this._data as any).rotate || 0;
  }

  /**
   * 设置元素旋转角度
   */
  setRotation(rotation: number): void {
    (this._data as any).rotate = rotation;
  }

  /**
   * 检查是否被锁定
   */
  isLocked(): boolean {
    return this._data.lock || false;
  }

  /**
   * 设置锁定状态
   */
  setLocked(locked: boolean): void {
    this._data.lock = locked;
  }

  /**
   * 获取分组ID
   */
  getGroupId(): string | undefined {
    return this._data.groupId;
  }

  /**
   * 设置分组ID
   */
  setGroupId(groupId: string | undefined): void {
    this._data.groupId = groupId;
  }

  /**
   * 克隆元素
   */
  clone(): UnifiedPPTElement {
    const clonedData = JSON.parse(JSON.stringify(this._data));
    return new UnifiedPPTElement(clonedData);
  }

  /**
   * 转换为JSON
   */
  toJSON(): any {
    return this._data;
  }

  /**
   * 从JSON创建
   */
  static fromJSON(data: any): UnifiedPPTElement {
    return new UnifiedPPTElement(data);
  }
}

/**
 * 统一PPT元素集合
 * 管理多个PPT元素，提供批量操作能力
 */
export class UnifiedPPTElementCollection {
  private _elements: UnifiedPPTElement[];

  constructor(elements: (V1CompatiblePPTElement | PPTElement)[] = []) {
    this._elements = elements.map(el => new UnifiedPPTElement(el));
  }

  /**
   * 添加元素
   */
  add(element: V1CompatiblePPTElement | PPTElement | UnifiedPPTElement): void {
    if (element instanceof UnifiedPPTElement) {
      this._elements.push(element);
    } else {
      this._elements.push(new UnifiedPPTElement(element));
    }
  }

  /**
   * 移除元素
   */
  remove(id: string): boolean {
    const index = this._elements.findIndex(el => el.getId() === id);
    if (index >= 0) {
      this._elements.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 根据ID查找元素
   */
  findById(id: string): UnifiedPPTElement | undefined {
    return this._elements.find(el => el.getId() === id);
  }

  /**
   * 根据类型筛选元素
   */
  filterByType(type: string): UnifiedPPTElement[] {
    return this._elements.filter(el => el.getType() === type);
  }

  /**
   * 获取所有元素
   */
  getAll(): UnifiedPPTElement[] {
    return [...this._elements];
  }

  /**
   * 获取元素数量
   */
  count(): number {
    return this._elements.length;
  }

  /**
   * 清空所有元素
   */
  clear(): void {
    this._elements = [];
  }

  /**
   * 批量转换为V1格式
   */
  asV1Array(): V1CompatiblePPTElement[] {
    return this._elements.map(el => el.asV1());
  }

  /**
   * 批量转换为V2格式
   */
  asV2Array(): PPTElement[] {
    return this._elements
      .map(el => el.asV2())
      .filter((el): el is PPTElement => el !== null);
  }

  /**
   * 获取版本统计
   */
  getVersionStats(): { v1: number; v2: number; total: number } {
    const v1Count = this._elements.filter(el => el.version() === 'v1').length;
    const v2Count = this._elements.filter(el => el.version() === 'v2').length;
    return {
      v1: v1Count,
      v2: v2Count,
      total: this._elements.length
    };
  }

  /**
   * 批量设置属性
   */
  batchUpdate(updater: (element: UnifiedPPTElement) => void): void {
    this._elements.forEach(updater);
  }

  /**
   * 复制集合
   */
  clone(): UnifiedPPTElementCollection {
    const clonedElements = this._elements.map(el => el.clone());
    const collection = new UnifiedPPTElementCollection();
    collection._elements = clonedElements;
    return collection;
  }

  /**
   * 转换为JSON数组
   */
  toJSON(): any[] {
    return this._elements.map(el => el.toJSON());
  }

  /**
   * 从JSON数组创建
   */
  static fromJSON(data: any[]): UnifiedPPTElementCollection {
    return new UnifiedPPTElementCollection(data);
  }

  /**
   * 迭代器支持
   */
  [Symbol.iterator](): Iterator<UnifiedPPTElement> {
    let index = 0;
    const elements = this._elements;

    return {
      next(): IteratorResult<UnifiedPPTElement> {
        if (index < elements.length) {
          return { value: elements[index++], done: false };
        } else {
          return { done: true, value: undefined };
        }
      }
    };
  }
}

/**
 * 版本转换工具
 */
export class VersionConversionUtils {
  /**
   * 智能批量转换
   */
  static smartBatchConvert(
    elements: (V1CompatiblePPTElement | PPTElement)[],
    targetVersion: 'v1' | 'v2'
  ): (V1CompatiblePPTElement | PPTElement)[] {
    if (targetVersion === 'v1') {
      return elements.map(el => {
        const unified = new UnifiedPPTElement(el);
        return unified.asV1();
      });
    } else {
      return elements
        .map(el => {
          const unified = new UnifiedPPTElement(el);
          return unified.asV2();
        })
        .filter((el): el is PPTElement => el !== null);
    }
  }

  /**
   * 检测混合版本并标准化
   */
  static normalizeToVersion(
    elements: (V1CompatiblePPTElement | PPTElement)[],
    targetVersion: 'v1' | 'v2'
  ): {
    converted: (V1CompatiblePPTElement | PPTElement)[];
    stats: { original: { v1: number; v2: number }; converted: number; skipped: number };
  } {
    const collection = new UnifiedPPTElementCollection(elements);
    const originalStats = collection.getVersionStats();

    let converted: (V1CompatiblePPTElement | PPTElement)[];
    let skipped = 0;

    if (targetVersion === 'v1') {
      converted = collection.asV1Array();
    } else {
      const v2Array = collection.asV2Array();
      converted = v2Array;
      skipped = elements.length - v2Array.length;
    }

    return {
      converted,
      stats: {
        original: { v1: originalStats.v1, v2: originalStats.v2 },
        converted: converted.length,
        skipped
      }
    };
  }

  /**
   * 版本兼容性检查
   */
  static checkCompatibility(
    elements: (V1CompatiblePPTElement | PPTElement)[]
  ): {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    const collection = new UnifiedPPTElementCollection(elements);
    const stats = collection.getVersionStats();

    // 检查版本混合情况
    if (stats.v1 > 0 && stats.v2 > 0) {
      issues.push(`检测到版本混合：${stats.v1}个V1元素，${stats.v2}个V2元素`);
      recommendations.push('建议统一转换到V2版本以获得最佳兼容性');
    }

    // 检查V1特有元素
    const v1Elements = collection.getAll().filter(el => el.version() === 'v1');
    const noneElements = v1Elements.filter(el => el.getType() === 'none');
    if (noneElements.length > 0) {
      issues.push(`发现${noneElements.length}个V1特有的'none'类型元素，V2版本不支持`);
      recommendations.push('考虑将none元素转换为text或其他V2支持的类型');
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }
}