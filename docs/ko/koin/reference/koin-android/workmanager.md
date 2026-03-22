---
title: WorkManager
---

Koin은 Worker에서 생성자 주입(constructor injection)을 가능하게 하기 위해 [Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)와 통합됩니다.

## 설정 (Setup)

### 의존성 추가

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
implementation "io.insert-koin:koin-androidx-workmanager:$koin_version"
```

### WorkManager 설정

Application 클래스에서 Koin WorkManager 팩토리를 설정합니다:

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

### 기본 초기화 도구 비활성화

기본 WorkManager 초기화 도구(initializer)를 비활성화하려면 `AndroidManifest.xml`에 다음을 추가하세요:

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

## Worker 선언

### 컴파일러 플러그인 DSL

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

### 어노테이션 (Annotations)

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

### 클래식 DSL

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

## 작업 예약 (Enqueuing Work)

Worker를 예약하려면 평소와 같이 WorkManager를 사용하세요:

```kotlin
val workRequest = OneTimeWorkRequestBuilder<MyWorker>().build()
WorkManager.getInstance(context).enqueue(workRequest)
```

## 파라미터가 있는 Worker

WorkManager의 input data를 통해 파라미터를 전달합니다:

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

데이터와 함께 예약:

```kotlin
val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setInputData(workDataOf("USER_ID" to "123"))
    .build()

WorkManager.getInstance(context).enqueue(workRequest)
```

## 빠른 참조 (Quick Reference)

| 접근 방식 | 선언 |
|----------|-------------|
| 컴파일러 플러그인 DSL | `worker<MyWorker>()` |
| 어노테이션 | `@KoinWorker` |
| 클래식 DSL | `worker { params -> MyWorker(params.get(), params.get(), get()) }` |

| 설정 | 코드 |
|-------|------|
| 팩토리 활성화 | `startKoin` 내에서 `workManagerFactory()` |
| 기본값 비활성화 | manifest에서 `WorkManagerInitializer` 제거 |

## 다음 단계

- **[Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)** - 공식 WorkManager 문서
- **[Scopes](/docs/reference/koin-android/scope)** - Android Scope
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 주입 (Injection)