---
title: 編譯器外掛程式設定
---

# Koin 編譯器外掛程式設定

對於所有新的 Kotlin 2.x 專案，建議使用 **Koin 編譯器外掛程式 (Koin Compiler Plugin)**。它提供了自動裝配 (auto-wiring)、編譯時期安全性以及更簡潔的 DSL 語法。

## 什麼是編譯器外掛程式？

Koin 編譯器外掛程式是一個**原生 Kotlin 編譯器外掛程式 (K2)**，它具備以下功能：

- 自動偵測建構函式相依性
- 提供編譯時期分析
- 同時支援 DSL 和註解 (Annotations)
- 不會產生任何可見檔案

請參閱 [Koin 編譯器外掛程式簡介](/docs/intro/koin-compiler-plugin) 以了解功能與優點的詳細資訊。

:::tip IDE 外掛程式
安裝適用於 Android Studio 和 IntelliJ IDEA 的 **[Koin IDE 外掛程式](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)** — 支援定義與注入點之間的程式碼導覽、即時安全性檢查以及相依圖視覺化。
:::

## 系統需求

- **Kotlin 2.3.20+** (K2 編譯器)
- **Gradle 8.x+**

## 設定

### 步驟 1：將 Koin 新增至版本目錄

首先，檢查最新版本：
- Koin：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin 編譯器外掛程式：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

接著，在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### 步驟 2：配置設定

在您的 `settings.gradle.kts` 中：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### 步驟 3：套用外掛程式

在您模組的 `build.gradle.kts` 中：

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // 用於註解支援
}
```

:::tip
**正在使用 `@KoinViewModel` 或 `@KoinWorker`？** 這些註解需要將其執行時 DSL 加入類別路徑 (classpath) 中：

- `@KoinViewModel` → `implementation("io.insert-koin:koin-core-viewmodel")`
- `@KoinWorker` → `implementation("io.insert-koin:koin-android-workmanager")`

如果您在未加入執行時程式庫的情況下新增註解，編譯器將會失敗並顯示明確的錯誤，指出缺失的構件 (artifact) — 啟動時不再出現無聲的 `NoDefinitionFoundException`。
:::

## 完整範例

### gradle/libs.versions.toml

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### settings.gradle.kts

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### build.gradle.kts

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

## 使用編譯器外掛程式

### DSL 風格

從編譯器外掛程式套件匯入：

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info
編譯器外掛程式 DSL 位於套件 **`org.koin.plugin.module.dsl`** 中。傳統 DSL 仍保留在 `org.koin.dsl`。
:::

### 註解風格

在您的類別上使用註解：

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

### 使用註解啟動 Koin

搭配編譯器外掛程式，使用強型別 API 來啟動 Koin — **無需產生任何程式碼**：

```kotlin
@KoinApplication
@ComponentScan("com.myapp")
class MyApp

// 使用強型別 API 啟動 Koin
startKoin<MyApp>()

// 或使用額外的配置
startKoin<MyApp> {
    androidContext(this@MyApplication)
    printLogger()
}
```

**可用的強型別 API：**

| API | 說明 |
|-----|-------------|
| `startKoin<T>()` | 使用應用程式 T 全域啟動 Koin |
| `startKoin<T> { }` | 使用應用程式 T 和配置區塊啟動 Koin |
| `koinApplication<T>()` | 使用 T 建立隔離的 KoinApplication |
| `koinConfiguration<T>()` | 從 T 建立 KoinConfiguration (用於 Compose KoinApplication、Ktor 等) |

其中 `T` 是標註有 `@KoinApplication` 的類別。

**載入單個模組：**

您也可以不使用 `@KoinApplication`，直接透過 `module<T>()` 或 `modules()` 載入 `@Module` 類別：

```kotlin
startKoin {
    module<NetworkModule>()                              // 載入單個模組
    modules(DataModule::class, CacheModule::class)       // 載入多個模組
}
```

| API | 說明 |
|-----|-------------|
| `module<T>()` | 將單個 `@Module` 類別載入至 KoinApplication |
| `modules(vararg KClass)` | 將多個 `@Module` 類別載入至 KoinApplication |

其中 `T` / 每個 `KClass` 是標註有 `@Module` 的類別。這對於測試或混合使用註解與 DSL 模組時非常有用：

```kotlin
// 在測試中
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 配置選項

