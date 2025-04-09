---
title: WorkManager
---
`koin-androidx-workmanager` プロジェクトは、Android WorkManager の機能を提供することに特化しています。

## WorkManager DSL

## WorkManager のセットアップ

まず、KoinApplication の宣言で、`workManagerFactory()` キーワードを使用してカスタム WorkManager インスタンスをセットアップします。

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // WorkManager インスタンスをセットアップ
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

また、AndroidManifest.xml を編集して、Android がデフォルトの WorkManagerFactory を初期化しないようにすることが重要です。https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default に示すようにしてください。そうしないと、アプリがクラッシュします。

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

## ListenableWorker の宣言

```kotlin
val appModule = module {
    single { MyService() }
    worker { MyListenableWorker(get()) }
}
```

### WorkManagerFactory の追加作成

WorkManagerFactory を記述して Koin に渡すこともできます。これはデリゲートとして追加されます。

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

Koin と workFactory1 が提供する WorkManagerFactory の両方が ListenableWorker をインスタンス化できる場合、Koin が提供するファクトリが使用されます。

## いくつかの前提

### koin ライブラリ自体にマニフェストの変更を追加する
koin-androidx-workmanager 自身のマニフェストがデフォルトの WorkManager を無効にすれば、アプリケーション開発者にとって 1 つ手順を減らすことができます。ただし、アプリ開発者が Koin の WorkManager インフラストラクチャを初期化しない場合、使用可能な WorkManager ファクトリがなくなるため、混乱する可能性があります。

これは、checkModules が役立つ可能性があります。プロジェクト内のクラスが ListenableWorker を実装している場合、マニフェストとコードの両方を調べて、それらが意味をなしていることを確認します。

### DSL の改善オプション:
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

次に、Koin の内部処理で次のようなことを行います。

```kotlin
fun Application.setupWorkManagerFactory(
  // WorkerFactory には vararg はありません
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}
```