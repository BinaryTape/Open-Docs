---
title: 在 Android 上啟動 Koin
---

`koin-android` 專案致力於將 Koin 的強大功能帶入 Android 世界。如需更多詳細資訊，請參閱 [Android 設定](/docs/setup/koin#android) 章節。

## 從您的 Application 類別啟動

在您的 `Application` 類別中，您可以使用 `startKoin` 函式，並透過 `androidContext` 注入 Android context，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 將 Koin 記錄至 Android 記錄器
            androidLogger()
            // 參照 Android context
            androidContext(this@MainApplication)
            // 載入模組
            modules(myAppModules)
        }
    }
}
```

:::info
如果您不想在 Application 類別中啟動 Koin，也可以從任何地方啟動。
:::

如果您需要從另一個 Android 類別啟動 Koin，可以使用 `startKoin` 函式並提供您的 Android `Context` 執行個體，如下所示：

```kotlin
startKoin {
    // 注入 Android context
    androidContext(/* 您的 android context */)
    // ...
}
```

## 額外配置

在您的 Koin 配置中（在 `startKoin { }` 程式碼區塊內），您還可以配置 Koin 的多個部分。

### 適用於 Android 的 Koin 記錄功能

在您的 `KoinApplication` 執行個體中，我們提供了一個使用 `AndroidLogger()` 類別的擴充功能 `androidLogger`。此記錄器是 Koin 記錄器的 Android 實作。

如果該記錄器不符合您的需求，您可以自行更改。

```kotlin
startKoin {
    // 使用 Android 記錄器 - 預設為 Level.INFO
    androidLogger()
    // ...
}
```

### 載入屬性

您可以使用 `assets/koin.properties` 檔案中的 Koin 屬性來儲存鍵／值：

```kotlin
startKoin {
    // ...
    // 使用來自 assets/koin.properties 的屬性
    androidFileProperties()   
}
```

## 透過 Androidx Startup (4.0.1) 啟動 Koin [實驗性]

透過使用 Gradle 套件 `koin-androidx-startup`，我們可以使用 `KoinStartup` 介面在您的 Application 類別中宣告 Koin 配置：

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

這取代了通常在 `onCreate` 中使用的 `startKoin` 函式。`koinConfiguration` 函式會回傳一個 `KoinConfiguration` 執行個體。

:::info
`KoinStartup` 避免在啟動期間阻塞主執行緒，並提供更好的效能。
:::

## Koin 的啟動相依性

如果您需要設定 Koin 並允許注入相依性，可以讓您的 `Initializer` 依賴於 `KoinInitializer`：

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