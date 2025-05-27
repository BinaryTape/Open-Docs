---
title: WorkManager
---

`koin-androidx-workmanager` 项目旨在提供 Android WorkManager 相关功能。

## WorkManager DSL

## 设置 WorkManager

启动时，在你的 `KoinApplication` 声明中，使用 `workManagerFactory()` 关键字来设置自定义的 WorkManager 实例：

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

同样重要的是，你需要编辑你的 `AndroidManifest.xml` 文件，以防止 Android 初始化其默认的 WorkManagerFactory，如 https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 所示。否则将导致应用崩溃。

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

你也可以编写一个 `WorkManagerFactory` 并将其交给 Koin。它将被添加为委托。

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

如果 Koin 和 `workFactory1` 提供的 `WorkManagerFactory` 都能实例化一个 `ListenableWorker`，那么将使用 Koin 提供的工厂。

## 几点假设

### 在 Koin 库本身中添加清单更改
如果 `koin-androidx-workmanager` 自身的清单文件禁用了默认的 WorkManager，那么可以为应用开发者减少一个步骤。然而，这可能会令人困惑，因为如果应用开发者不初始化 Koin 的 WorkManager 基础设施，他们最终将没有可用的 WorkManager 工厂。

这方面 `checkModules` 可能会有所帮助：如果项目中任何类实现了 `ListenableWorker`，我们检查清单和代码，确保它们合理？

### DSL 改进选项：

```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

然后让 Koin 内部机制执行类似操作

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