---
title: 啟動 Koin
---

# 啟動 Koin

本指南涵蓋如何初始化 Koin 容器並為您的應用程式進行配置。

## `startKoin` 函式

`startKoin` 是啟動 Koin 的主要進入點。它將容器註冊到 `GlobalContext` 中，使其在整個應用程式中皆可存取。

```kotlin
startKoin {
    modules(appModule)
}
```

啟動後，即可透過 `get()` 或 `by inject()` 解析相依性。

### 配置選項

```kotlin
startKoin {
    // 記錄
    logger(Level.INFO)

    // 屬性
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))

    // 模組
    modules(
        coreModule,
        networkModule,
        dataModule
    )

    // 延遲模組（背景載入）
    lazyModules(analyticsModule, reportingModule)

    // 建立積極單例 (eager singletons)
    createEagerInstances()

    // 覆寫控制
    allowOverride(false)
}
```

| 選項 | 說明 |
|--------|-------------|
| `logger()` | 設定記錄層級與實作 |
| `modules()` | 立即載入模組 |
| `lazyModules()` | 在背景載入模組 |
| `properties()` | 從 map 載入屬性 |
| `fileProperties()` | 從 koin.properties 檔案載入 |
| `environmentProperties()` | 從系統/環境載入 |
| `createEagerInstances()` | 建立所有 `createdAtStart` 的單例 |
| `allowOverride()` | 啟用/停用定義覆寫 |

:::info
`startKoin` 只能呼叫 **一次**。若稍後要載入額外的模組，請使用 `loadKoinModules()`。
:::

## 啟動 Koin 容器

| 方法 | 使用案例 |
|--------|----------|
| `startKoin { }` | 標準應用程式 - 註冊於 GlobalContext |
| `koinApplication { }` | 測試、SDK、隔離的上下文 - 本機執行個體 |
| `koinConfiguration { }` | 專用 API (Compose, Ktor) 的配置持有者 |

:::tip
搭配 **Koin Compiler Plugin**，可以使用型別化變體：`startKoin<T>()`、`koinApplication<T>()`、`koinConfiguration<T>()`。請參閱下方的 [搭配編譯器外掛程式啟動 Koin](#starting-koin-with-compiler-plugin)。
:::

### `startKoin` - 全域執行個體

最常見的方法 - 全域啟動 Koin：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    // 隨處使用
    val service: MyService = get()
}
```

### `koinApplication` - 隔離的執行個體

建立一個隔離的 Koin 執行個體（不在 GlobalContext 中）：

```kotlin
val myKoin = koinApplication {
    modules(myModule)
}.koin

// 使用隔離的執行個體
val service: MyService = myKoin.get()
```

**使用案例：**
- 使用隔離上下文進行測試
- SDK 開發（避免污染主應用程式）
- 多個 Koin 執行個體

### `koinConfiguration` - 配置持有者

建立供專用 API 使用的配置（如 Compose `KoinApplication`、Ktor 外掛程式）：

```kotlin
val config = koinConfiguration {
    modules(appModule)
}

// 由 Compose KoinApplication、Ktor 等使用
```

## 搭配編譯器外掛程式啟動 Koin

搭配註解使用 **Koin Compiler Plugin** 時，您可以使用 **型別化 API** 啟動 Koin - 不需要產生的程式碼。

:::info
這需要 [Koin Compiler Plugin](/docs/setup/compiler-plugin)。您的應用程式類別必須標記 `@KoinApplication` 註解。
:::

### 定義您的應用程式

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp")
class MyModule

@KoinApplication
class MyApp
```

### 型別化啟動 API

| API | 說明 |
|-----|-------------|
| `startKoin<T>()` | 以應用程式 T 全域啟動 Koin |
| `startKoin<T> { }` | 以應用程式 T 及額外配置啟動 |
| `koinApplication<T>()` | 以 T 建立隔離的 KoinApplication |
| `koinConfiguration<T>()` | 從 T 建立 KoinConfiguration (供 Compose, Ktor 使用) |

其中 `T` 是標記有 `@KoinApplication` 的類別。

### 範例

