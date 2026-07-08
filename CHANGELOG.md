# Changelog

## 0.0.49 (2026-07-08)

### 修复
- 修复材料列表图片显示问题（SpriteIcon中material类型的bit32默认值错误）
- 修复 EquipmentCollection.tsx 列表中描述未使用多语言翻译的问题
- 修复 EquipmentCollection.tsx 详情弹窗中描述未使用多语言翻译的问题
- 修复 Inventory.tsx 详情弹窗中描述未使用多语言翻译的问题

### 修改
- `SpriteIcon.tsx`: 修复material类型的bit32 switch语句，添加default分支使用正确的material配置
- `EquipmentCollection.tsx`: 列表和详情弹窗中描述显示改为使用`getEquipDescription()`
- `Inventory.tsx`: 详情弹窗中描述显示改为使用`getEquipDescription()`

## 0.0.48 (2026-07-08)

### 修复
- 移除前6个饰品插槽的星级显示
- 物品描述添加多语言支持（t()）

### 新增
- 创建 `useEquipmentDescription` hook 处理物品描述多语言翻译
- 创建 `equipmentDescriptions.ts` 数据文件，包含所有物品描述的7种语言翻译（日语、英语、简体中文、繁体中文、韩语、西班牙语、印尼语）

### 修改
- `Inventory.tsx`: 移除前6个饰品插槽星级显示；所有setumei显示改为使用`getEquipDescription()`
- `EquipmentCollection.tsx`: setumei显示改为使用`getEquipDescription()`