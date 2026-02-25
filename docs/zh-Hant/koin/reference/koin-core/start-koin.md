---
title: 開始使用 Koin
---

Koin 是一個 DSL、輕量級容器，也是一個實用的 API。一旦您在 Koin 模組中宣告了您的定義，就可以準備啟動 Koin 容器了。

### startKoin 函式

`startKoin` 函式是啟動 Koin 容器的主要入口點。它需要一個要執行的 *Koin 模組列表*。
模組被載入後，其定義便已準備好由 Koin 容器解析。

.啟動 Koin
```kotlin
// 在 Global context 中啟動 KoinApplication
startKoin {
    // 宣告使用的模組
    modules(coffeeAppModule)
}
```

一旦呼叫了 `startKoin`，Koin 將讀取您所有的模組與定義。接著 Koin 就可以透過任何 `get()` 或 `by inject()` 呼叫來擷取所需的執行個體。

您的 Koin 容器可以有多個選項：

* `logger` - 用於啟用記錄 - 請參閱 [記錄](#logging) 章節
* `properties()`、`fileProperties()` 或 `environmentProperties()` 用於從環境、koin.properties 檔案、額外屬性等載入屬性 - 請參閱 [載入屬性](#loading-properties) 章節

:::info
 `startKoin` 不能被呼叫超過一次。如果您需要在多個位置載入模組，請使用 `loadKoinModules` 函式。
:::

### 擴充您的 Koin 啟動（協助 KMP 等項目的重用...）

Koin 現在支援可重用且可擴充的 `KoinConfiguration` 設定物件。您可以提取共用設定以供跨平台（Android、iOS、JVM 等）使用，或針對不同環境進行調整。這可以透過 `includes()` 函式完成。下面我們可以輕鬆地重用通用設定，並將其擴充以加入一些 Android 環境設定：

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) // 可以包含外部設定擴充
        modules(appModule)
   }
}

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}
```

### 啟動背後的原理 — 深入了解 Koin 執行個體

當我們啟動 Koin 時，會建立一個代表 Koin 容器設定執行個體的 `KoinApplication` 執行個體。啟動後，它會根據您的模組和選項產生一個 `Koin` 執行個體。
接著，此 `Koin` 執行個體由 `GlobalContext` 持有，供任何 `KoinComponent` 類別使用。

`GlobalContext` 是 Koin 的預設 JVM 上下文策略。它由 `startKoin` 呼叫並註冊到 `GlobalContext`。從 Koin Multiplatform 的角度來看，這將允許我們註冊不同類型的上下文。

### 在 startKoin 之後載入模組

您不能呼叫 `startKoin` 函式超過一次。但您可以直接使用 `loadKoinModules()` 函式。

這個函式對於想要使用 Koin 的 SDK 開發者很有用，因為他們不需要使用 `startKoin()` 函式，只需在程式庫啟動時使用 `loadKoinModules` 即可。

```kotlin
loadKoinModules(module1,module2 ...)
```

### 卸載模組

也可以卸載一組定義，然後使用指定的函式釋放它們的執行個體：

```kotlin
unloadKoinModules(module1,module2 ...)
```

### 停止 Koin — 關閉所有資源

您可以關閉所有 Koin 資源並捨棄執行個體與定義。為此，您可以從任何地方使用 `stopKoin()` 函式來停止 Koin 的 `GlobalContext`。
或者在 `KoinApplication` 執行個體上直接呼叫 `close()`。

## 記錄 (Logging)

Koin 有一個簡單的記錄 API，用於記錄任何 Koin 活動（分配、查詢...）。記錄 API 由下列類別表示：

Koin Logger

```kotlin
abstract class Logger(var level: Level = Level.INFO) {

    abstract fun display(level: Level, msg: MESSAGE)

    fun debug(msg: MESSAGE) {
        log(Level.DEBUG, msg)
    }

    fun info(msg: MESSAGE) {
        log(Level.INFO, msg)
    }

    fun warn(msg: MESSAGE) {
        log(Level.WARNING, msg)
    }

    fun error(msg: MESSAGE) {
        log(Level.ERROR, msg)
    }
}
```

Koin 根據目標平台提供了一些記錄實作：

* `PrintLogger` - 直接記錄到主控台（包含在 `koin-core` 中）
* `EmptyLogger` - 不記錄任何內容（包含在 `koin-core` 中）
* `SLF4JLogger` - 使用 SLF4J 記錄。由 ktor 和 spark 使用 (`koin-logger-slf4j` 專案)
* `AndroidLogger` - 記錄到 Android Logger（包含在 `koin-android` 中）

### 啟動時設定記錄

預設情況下，Koin 使用 `EmptyLogger`。您可以依照下列方式直接使用 `PrintLogger`：

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## 載入屬性

您可以在啟動時載入多種類型的屬性：

* 環境屬性 - 載入 *系統* 屬性
* koin.properties 檔案 - 從 `/src/main/resources/koin.properties` 檔案載入屬性
* 「額外」啟動屬性 - 傳遞給 `startKoin` 函式的值映射 (map)

### 從模組讀取屬性

請確保在 Koin 啟動時載入屬性：

```kotlin
startKoin {
    // 從預設位置載入屬性
    // (即 `/src/main/resources/koin.properties`)
    fileProperties()
}
```

在 Koin 模組中，您可以透過鍵 (key) 獲取屬性：

在 /src/main/resources/koin.properties 檔案中
```java
// 鍵 - 值
server_url=http://service_url
```

只需使用 `getProperty` 函式載入它：

```kotlin
val myModule = module {

    // 使用 "server_url" 鍵來擷取其值
    single { MyService(getProperty("server_url")) }
}
```

## Koin 選項 - 功能旗標 (4.1.0)

您的 Koin 應用程式現在可以透過專用的 `options` 區塊啟用某些實驗性功能，例如：

```kotlin
startKoin {
    options(
        // 啟用 ViewModel Scope factory 功能 
        viewModelScopeFactory()
    )
}