```kotlin
// 簡單啟動
startKoin<MyApp>()

// 搭配額外配置
startKoin<MyApp> {
    printLogger()
}

// 隔離的執行個體
val myKoin = koinApplication<MyApp>().koin

// Compose/Ktor 的配置
val config = koinConfiguration<MyApp>()
```

### 多模組專案

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@Configuration
@ComponentScan("com.myapp.feature")
class FeatureModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

// 啟動 Koin
startKoin<MyApp>()
```

## 平台整合

### Android

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

**搭配編譯器外掛程式：**

```kotlin
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApp> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

### Compose

使用 `KoinApplication` 可組合項與 `koinConfiguration`：

```kotlin
@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration { modules(appModule) }
    ) {
        MainScreen()
    }
}
```

**搭配編譯器外掛程式：**

```kotlin
@KoinApplication
class MyApp

@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration<MyApp>()
    ) {
        MainScreen()
    }
}
```

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

**搭配編譯器外掛程式：**

```kotlin
@KoinApplication
class MyApp

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        withConfiguration<MyApp>()
    }
}
```

:::info
詳情請參閱 [Ktor 整合](/docs/reference/koin-ktor/ktor)。
:::

### Kotlin Multiplatform

跨平台共享配置：

```kotlin
// commonMain
fun initKoin(config: KoinAppDeclaration? = null) {
    startKoin {
        config?.invoke(this)
        modules(sharedModule)
    }
}

// androidMain
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}

// iosMain
fun initKoinIos() = initKoin()
```

## 動態模組管理

### 啟動後載入模組

```kotlin
// 初始啟動
startKoin {
    modules(coreModule)
}

// 稍後載入額外模組
loadKoinModules(featureModule)
```

### 卸載模組

```kotlin
unloadKoinModules(featureModule)
```

### 功能切換 (Feature Toggle) 範例

```kotlin
if (isFeatureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 稍後若停用
unloadKoinModules(premiumFeatureModule)
```

## 停止 Koin

關閉容器並釋放資源：

```kotlin
stopKoin()
```

對於隔離的執行個體：

```kotlin
val koinApp = koinApplication { modules(myModule) }
koinApp.close()
```

## 記錄

### 啟用記錄

```kotlin
startKoin {
    logger(Level.INFO)  // 或 DEBUG, WARNING, ERROR, NONE
}
```

### 可用的 Logger

| Logger | 平台 | 說明 |
|--------|----------|-------------|
| `EmptyLogger` | 所有 | 無記錄（預設） |
| `PrintLogger` | 所有 | 主控台輸出 |
| `AndroidLogger` | Android | Android Logcat |
| `SLF4JLogger` | JVM | SLF4J 整合 |

### 平台專用 Logger

```kotlin
// Android
startKoin {
    androidLogger(Level.DEBUG)
}

// Ktor
install(Koin) {
    slf4jLogger()
}
```

## 屬性

### 載入屬性

```kotlin
startKoin {
    // 從環境
    environmentProperties()

    // 從檔案 (koin.properties)
    fileProperties()

    // 從程式碼
    properties(mapOf(
        "server_url" to "https://api.example.com",
        "api_key" to "secret123"
    ))
}
```

### 使用屬性

```kotlin
val appModule = module {
    single {
        ApiClient(
            url = getProperty("server_url"),
            key = getProperty("api_key", "default")
        )
    }
}
```

## 最佳實務

1. **呼叫 `startKoin` 一次** - 在應用程式進入點
2. **立即載入關鍵模組** - 使用 `modules()`
3. **使用延遲模組** - 透過 `lazyModules()` 延遲非關鍵模組
4. **在開發環境中啟用記錄** - `logger(Level.DEBUG)`
5. **在生產環境中使用嚴格模式** - `allowOverride(false)`
6. **在測試之間停止 Koin** - 呼叫 `stopKoin()` 以重設狀態

## 下一步

- **[模組](/docs/reference/koin-core/modules)** - 組織您的定義
- **[定義](/docs/reference/koin-core/definitions)** - 使用 DSL 或註解建立定義
- **[注入](/docs/reference/koin-core/injection)** - 取得相依性