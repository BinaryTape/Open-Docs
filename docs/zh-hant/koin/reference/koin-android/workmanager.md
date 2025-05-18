---
title: WorkManager
---
`koin-androidx-workmanager` 專案旨在引入 Android WorkManager 的功能。

## WorkManager DSL

## 設定 WorkManager

首先，在您的 KoinApplication 宣告中，使用 `workManagerFactory()` 關鍵字來設定自訂的 WorkManager 實例：

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

同樣重要的是，您需要編輯您的 AndroidManifest.xml，以防止 Android 初始化其預設的 WorkManagerFactory，如 https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 所示。 否則將導致應用程式崩潰。

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

### 建立額外的 work manager factories

您也可以編寫一個 WorkManagerFactory 並將其交給 Koin。 它將作為一個委託（delegate）被添加。

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

如果 Koin 和 workFactory1 提供的 WorkManagerFactory 都可以實例化一個 ListenableWorker，則將使用 Koin 提供的 factory。

## 一些假設

### 在 koin lib 本身中添加 manifest 更改
如果 koin-androidx-workmanager 自身的 manifest 禁用了預設的 work manager，我們可以為應用程式開發人員減少一個步驟。 但是，如果應用程式開發人員沒有初始化 koin 的 work manager 基礎結構，最終會沒有可用的 work manager factories，這可能會令人困惑。

這就是 checkModules 可以提供幫助的地方：如果專案中的任何類別實現了 ListenableWorker，我們會檢查 manifest 和程式碼，並確保它們有意義嗎？

### DSL 改善選項：
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

然後讓 koin 內部執行類似的操作

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
```