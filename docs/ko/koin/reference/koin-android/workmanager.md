---
title: WorkManager
---
`koin-androidx-workmanager` 프로젝트는 Android WorkManager 기능을 제공하는 데 전념하고 있습니다.

## WorkManager DSL

## WorkManager 설정

시작 시 KoinApplication 선언에서 `workManagerFactory()` 키워드를 사용하여 사용자 정의 WorkManager 인스턴스를 설정합니다.

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // WorkManager 인스턴스 설정
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default 에 표시된 대로 Android가 기본 WorkManagerFactory를 초기화하지 못하도록 AndroidManifest.xml을 편집하는 것도 중요합니다. 그렇게 하지 않으면 앱이 충돌합니다.

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

### 추가 WorkManager Factory 생성

WorkManagerFactory를 작성하여 Koin에 전달할 수도 있습니다. 이는 대리자로 추가됩니다.

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

Koin과 workFactory1 모두 WorkManagerFactory가 ListenableWorker를 인스턴스화할 수 있는 경우 Koin에서 제공하는 Factory가 사용됩니다.

## 몇 가지 가정

### Koin 라이브러리 자체에 Manifest 변경 사항 추가
koin-androidx-workmanager 자체 Manifest가 기본 Work Manager를 비활성화하면 애플리케이션 개발자의 단계를 줄일 수 있습니다. 그러나 앱 개발자가 Koin의 Work Manager 인프라를 초기화하지 않으면 사용할 수 있는 Work Manager Factory가 없게 되므로 혼란스러울 수 있습니다.

프로젝트의 클래스가 ListenableWorker를 구현하는 경우 `checkModules`가 Manifest와 코드를 모두 검사하고 의미가 있는지 확인하는 데 도움이 될 수 있습니다.

### DSL 개선 옵션:
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

그런 다음 Koin 내부에서 다음과 같은 작업을 수행합니다.

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
```