---
title: WorkManager
---

Koin 与 [Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager) 集成，以在 Worker 中启用构造函数注入。

## 设置

### 添加依赖项

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
implementation "io.insert-koin:koin-androidx-workmanager:$koin_version"
```

### 配置 WorkManager

在您的 Application 中设置 Koin WorkManager 工厂：

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

### 禁用默认初始值设定项

将以下内容添加到您的 `AndroidManifest.xml` 以禁用默认的 WorkManager 初始值设定项：

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

## 声明 Worker

### 编译器插件 DSL

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

### 注解

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

### 经典 DSL

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

## 将工作入队

照常使用 WorkManager 将您的 Worker 入队：

```kotlin
val workRequest = OneTimeWorkRequestBuilder<MyWorker>().build()
WorkManager.getInstance(context).enqueue(workRequest)
```

## 带形参的 Worker

通过 WorkManager 的输入数据传递形参：

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

使用数据入队：

```kotlin
val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setInputData(workDataOf("USER_ID" to "123"))
    .build()

WorkManager.getInstance(context).enqueue(workRequest)
```

## 快速参考

| 方式 | 声明 |
|----------|-------------|
| 编译器插件 DSL | `worker<MyWorker>()` |
| 注解 | `@KoinWorker` |
| 经典 DSL | `worker { params -> MyWorker(params.get(), params.get(), get()) }` |

| 设置 | 代码 |
|-------|------|
| 启用工厂 | `startKoin` 中的 `workManagerFactory()` |
| 禁用默认 | 在清单文件中移除 `WorkManagerInitializer` |

## 后续步骤

- **[Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)** - WorkManager 官方文档
- **[作用域 (Scopes)](/docs/reference/koin-android/scope)** - Android 作用域
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入