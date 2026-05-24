---
title: 設定與版本
---

# 設定 Koin

本指南涵蓋了將 Koin 新增到專案中所需的所有內容。

## 快速設定

選擇您的平台以開始使用：

| 平台 | 套件 | 指南 |
|----------|---------|-------|
| **Kotlin/JVM** | `koin-core` | [Gradle 設定](/docs/setup/gradle#kotlin) |
| **Android** | `koin-android` | [Gradle 設定](/docs/setup/gradle#android) |
| **Android + Jetpack Compose** | `koin-android` + `koin-compose` | [Gradle 設定](/docs/setup/gradle#compose-android) |
| **Compose Multiplatform** | `koin-compose` | [Gradle 設定](/docs/setup/gradle#compose) |
| **Kotlin Multiplatform** | `koin-core` | [Gradle 設定](/docs/setup/gradle#kotlin-multiplatform) |
| **Ktor** | `koin-ktor` | [Gradle 設定](/docs/setup/gradle#ktor) |

## 建議設定：BOM + 編譯器外掛程式

為了獲得最佳體驗，我們建議：

1. **使用 Koin BOM** - 管理所有 Koin 程式庫版本
2. **使用 Koin 編譯器外掛程式** - 提供編譯期安全性

請參閱 **[編譯器外掛程式設定指南](/docs/setup/compiler-plugin)** 以獲取詳細說明。

## 設定指南

### [Gradle 設定](/docs/setup/gradle)

適用於所有平台的完整相依性配置：
- Koin BOM（建議使用）
- 版本目錄 (Version catalogs)
- 平台專屬套件
- 測試相依性

### [編譯器外掛程式設定](/docs/setup/compiler-plugin)

Koin 編譯器外掛程式的詳細指南：
- Gradle 外掛程式配置
- 配置選項
- Kotlin 版本需求
- 疑難排解

### [KSP 處理器設定](/docs/setup/annotations-ksp)（已棄用）

基於 KSP 的 Koin Annotations 處理器 `koin-ksp-compiler` 的舊版設定：
- ⚠️ `koin-ksp-compiler` 已棄用 — 請遷移至 Koin 編譯器外掛程式
- Koin Annotations 本身**並未**棄用；`koin-annotations` 現在是 Koin 主專案的一部分
- 包含遷移指南

## 版本相容性

| Koin 版本 | Kotlin 版本 | Koin 編譯器外掛程式 |
|--------------|----------------|----------------------|
| 4.2.x | 2.3+ | ✅ 建議使用 |
| 4.1.x | 2.1/2.2+ | ⚠️ 僅限 KSP 處理器 |
| 4.0.x | 1.9/2.0+ | ⚠️ 僅限 KSP 處理器 |
| 3.5.x | 1.8+ | ❌ 不可用 |

## 目前版本

- **Koin**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- **Koin 編譯器外掛程式**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上尋找所有 Koin 套件。

## 後續步驟

設定完成後：
- **[核心概念](/docs/reference/koin-core/starting-koin)** - 了解如何使用 Koin
- **[教學](/docs/quickstart/kotlin)** - 打造您的第一個應用程式
- **[Android 整合](/docs/reference/koin-android/start)** - Android 專屬功能