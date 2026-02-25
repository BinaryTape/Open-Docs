---
title: WorkManager
---

`koin-androidx-workmanager` 项目致力于提供 Android WorkManager 功能。

## WorkManager DSL

## 设置 WorkManager

在启动时，在你的 `KoinApplication` 声明中，使用 `workManagerFactory()` 关键字来设置自定义 WorkManager 实例：

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 设置一个 WorkManager 实例
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

同样重要的是，你需要编辑 `AndroidManifest.xml` 以防止 Android 初始化其默认的 `WorkManagerFactory`，如 https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 所示。如果不这样做，将导致应用崩溃。

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

## 声明 ListenableWorker

```kotlin
val appModule = module {
    single { MyService() }
    worker { MyListenableWorker(get()) }
}
```

### 创建额外的 WorkManager 工厂

你也可以编写一个 `WorkManagerFactory` 并将其交给 Koin。它将作为委托 (delegate) 被添加。

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

如果 Koin 和 `workFactory1` 提供的 `WorkManagerFactory` 都能实例化 `ListenableWorker`，则将使用由 Koin 提供的工厂。

## 一些假设

### 在 Koin 库本身中添加清单文件更改
如果 `koin-androidx-workmanager` 自己的清单文件禁用了默认的 WorkManager，我们可以为应用开发者减少一个步骤。但是，这可能会引起混淆，因为如果应用开发者没有初始化 Koin 的 WorkManager 基础架构，他们最终将没有可用的 WorkManager 工厂。

这是 `checkModules` 可以提供帮助的地方：如果项目中的任何类实现了 `ListenableWorker`，我们就检查清单文件和代码，并确保它们是有意义的？

### DSL 改进选项：
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

然后让 Koin 内部执行类似以下的操作：

```kotlin
fun Application.setupWorkManagerFactory(
  // WorkerFactory 不使用可变参数
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}