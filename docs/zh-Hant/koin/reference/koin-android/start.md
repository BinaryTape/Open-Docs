---
title: 在 Android 上啟動 Koin
---

`koin-android` 專案致力於為 Android 世界提供 Koin 的能力。請參閱 [Android 設定](/docs/setup/koin#android) 章節以了解更多詳情。

## 從您的 Application 類別開始

在您的 `Application` 類別中，您可以使用 `startKoin` 函式，並透過 `androidContext` 注入 Android context，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 將 Koin 記錄到 Android 記錄器
            androidLogger()
            // 參考 Android context
            androidContext(this@MainApplication)
            // 載入模組
            modules(myAppModules)
        }
    }
}
```

:::info
如果您不想從您的 Application 類別啟動 Koin，您也可以從任何地方啟動它。
:::

如果您需要從另一個 Android 類別啟動 Koin，您可以使用 `startKoin` 函式並提供您的 Android `Context` 實例，就像：

```kotlin
startKoin {
    // 注入 Android context
    androidContext(/* 您的 Android context */)
    // ...
}
```

## 額外配置

在您的 Koin 配置中（在 `startKoin { }` 程式碼區塊內），您還可以配置 Koin 的多個部分。

### Android 的 Koin 記錄

在您的 `KoinApplication` 實例中，我們有一個擴充函式 `androidLogger`，它使用 `AndroidLogger()` 類別。這個記錄器是 Koin 記錄器的 Android 實作。

如果您覺得它不符合您的需求，您可以自行更改此記錄器。

```kotlin
startKoin {
    // 使用 Android 記錄器 - 預設為 Level.INFO
    androidLogger()
    // ...
}
```

### 載入屬性

您可以在 `assets/koin.properties` 檔案中使用 Koin 屬性，以儲存鍵/值：

```kotlin
startKoin {
    // ...
    // 使用 assets/koin.properties 中的屬性
    androidFileProperties()   
}
```

## 使用 Androidx Startup 啟動 Koin (4.0.1) [實驗性]

透過使用 Gradle 套件 `koin-androidx-startup`，我們可以使用 `KoinStartup` 介面在您的 Application 類別中宣告您的 Koin 配置：

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

這取代了通常在 `onCreate` 中使用的 `startKoin` 函式。`koinConfiguration` 函式回傳一個 `KoinConfiguration` 實例。

:::info
`KoinStartup` 避免在啟動時阻塞主執行緒，並提供更好的效能。
:::

## 具有 Koin 的啟動依賴

如果您需要 Koin 被設定好並允許注入依賴，您可以讓您的 `Initializer` 依賴於 `KoinInitializer`：

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