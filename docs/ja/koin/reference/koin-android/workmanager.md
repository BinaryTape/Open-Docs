---
title: WorkManager
---

Koinは、Workerでのコンストラクタインジェクションを可能にするために、[Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)と統合されています。

## セットアップ

### 依存関係の追加

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
implementation "io.insert-koin:koin-androidx-workmanager:$koin_version"
```

### WorkManagerの設定

ApplicationクラスでKoin WorkManagerファクトリをセットアップします：

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

### デフォルトの初期化子の無効化

デフォルトのWorkManager初期化子を無効にするために、`AndroidManifest.xml`に以下を追加します：

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

## Workerの宣言

### コンパイラプラグインDSL

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

### アノテーション

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

### クラシックDSL

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

## Workのエンキュー

WorkManagerを通常通り使用して、workerをエンキューします：

```kotlin
val workRequest = OneTimeWorkRequestBuilder<MyWorker>().build()
WorkManager.getInstance(context).enqueue(workRequest)
```

## パラメータを持つWorker

WorkManagerのinput dataを介してパラメータを渡します：

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

データとともにエンキュー：

```kotlin
val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setInputData(workDataOf("USER_ID" to "123"))
    .build()

WorkManager.getInstance(context).enqueue(workRequest)
```

## クイックリファレンス

| アプローチ | 宣言 |
|----------|-------------|
| コンパイラプラグインDSL | `worker<MyWorker>()` |
| アノテーション | `@KoinWorker` |
| クラシックDSL | `worker { params -> MyWorker(params.get(), params.get(), get()) }` |

| セットアップ | コード |
|-------|------|
| ファクトリを有効化 | startKoin内で `workManagerFactory()` |
| デフォルトを無効化 | マニフェスト内で `WorkManagerInitializer` を削除 |

## 次のステップ

- **[Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)** - WorkManager公式ドキュメント
- **[Scopes](/docs/reference/koin-android/scope)** - Androidのスコープ
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModelのインジェクション