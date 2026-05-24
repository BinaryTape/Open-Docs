---
title: 什麼是 Koin Annotations？
---

# 什麼是 Koin Annotations？

### 熟悉的註解樣式 — 主 Koin 專案的一部分

**Koin Annotations** 是在 Koin 中定義相依項且基於註解的方式。如果您比起 Kotlin DSL 更喜歡 `@Singleton`、`@Factory`、`@KoinViewModel` 這種樣式，這將非常適合您。

它是**主 Koin 專案的一部分** — 相同的 GitHub 存儲庫、相同的發布週期、相同的 Koin 版本以及相同的維護者。它不是一個側邊專案、不是社群分支，也不是一個獨立的架構。它由 **Koin Compiler Plugin** 處理以確保編譯時期安全，就像 DSL 一樣。

## 簡而言之

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

這就是核心概念：為您的類別加上註解，宣告一個模組，Koin Compiler Plugin 就會在建置時完成剩餘的串接工作。

## 主 Koin 專案的一部分

`koin-annotations` 程式庫是**主 Koin 專案的一部分**。它存在於同一個存儲庫中，與 `koin-core` 以**相同的 Koin 版本**發布，遵循相同的發布週期，並包含在 Koin BOM 中：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // same Koin version, same BOM
}
```

這在實務上的意義：

- **未棄用** — 註解是一等公民，是完全受支援的樣式
- **不是獨立產品** — 不需要單獨追蹤名為 "Koin Annotations" 的專案
- **版本保持同步** — `koin-core` 與 `koin-annotations` 永遠保持一致
- **與 DSL 的功能完全一致** — 任何您可以使用 DSL 完成的操作，也可以透過註解來完成

## 現在由 Koin Compiler Plugin 提供支援

Koin Annotations 由 **Koin Compiler Plugin** 處理 — 這是一個原生 **Kotlin Compiler Plugin (K2)**，直接與 Kotlin 編譯器整合。不需要 KSP，不需要提交產生的檔案，也沒有額外的處理步驟。

您將獲得：

- **自動裝配** — 自動偵測並解析建構函式參數
- **編譯時期安全** — 在建置時捕捉缺失的相依項、限定符不符以及錯誤的繫結
- **更簡單的 KMP 設定** — 不需要針對每個目標進行 KSP 設定
- **相同的註解** — `@Singleton`、`@Factory`、`@KoinViewModel`、`@Module`、`@ComponentScan`、`@Named`、`@InjectedParam` 等。

請參閱 [Koin Compiler Plugin](/docs/intro/koin-compiler-plugin) 以全面了解其運作方式及其產生的內容。

## `koin-ksp-compiler` 已棄用

:::warning
舊有的 KSP 處理器 `koin-ksp-compiler` **已棄用**，並將在未來的 Koin 版本中移除。
:::

註解本身**並未**棄用 — 只有過去用來處理它們的基於 KSP 的處理器被棄用。遷移是機械性的：

- **相同的註解** — 您的 `@Singleton`、`@Module`、`@ComponentScan` 程式碼完全保持不變
- **移除 KSP 外掛程式** — 替換為 Koin Compiler Plugin
- **刪除產生的檔案** — Compiler Plugin 不會產生可見的產生成式原始碼

請參閱 [從 KSP 遷移至 Compiler Plugin](/docs/migration/from-ksp-to-compiler-plugin) 了解逐步流程。

## 何時選擇註解

註解和 DSL 都是一等公民。在以下情況請選擇註解：

- 您來自 Hilt、Dagger 或 Spring，並希望使用熟悉的樣式
- 您偏好將定義與其描述的類別放置在一起
- 您的團隊標準化使用基於註解的配置

如果您偏好 Kotlin 原生、純程式碼的樣式，請選擇 DSL。您也可以在同一個專案中**混合使用兩者** — 它們由同一個 Compiler Plugin 處理。

## 下一步

- **[Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)** — 外掛程式如何為您的註解提供支援
- **[註解參考](/docs/reference/koin-annotations/start)** — 完整的註解目錄與模式
- **[從 KSP 遷移至 Compiler Plugin](/docs/migration/from-ksp-to-compiler-plugin)** — 從 `koin-ksp-compiler` 升級的路徑
- **[什麼是 Koin？](/docs/intro/what-is-koin)** — 宏觀視野