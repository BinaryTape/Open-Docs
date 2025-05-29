---
title: WorkManager
---

`koin-androidx-workmanager` 프로젝트는 Android WorkManager 기능을 지원하기 위해 만들어졌습니다.

## WorkManager DSL

## WorkManager 설정

시작 시, KoinApplication 선언에서 `workManagerFactory()` 키워드를 사용하여 커스텀 WorkManager 인스턴스를 설정하세요:

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

또한, 다음 링크(https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default)에서 볼 수 있듯이, Android가 기본 WorkManagerFactory를 초기화하는 것을 방지하기 위해 AndroidManifest.xml을 수정하는 것이 중요합니다. 그렇지 않으면 앱이 충돌할 수 있습니다.

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

### 추가 WorkManager 팩토리 생성

WorkManagerFactory를 작성하고 Koin에 넘겨줄 수도 있습니다. 이는 델리게이트(delegate)로 추가됩니다.

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

Koin과 `workFactory1`이 제공하는 WorkManagerFactory가 모두 `ListenableWorker`를 인스턴스화할 수 있는 경우, Koin이 제공하는 팩토리가 사용됩니다.

## 몇 가지 가정

### Koin 라이브러리 자체에 매니페스트 변경 사항 추가

`koin-androidx-workmanager` 자체의 매니페스트가 기본 WorkManager를 비활성화한다면 애플리케이션 개발자에게 한 단계를 줄여줄 수 있습니다. 하지만 이는 혼란을 야기할 수 있는데, 만약 앱 개발자가 Koin의 WorkManager 인프라를 초기화하지 않으면 결국 사용할 수 있는 WorkManager 팩토리가 없게 될 것이기 때문입니다.

이는 `checkModules`가 도움이 될 수 있는 부분입니다. 프로젝트의 어떤 클래스라도 `ListenableWorker`를 구현한다면 매니페스트와 코드를 모두 검사하여 그것들이 타당한지 확인할 수 있을까요?

### DSL 개선 옵션:

```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

그런 다음 Koin 내부적으로 다음과 같이 처리하도록 할 수 있습니다.

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