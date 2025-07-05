---
title: 啟動 Koin
---

Koin 是一個 DSL、一個輕量級容器和一個實用型 API。一旦您在 Koin 模組中宣告了您的定義，您就可以準備啟動 Koin 容器了。

### `startKoin` 函數

`startKoin` 函數是啟動 Koin 容器的主要進入點。它需要一個 *Koin 模組清單* 才能執行。
模組載入後，定義即可由 Koin 容器解析。

.啟動 Koin
```kotlin
// start a KoinApplication in Global context
startKoin {
    // declare used modules
    modules(coffeeAppModule)
}
```

一旦呼叫 `startKoin`，Koin 將讀取您的所有模組與定義。Koin 隨後就可以處理任何 `get()` 或 `by inject()` 呼叫以檢索所需的實例。

您的 Koin 容器可以有數個選項：

*   `logger` - 啟用日誌記錄 - 請參閱 [日誌記錄](#logging) 區塊
*   `properties()`、`fileProperties()` 或 `environmentProperties()` 載入來自環境、koin.properties 檔案、額外屬性等的屬性 ... - 請參閱 [載入屬性](#loading-properties) 區塊

:::info
`startKoin` 無法呼叫超過一次。如果您需要從多個位置載入模組，請使用 `loadKoinModules` 函數。
:::

### 擴展您的 Koin 啟動（有助於 KMP 及其他重複利用...）

Koin 現在支援 KoinConfiguration 的可重複使用和可擴展配置物件。您可以提取共享配置，以便跨平台（Android、iOS、JVM 等）使用或根據不同環境進行調整。這可以透過 `includes()` 函數完成。下面，我們可以輕鬆地重複使用一個通用配置，並將其擴展以添加一些 Android 環境設定：

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) //can include external configuration extension
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

### 啟動背後 - Koin 實例的內部運作

當我們啟動 Koin 時，我們會建立一個 `KoinApplication` 實例，它代表 Koin 容器的配置實例。一旦啟動，它將根據您的模組和選項產生一個 `Koin` 實例。
這個 `Koin` 實例隨後由 `GlobalContext` 持有，以便供任何 `KoinComponent` 類別使用。

`GlobalContext` 是 Koin 的預設 JVM 上下文策略。它由 `startKoin` 呼叫並註冊到 `GlobalContext`。這將使我們能夠從 Koin 多平台的角度註冊不同類型的上下文。

### 在 `startKoin` 之後載入模組

您無法呼叫 `startKoin` 函數超過一次。但您可以直接使用 `loadKoinModules()` 函數。

這個函數對於想要使用 Koin 的 SDK 開發者來說很有趣，因為他們不需要使用 `startKoin()` 函數，只需在其函式庫啟動時使用 `loadKoinModules` 即可。

```kotlin
loadKoinModules(module1,module2 ...)
```

### 卸載模組

也可以卸載一批定義，然後使用指定的函數釋放它們的實例：

```kotlin
unloadKoinModules(module1,module2 ...)
```

### 停止 Koin - 關閉所有資源

您可以關閉所有 Koin 資源並捨棄實例與定義。為此，您可以從任何地方使用 `stopKoin()` 函數來停止 Koin `GlobalContext`。
否則在 `KoinApplication` 實例上，只需呼叫 `close()`。

## 日誌記錄

Koin 具有一個簡單的日誌記錄 API，用於記錄任何 Koin 活動（分配、查詢等）。日誌記錄 API 由以下類別表示：

.Koin 日誌記錄器
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

Koin 根據目標平台提供了一些日誌記錄的實作：

*   `PrintLogger` - 直接日誌記錄到控制台（包含在 `koin-core` 中）
*   `EmptyLogger` - 不記錄任何內容（包含在 `koin-core` 中）
*   `SLF4JLogger` - 使用 SLF4J 記錄。由 Ktor 和 Spark 使用（`koin-logger-slf4j` 專案）
*   `AndroidLogger` - 日誌記錄到 Android 日誌記錄器（包含在 `koin-android` 中）

### 在啟動時設定日誌記錄

預設情況下，Koin 使用 `EmptyLogger`。您可以直接使用 `PrintLogger` 如下所示：

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## 載入屬性

您可以在啟動時載入數種屬性：

*   環境屬性 - 載入 *系統* 屬性
*   koin.properties 檔案 - 從 `/src/main/resources/koin.properties` 檔案載入屬性
*   「額外」啟動屬性 - 傳遞給 `startKoin` 函數的值對映

### 從模組讀取屬性

確保在 Koin 啟動時載入屬性：

```kotlin
startKoin {
    // Load properties from the default location
    // (i.e. `/src/main/resources/koin.properties`)
    fileProperties()
}
```

在 Koin 模組中，您可以透過其鍵獲取屬性：

.在 /src/main/resources/koin.properties 檔案中
```java
// Key - value
server_url=http://service_url
```

只需使用 `getProperty` 函數載入它：

```kotlin
val myModule = module {

    // use the "server_url" key to retrieve its value
    single { MyService(getProperty("server_url")) }
}
```

## Koin 選項 - 功能旗標 (4.1.0)

您的 Koin 應用程式現在可以透過專用的 `options` 區塊啟用一些實驗性功能，例如：

```kotlin
startKoin {
    options(
        // activate ViewModel Scope factory feature
        viewModelScopeFactory()
    )
}
```