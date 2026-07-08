# Changelog

## 0.0.51 (2026-07-08)

### 修复
- 修复 `resetGame()` 重新开始游戏时魂（Soul）丢失的问题：魂现在与武器/防具/饰品一样在 resetGame 中被保留
- 修复切换背包后魂错误保留的问题：`EquipSet` 新增 `weaponSoulId`/`armorSoulId` 字段，每个背包独立保存魂状态
- 修复切换背包后无法切回的问题：默认背包初始化补充 `weaponSoulId`/`armorSoulId` 字段，`accessoryIds` 增加空数组防御

### 回退
- `TitleScreen.tsx` 恢复原有逻辑：死亡后不可继续游戏（`canContinue = battlePoints > 0`）

## 0.0.50 (2026-07-08)

### 修复
- 修复 BattleResult.tsx 中掉落物品描述未使用多语言翻译的问题
- 修复 DropGuideModal.tsx 中 Equipment Drop 搜索不支持多语言的问题（现在支持7种语言搜索）
- 修复 Inventory.tsx 中 Soul 列表和详情弹窗中"属性值""百分比"硬编码中文未使用 `t()` 的问题
- 补充 names.ts 中 70+ 条缺失的 Boss 名称多语言翻译

### 新增
- `languageData.ts`: 新增"属性值"和"百分比"的7语言翻译

### 修改
- `equipmentNames.ts`: 导出 `equipmentNameTranslations` 供多语言搜索使用

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