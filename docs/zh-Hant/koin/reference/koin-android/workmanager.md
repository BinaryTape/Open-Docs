---
title: WorkManager
---

Koin 與 [Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager) 整合，以在 Worker 中實現建構函式注入。

## 設定

### 新增相依性

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
implementation "io.insert-koin:koin-androidx-workmanager:$koin_version"
```

### 設定 WorkManager

在您的 Application 中設定 Koin WorkManager 工廠：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MainApplication)
            workManagerFactory()
            modules(appModule)
        }
    }
}
```

### 停用預設初始設定式

將以下內容新增至您的 `AndroidManifest.xml` 以停用預設的 WorkManager 初始設定式：

```xml
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
```

## 宣告 Worker

### 編譯器外掛程式 DSL

```kotlin
class MyWorker(
    context: Context,
    workerParams: WorkerParameters,
    private val myService: MyService
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        myService.performTask()
        return Result.success()
    }
}

val appModule = module {
    single<MyService>()
    worker<MyWorker>()
}
```

### 註解

```kotlin
@KoinWorker
class MyWorker(
    context: Context,
    workerParams: WorkerParameters,
    private val myService: MyService
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        myService.performTask()
        return Result.success()
    }
}

@Singleton
class MyService
```

### 傳統 DSL

```kotlin
val appModule = module {
    single { MyService() }
    worker { params ->
        MyWorker(
            context = params.get(),
            workerParams = params.get(),
            myService = get()
        )
    }
}
```

## 將工作加入佇列

使用一般的 WorkManager 將您的 Worker 加入佇列：

```kotlin
val workRequest = OneTimeWorkRequestBuilder<MyWorker>().build()
WorkManager.getInstance(context).enqueue(workRequest)
```

## 帶有參數的 Worker

透過 WorkManager 的輸入資料傳遞參數：

```kotlin
@KoinWorker
class SyncWorker(
    context: Context,
    workerParams: WorkerParameters,
    private val repository: DataRepository
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val userId = inputData.getString("USER_ID") ?: return Result.failure()
        repository.syncUser(userId)
        return Result.success()
    }
}
```

將資料加入佇列：

```kotlin
val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setInputData(workDataOf("USER_ID" to "123"))
    .build()

WorkManager.getInstance(context).enqueue(workRequest)
```

## 快速參考

| 方法 | 宣告 |
|----------|-------------|
| 編譯器外掛程式 DSL | `worker<MyWorker>()` |
| 註解 | `@KoinWorker` |
| 傳統 DSL | `worker { params -> MyWorker(params.get(), params.get(), get()) }` |

| 設定 | 程式碼 |
|-------|------|
| 啟用工廠 | startKoin 中的 `workManagerFactory()` |
| 停用預設 | 在 manifest 中移除 `WorkManagerInitializer` |

## 後續步驟

- **[Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)** - 官方 WorkManager 文件
- **[作用域](/docs/reference/koin-android/scope)** - Android 作用域
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入