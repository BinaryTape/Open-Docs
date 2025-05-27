---
title: WorkManager
---

`koin-androidx-workmanager` 專案旨在提供 Android WorkManager 的功能。

## WorkManager DSL

## 設定 WorkManager

在應用程式啟動時，於您的 KoinApplication 宣告中，使用 `workManagerFactory()` 關鍵字來設定一個自訂的 WorkManager 實例：

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // setup a WorkManager instance
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

同樣重要的是，您需要編輯您的 AndroidManifest.xml 以防止 Android 初始化其預設的 WorkManagerFactory，如 https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 所示。若未能如此操作，應用程式將會崩潰。

```xml
    <application . . .>
        . . .
        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="${applicationId}.androidx-startup"
            android:exported="false"
            tools:node="merge">
            <meta-data
                android:name="androidx.work.WorkManagerInitializer"
                android:value="androidx.startup"
                tools:node="remove" />
        </provider>
    </application>
```

## 宣告 ListenableWorker

```kotlin
val appModule = module {
    single { MyService() }
    worker { MyListenableWorker(get()) }
}
```

### 建立額外的 WorkManager Factory

您也可以撰寫一個 WorkManagerFactory 並將其交給 Koin。它將被添加為一個委派者。

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
           workManagerFactory(workFactory1, workFactory2)
           . . .
        }

        setupWorkManagerFactory()
    }
}

```

如果 Koin 和 `workFactory1` 所提供的 WorkManagerFactory 都能實例化一個 `ListenableWorker`，則將會使用由 Koin 提供的 factory。

## 一些假設

### 在 Koin 函式庫本身添加 manifest 變更
如果 `koin-androidx-workmanager` 自己的 manifest 禁用了預設的 WorkManager，那麼應用程式開發人員就可以少一個步驟。然而，這可能會造成混淆，因為如果應用程式開發人員沒有初始化 Koin 的 WorkManager 基礎設施，他最終會沒有可用的 WorkManager factories。

這可以透過 `checkModules` 來幫助解決：如果專案中的任何類別實作了 `ListenableWorker`，我們就會檢查 manifest 和程式碼，並確保它們是合理的？

### DSL 改善選項：
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

然後讓 Koin 內部執行類似於以下的操作：

```kotlin
fun Application.setupWorkManagerFactory(
  // no vararg for WorkerFactory
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}