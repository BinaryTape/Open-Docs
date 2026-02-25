---
title: WorkManager
---

`koin-androidx-workmanager` 專案致力於提供 Android WorkManager 功能。

## WorkManager DSL

## 設定 WorkManager

在開始時，在您的 `KoinApplication` 宣告中，使用 `workManagerFactory()` 關鍵字來設定自訂的 WorkManager 執行個體：

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 設定一個 WorkManager 執行個體
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

同樣重要的是，您必須編輯 `AndroidManifest.xml` 以防止 Android 初始化其預設的 `WorkManagerFactory`，如 https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 所示。若未執行此操作，將導致應用程式崩潰。

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

### 建立額外的 WorkManager 工廠

您也可以編寫 `WorkManagerFactory` 並將其交給 Koin。它將作為委派被加入。

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

如果 Koin 和 `workFactory1` 提供的 `WorkManagerFactory` 都能具現化 `ListenableWorker`，則將優先使用 Koin 提供的工廠。

## 幾點假設

### 在 Koin 程式庫本身加入 manifest 變更
如果 `koin-androidx-workmanager` 自己的 manifest 停用了預設的 WorkManager，我們可以為應用程式開發人員減少一個步驟。然而，這可能會造成混淆，因為如果應用程式開發人員沒有初始化 Koin 的 WorkManager 基礎結構，最終將沒有可用的 WorkManager 工廠。

這是 `checkModules` 可以提供協助的地方：如果專案中的任何類別實作了 `ListenableWorker`，我們是否應該檢查 manifest 和程式碼並確保它們合理？

### DSL 改進選項：
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

然後讓 Koin 內部執行如下操作：

```kotlin
fun Application.setupWorkManagerFactory(
  // 對於 WorkerFactory 不使用可變參數
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}