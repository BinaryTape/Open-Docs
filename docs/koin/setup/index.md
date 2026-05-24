---
title: 设置与版本
---

# 设置 Koin

本指南涵盖了将 Koin 添加到项目所需的一切内容。

## 快速设置

选择您的平台以开始使用：

| 平台 | 软件包 | 指南 |
|----------|---------|-------|
| **Kotlin/JVM** | `koin-core` | [Gradle 设置](/docs/setup/gradle#kotlin) |
| **Android** | `koin-android` | [Gradle 设置](/docs/setup/gradle#android) |
| **Android + Jetpack Compose** | `koin-android` + `koin-compose` | [Gradle 设置](/docs/setup/gradle#compose-android) |
| **Compose Multiplatform** | `koin-compose` | [Gradle 设置](/docs/setup/gradle#compose) |
| **Kotlin Multiplatform** | `koin-core` | [Gradle 设置](/docs/setup/gradle#kotlin-multiplatform) |
| **Ktor** | `koin-ktor` | [Gradle 设置](/docs/setup/gradle#ktor) |

## 推荐设置：BOM + 编译器插件

为了获得最佳体验，我们建议：

1. **使用 Koin BOM** —— 管理所有 Koin 库版本
2. **使用 Koin 编译器插件** —— 提供编译时安全

有关详细说明，请参阅 **[编译器插件设置指南](/docs/setup/compiler-plugin)**。

## 设置指南

### [Gradle 设置](/docs/setup/gradle)

适用于所有平台的完整依赖项配置：
- Koin BOM（推荐）
- 版本编目 (Version catalogs)
- 平台特定软件包
- 测试依赖项

### [编译器插件设置](/docs/setup/compiler-plugin)

Koin 编译器插件详细指南：
- Gradle 插件配置
- 配置选项
- Kotlin 版本要求
- 故障排除

### [KSP 处理器设置](/docs/setup/annotations-ksp)（已弃用）

`koin-ksp-compiler`（基于 KSP 的 Koin 注解处理器）的旧版设置：
- ⚠️ `koin-ksp-compiler` 已弃用 — 请迁移到 Koin 编译器插件
- Koin 注解本身**并未**弃用；`koin-annotations` 现在是 Koin 主项目的一部分
- 包含迁移指南

## 版本兼容性

| Koin 版本 | Kotlin 版本 | Koin 编译器插件 |
|--------------|----------------|----------------------|
| 4.2.x | 2.3+ | ✅ 推荐 |
| 4.1.x | 2.1/2.2+ | ⚠️ 仅限 KSP 处理器 |
| 4.0.x | 1.9/2.0+ | ⚠️ 仅限 KSP 处理器 |
| 3.5.x | 1.8+ | ❌ 不可用 |

## 当前版本

- **Koin**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- **Koin 编译器插件**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上查找所有 Koin 软件包。

## 后续步骤

设置完成后：
- **[核心概念](/docs/reference/koin-core/starting-koin)** —— 了解如何使用 Koin
- **[教程](/docs/quickstart/kotlin)** —— 构建您的第一个应用
- **[Android 集成](/docs/reference/koin-android/start)** —— Android 特定功能