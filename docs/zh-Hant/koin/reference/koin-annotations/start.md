---
title: Koin Annotations 入門
---

:::info Koin Annotations 狀態
**Koin Annotations 現在是 Koin 專案的一部分。** `koin-annotations` 程式庫隨主 Koin 版本發行，並受到完整支援。

舊版的 KSP 處理器 (`koin-ksp-compiler`) 已**棄用**，取而代之的是 **Koin 編譯器外掛程式** — 您的註解保持不變；僅需變更建置設定。請參閱 [從 KSP 遷移至編譯器外掛程式](/docs/migration/from-ksp-to-compiler-plugin)。
:::

Koin Annotations 讓您可以使用註解在類別上宣告定義。Koin 編譯器外掛程式會處理這些註解，並在編譯期為您產生所有底層的 Koin DSL。

## 快速入門

對 Koin 不熟悉嗎？首先，請查看 [Koin 快速入門](https://insert-koin.io/docs/quickstart/kotlin/)

### 設定

將 Koin 編譯器外掛程式加入到您的專案中。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin) 以獲取完整說明。

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

### 為元件加上註解

使用定義註解標記您的元件：

```kotlin
@Singleton
class MyRepository

@Singleton
class MyService(val repository: MyRepository)

@Factory
class MyUseCase(val service: MyService)
```

### 宣告模組

建立模組以組織您的定義：

```kotlin
@Module
@ComponentScan("com.myapp")
class AppModule
```

### 啟動 Koin

搭配型別安全啟動 API 使用 `@KoinApplication`：

```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp> {
        printLogger()
    }

    // 像往常一樣使用您的 Koin API 即可
    KoinPlatform.getKoin().get<MyService>()
}
```

## 配置標記

使用 `@Configuration` 建立根據標記載入的模組：

```kotlin
@Module
@Configuration  // 預設配置
class CoreModule

@Module
@Configuration("prod")
class ProdModule

@Module
@Configuration("test")
class TestModule
```

載入特定配置：

```kotlin
@KoinApplication(
    modules = [CoreModule::class],
    configurations = ["prod"]  // 僅載入標記為 @Configuration("prod") 的模組
)
class ProdApp

fun main() {
    startKoin<ProdApp>()
}
```

## 型別安全啟動 API

編譯器外掛程式提供了用於啟動 Koin 的型別安全 API：

| API | 說明 |
|-----|-------------|
| `startKoin<T>()` | 全域啟動 Koin |
| `startKoin<T> { }` | 使用配置區塊啟動 |
| `koinApplication<T>()` | 建立隔離的 KoinApplication |
| `koinConfiguration<T>()` | 建立配置（適用於 Compose、Ktor） |
| `module<T>()` | 載入單一 `@Module` 類別 |
| `modules(A::class, B::class)` | 載入多個 `@Module` 類別 |

其中 `T` 是標記有 `@KoinApplication`（適用於啟動 API）或 `@Module`（適用於模組載入 API）的類別。

### 載入個別模組

您可以直接載入 `@Module` 類別，無需使用 `@KoinApplication`：

```kotlin
startKoin {
    module<NetworkModule>()
    modules(DataModule::class, CacheModule::class)
}
```

這對於**測試**特別有用：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 編譯期安全

編譯器外掛程式會在編譯期驗證您的 Koin 配置，檢查所有相依性是否已宣告且可存取。

### 使用 @Provided 繞過

使用 `@Provided` 來表示相依性是由外部提供的：

```kotlin
class ExternalComponent  // 宣告於他處

@Factory
class MyPresenter(@Provided val external: ExternalComponent)
```

## 編譯器外掛程式選項

請參閱 **[編譯器外掛程式選項](/docs/reference/koin-annotations/options)** 以獲取所有配置選項。

## ProGuard 規則

搭配 ProGuard/R8 進行 SDK 開發時：

```
# 保留註解定義
-keep class org.koin.core.annotation.** { *; }

# 保留使用 Koin 註解標記的類別
-keep @org.koin.core.annotation.* class * { *; }
```

## 另請參閱

- **[編譯器外掛程式設定](/docs/setup/compiler-plugin)** – 完整設定指南
- **[定義](/docs/reference/koin-annotations/definitions)** – 所有定義註解
- **[模組](/docs/reference/koin-annotations/modules)** – 模組組織
- **[KMP 支援](/docs/reference/koin-annotations/kmp)** – Kotlin 多平台