在您的 `build.gradle.kts` 中配置編譯器外掛程式：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    unsafeDslChecks = true
}
```

### 可用選項

| 選項 | 說明 | 預設值 |
|--------|-------------|---------|
| `compileSafety` | 編譯時期相依性驗證 (A2/A3/A4) | `true` |
| `strictSafety` | 強制聚合器的安全性檢查在每次建置時重新執行 (跳過 Kotlin 增量編譯 (IC)) | 在聚合器模組上自動偵測 |
| `skipDefaultValues` | 對具有 Kotlin 預設值的參數跳過注入 | `true` |
| `userLogs` | 啟用元件偵測與 DSL/註解處理的記錄 | `false` |
| `debugLogs` | 啟用外掛程式內部處理的詳細偵錯記錄 | `false` |
| `unsafeDslChecks` | 驗證 Lambda 內部的 `create()` 呼叫是否為唯一指令 | `true` |

:::tip
在開發期間將 `userLogs = true` 設定為啟用，以查看外掛程式偵測並處理了哪些元件。
:::

## 編譯時期安全性

Koin 編譯器外掛程式提供了**編譯時期相依性驗證** — 在建置時期驗證所有相依性是否可以解析，而不是在執行時期才失敗。此功能預設為啟用。

```kotlin
koinCompiler {
    compileSafety = true       // 預設啟用
    skipDefaultValues = true   // 預設啟用
}
```

該外掛程式會在三個層級驗證您的圖譜：單一模組 (A2)、`startKoin<T>()` 時的完整圖譜 (A3)，以及每個呼叫點 (A4)。詳細資訊請參閱 [編譯時期安全性](/docs/reference/koin-compiler/compile-safety)。

## 多模組專案

對於具有多個 Gradle 模組的專案：

### 程式庫模組

```kotlin
// feature/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@ComponentScan("com.myapp.feature")
class FeatureModule
```

### 應用程式模組

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(project(":feature"))
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// app/src/main/kotlin/MyModule.kt
@Module
@Configuration
class MyModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp>()
    }
}
```

為主應用程式類別使用 `@KoinApplication` 並搭配強型別啟動 API。

## Kotlin 多平台

編譯器外掛程式支援 KMP 專案：

```kotlin
// shared/build.gradle.kts
plugins {
    id("org.jetbrains.kotlin.multiplatform")
    alias(libs.plugins.koin.compiler)
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.annotations)
        }
    }
}
```

## 疑難排解

### 找不到外掛程式

請確保外掛程式已包含在您的外掛程式儲存庫中：

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### Kotlin 版本不符

編譯器外掛程式需要 Kotlin 2.3.20+。請檢查您的 Kotlin 版本：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20"  // 需要 2.3.20+
}
```

### 匯入錯誤

請確保您從正確的套件匯入：

```kotlin
// 編譯器外掛程式 DSL
import org.koin.plugin.module.dsl.*

// 傳統 DSL
import org.koin.dsl.*
```

### 增量編譯與快取問題

與其他 Kotlin 編譯器外掛程式 (如 Compose Compiler、Metro) 類似，Koin 編譯器外掛程式在 IR 層級運作。Kotlin 的增量編譯有時可能會在某些變更後產生**陳舊或不一致的結果**：

**症狀：**
- 出現不應出現的編譯安全性錯誤 (誤報 false positives)
- 在移除定義後仍未顯示編譯安全性錯誤 (漏報 false negatives)
- 重構後在執行時出現 `NoSuchMethodError` 或 `ClassNotFoundException`

**通常發生在以下情況：**
- 更改類別上的註解 (`@Single` → `@Factory`，新增/移除 `@Named`)
- 在套件之間移動類別 (影響 `@ComponentScan` 偵測)
- 更改模組的 `includes` 或 `@Configuration` 標籤
- 在另一個模組依賴的程式庫模組中新增/移除定義

**修正：** 執行乾淨建置 (clean build)：

```bash
./gradlew clean build
```

或在 Android Studio 中：**Build → Clean Project**，接著 **Build → Rebuild Project**。

:::tip
如果您在重構後遇到意外的編譯安全性錯誤，請先嘗試乾淨建置。這是編譯器外掛程式在增量編譯中的已知限制 — 並非 Koin 特有。

對於圖譜層級的變更 (`module { }` Lambda 內部的 DSL 定義、新增至 `@ComponentScan` 套件的類別)，外掛程式的 `strictSafety` 選項會在聚合器模組上自動啟用，以強制在每次建置時重新執行全圖譜安全性檢查。詳細資訊請參閱 [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety)。
:::

### 多模組專案中的編譯安全性誤報

如果外掛程式回報了實際上存在於程式庫模組中的缺失相依性，請確保：

1. **程式庫模組也套用了 Koin 編譯器外掛程式** — 它會產生供下游模組讀取的提示函式
2. **程式庫在取用模組之前完成建置** — Gradle 通常透過 `implementation(project(":lib"))` 處理此問題，但仍請檢查您的任務相依性
3. **在首次將外掛程式新增至程式庫模組後執行一次乾淨建置**

## 遷移

### 從傳統 DSL 遷移

1. 新增編譯器外掛程式
2. 將匯入更新為 `org.koin.plugin.module.dsl.*`
3. 將 `single { Class(get() ...) }` 或 `singleOf(::Class)` 替換為 `single<Class>()`

編譯時期安全語法請參考上方的 [DSL 風格](#dsl-風格)。

### 從 KSP 處理器 (koin-ksp-compiler) 遷移

1. 移除 KSP 外掛程式與 `koin-ksp-compiler` 相依性
2. 新增 Koin 編譯器外掛程式
3. 將 `startKoin { modules(...) }` 更新為 `startKoin<MyApp>()`
4. **您的註解保持不變！** `koin-annotations` 程式庫仍保留 — 僅處理器發生變更。

完整指南請參閱 **[從 KSP 遷移至編譯器外掛程式](/docs/migration/from-ksp-to-compiler-plugin)**。

## 下一步

- **[DSL 參考](/docs/reference/dsl-reference)** — 完整的 DSL 文件
- **[註解參考](/docs/reference/annotations-reference)** — 完整的註解文件
- **[啟動 Koin](/docs/reference/koin-core/starting-koin)** — 配置您的應用程式