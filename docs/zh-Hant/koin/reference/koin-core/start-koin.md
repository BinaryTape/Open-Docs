---
title: 啟動 Koin 參考
---

啟動 Koin 的快速參考。如需詳細指南，請參閱 **[核心 - 啟動 Koin](/docs/reference/koin-core/starting-koin)**。

## 啟動方法

| 方法 | 使用案例 |
|--------|----------|
| `startKoin { }` | 標準應用程式 - 註冊於 GlobalContext |
| `koinApplication { }` | 測試、SDK — 隔離的執行個體 |
| `koinConfiguration { }` | 用於 Compose、Ktor 的配置 |
| `startKoin<T>()` | 使用編譯器外掛程式的強型別啟動 |

## 基本啟動

```kotlin
startKoin {
    modules(appModule)
}
```

## 完整配置

```kotlin
startKoin {
    logger(Level.INFO)
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))
    modules(coreModule, networkModule)
    lazyModules(analyticsModule)
    createEagerInstances()
    allowOverride(false)
}
```

## 配置選項

| 選項 | 說明 |
|--------|-------------|
| `logger()` | 設定記錄層級與實作 |
| `modules()` | 立即載入模組 |
| `lazyModules()` | 在背景載入模組 |
| `properties()` | 從映射 (map) 載入屬性 |
| `fileProperties()` | 從 koin.properties 檔案載入 |
| `environmentProperties()` | 從系統/環境載入 |
| `createEagerInstances()` | 建立所有 `createdAtStart` 單例執行個體 |
| `allowOverride()` | 啟用/停用定義覆寫 |

## 強型別啟動（編譯器外掛程式）

需要 [Koin 編譯器外掛程式](/docs/setup/compiler-plugin) 與 `@KoinApplication`：

```kotlin
@KoinApplication
class MyApp

// 啟動
startKoin<MyApp>()

// 包含配置
startKoin<MyApp> {
    printLogger()
}
```

## 動態模組管理

```kotlin
// 啟動後載入
loadKoinModules(featureModule)

// 卸載
unloadKoinModules(featureModule)
```

## 停止 Koin

```kotlin
stopKoin()  // 全域執行個體

// 隔離的執行個體
koinApp.close()
```

## 記錄

| Logger | 平台 | 說明 |
|--------|----------|-------------|
| `EmptyLogger` | 所有 | 不記錄（預設） |
| `PrintLogger` | 所有 | 主控台輸出 |
| `AndroidLogger` | Android | Logcat |
| `SLF4JLogger` | JVM | SLF4J |

```kotlin
startKoin {
    logger(Level.DEBUG)  // 或在 Android 使用 androidLogger()
}
```

## 屬性

```kotlin
startKoin {
    environmentProperties()
    fileProperties()  // koin.properties
    properties(mapOf("key" to "value"))
}

// 在模組中
single {
    ApiClient(url = getProperty("server_url"))
}
```

## 平台範例

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

### Compose

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

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 另請參閱

- **[核心 - 啟動 Koin](/docs/reference/koin-core/starting-koin)** - 完整指南
- **[延遲模組](/docs/reference/koin-core/lazy-modules)** - 背景載入
- **[KoinComponent](/docs/reference/koin-core/koin-component)** - 擷取執行個體