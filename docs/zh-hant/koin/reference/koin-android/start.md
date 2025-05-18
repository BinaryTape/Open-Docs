---
title: "在 Android 上啟動 Koin"
---
`koin-android` 專案致力於將 Koin 的能力提供給 Android 世界。詳情請參閱 [Android 設定](/setup/koin.md) 章節。

## 從你的 Application 類別

從你的 `Application` 類別中，你可以使用 `startKoin` 函式並使用 `androidContext` 注入 Android 上下文，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Log Koin into Android logger
            androidLogger()
            // Reference Android context
            androidContext(this@MainApplication)
            // Load modules
            modules(myAppModules)
        }
    }
}
```

:::info
如果你不想從你的 Application 類別啟動 Koin，你也可以從任何地方啟動 Koin。
:::

如果你需要從另一個 Android 類別啟動 Koin，你可以使用 `startKoin` 函式並提供你的 Android `Context` 實例，如下所示：

```kotlin
startKoin {
    //inject Android context
    androidContext(/* your android context */)
    // ...
}
```

## 額外配置 (Extra Configurations)

從你的 Koin 配置（在 `startKoin { }` 程式碼區塊中），你還可以配置 Koin 的幾個部分。

### Koin Logging for Android

在你的 `KoinApplication` 實例中，我們有一個擴展 `androidLogger`，它使用 `AndroidLogger()` 類別。這個 logger (日誌記錄器) 是 Koin logger (日誌記錄器) 的 Android 實現。

你可以根據需要更改此 logger (日誌記錄器)，如果它不符合你的需求。

```kotlin
startKoin {
    // use Android logger - Level.INFO by default
    androidLogger()
    // ...
}
```

### 載入 Properties (屬性)

你可以在 `assets/koin.properties` 檔案中使用 Koin 屬性 (properties)，來儲存鍵/值：

```kotlin
startKoin {
    // ...
    // use properties from assets/koin.properties
    androidFileProperties()   
}
```

## 使用 Androidx Startup 啟動 Koin (4.0.1) [實驗性]

透過使用 Gradle 套件 `koin-androidx-startup`，我們可以使用 `KoinStartup` 介面來宣告你的 Koin 配置 Application 類別：

```kotlin
class MainApplication : Application(), KoinStartup {

     override fun onKoinStartup() = koinConfiguration {
        androidContext(this@MainApplication)
        modules(appModule)
    }

    override fun onCreate() {
        super.onCreate()
    }
}
```

這取代了通常在 `onCreate` 中使用的 `startKoin` 函式。 `koinConfiguration` 函式返回一個 `KoinConfiguration` 實例。

:::info
`KoinStartup` 避免在啟動時阻塞主線程，並提供更好的效能。
:::

## 透過 Koin 的啟動依賴 (Startup Dependency)

如果需要設定 Koin，並允許注入依賴，你可以讓你的 `Initializer` 依賴於 `KoinInitializer`：

```kotlin
class CrashTrackerInitializer : Initializer<Unit>, KoinComponent {

    private val crashTrackerService: CrashTrackerService by inject()

    override fun create(context: Context) {
        crashTrackerService.configure(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return listOf(KoinInitializer::class.java)
    }

}
```