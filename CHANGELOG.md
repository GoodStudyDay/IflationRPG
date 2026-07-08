# Changelog

## [0.0.47] - 2026-07-08

### 修复 🐛

- **修复 Soul 物品图片显示错误**：Raccoon Soul、Sphinx Soul、Michael、Gabriel 等 `image=0` 的 Soul 物品现在正确使用 `934_SoulPng.png`（24x24 精灵图），不再显示错误的图片
- **修复 Protection Stone / Power Stone 图片显示错误**：保護の石 (Protection Stone) 和力の石 (Power Stone) 的 `image=1` 现在正确使用 `919_item3png.png`，修复了因 `else if (image && image > 0)` 逻辑 bug 导致 image=1 被错误路由到 accessory2 精灵图的问题

### 新增 ✨

- **SpriteIcon 组件全面重构**：
  - 新增 `bit32` 属性支持，根据武器/防具/材料的 bit32 值选择不同精灵图集
  - 新增 `material` 类型支持，材料物品现在使用独立的精灵图渲染逻辑
  - 新增多个武器精灵图集支持：`921_buki32png.png`、`984_weaponpng01.png`、`1052_newbuki32.png`、`1068_new32weapons.png`
  - 新增 Soul 分档支持：image=0 使用 `934_SoulPng.png`，image=2 使用 `935_SoulPng2.png`

### 改进 🔧

- **多个组件传递 image/bit32 参数**：BattleResult、BattleScreen、DropGuideModal、EquipmentCollection、Inventory、PlayerInfo 等组件现在正确传递 `image` 和 `bit32` 参数给 SpriteIcon，确保所有物品类型显示正确的精灵图
- **equipment.ts**：`ItemMaterialpush` 函数现在正确存储 `bit32` 参数
- **DropGuideModal**：新增 material 类型物品的展示支持
