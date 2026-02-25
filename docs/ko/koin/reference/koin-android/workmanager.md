---
title: WorkManager
---

`koin-androidx-workmanager` 프로젝트는 Android WorkManager 기능을 제공하는 데 특화되어 있습니다.

## WorkManager DSL

## WorkManager 설정

시작할 때, `KoinApplication` 선언에서 `workManagerFactory()` 키워드를 사용하여 커스텀 WorkManager 인스턴스를 설정합니다:

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.super.onCreate()

        startKoin {
            // WorkManager 인스턴스 설정
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

Android가 기본 `WorkManagerFactory`를 초기화하는 것을 방지하기 위해 `AndroidManifest.xml`을 수정하는 것도 중요합니다. 자세한 내용은 https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 를 참고하세요. 이 작업을 수행하지 않으면 앱이 충돌합니다.

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

## ListenableWorker 선언

```kotlin
val appModule = module {
    single { MyService() }
    worker { MyListenableWorker(get()) }
}
```

### 추가 Work Manager 팩토리 생성

`WorkManagerFactory`를 작성하여 Koin에 전달할 수도 있습니다. 이는 delegate로 추가됩니다.

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

Koin과 `workFactory1`에서 제공하는 `WorkManagerFactory`가 모두 `ListenableWorker`를 인스턴스화할 수 있는 경우, Koin에서 제공하는 팩토리가 사용됩니다.

## 몇 가지 가정

### Koin 라이브러리 자체에 manifest 변경 사항 추가
`koin-androidx-workmanager` 자체의 manifest에서 기본 Work Manager를 비활성화하면 애플리케이션 개발자의 번거로움을 한 단계 줄일 수 있습니다. 하지만 앱 개발자가 Koin의 Work Manager 인프라를 초기화하지 않으면 사용할 수 있는 Work Manager 팩토리가 없게 되므로 혼란을 줄 수 있습니다.

이 부분은 `checkModules`가 도움이 될 수 있습니다. 프로젝트의 어떤 클래스가 `ListenableWorker`를 구현하는 경우, manifest와 코드를 모두 검사하여 올바르게 구성되었는지 확인할 수 있을까요?

### DSL 개선 옵션:
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

그 후 Koin 내부에서 다음과 같이 처리합니다.

```kotlin
fun Application.setupWorkManagerFactory(
  // WorkerFactory에 대한 vararg 없음
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}