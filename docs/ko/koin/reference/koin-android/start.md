---
title: Android에서 Koin 시작하기
---

`koin-android` 프로젝트는 Android 환경에 Koin의 기능을 제공하는 데 중점을 둡니다. 자세한 내용은 [Android 설정](/docs/setup/koin#android) 섹션을 참조하세요.

## Application 클래스에서 시작하기

`Application` 클래스에서 `startKoin` 함수를 사용하고 `androidContext`로 Android 컨텍스트를 다음과 같이 주입할 수 있습니다:

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Koin을 Android 로거에 기록
            androidLogger()
            // Android 컨텍스트 참조
            androidContext(this@MainApplication)
            // 모듈 로드
            modules(myAppModules)
        }
    }
}
```

:::info
Application 클래스에서 Koin을 시작하고 싶지 않다면, 어디서든 Koin을 시작할 수 있습니다.
:::

다른 Android 클래스에서 Koin을 시작해야 하는 경우, `startKoin` 함수를 사용하여 Android `Context` 인스턴스를 다음과 같이 제공할 수 있습니다:

```kotlin
startKoin {
    // Android 컨텍스트 주입
    androidContext(/* your android context */)
    // ...
}
```

## 추가 설정

Koin 설정(`startKoin { }` 블록 코드)에서 Koin의 여러 부분을 구성할 수도 있습니다.

### Android용 Koin 로깅

`KoinApplication` 인스턴스 내에는 `AndroidLogger()` 클래스를 사용하는 `androidLogger` 확장 함수가 있습니다.
이 로거는 Koin 로거의 Android 구현입니다.

요구 사항에 맞지 않는다면 이 로거를 변경할 수 있습니다.

```kotlin
startKoin {
    // Android 로거 사용 - 기본적으로 Level.INFO
    androidLogger()
    // ...
}
```

### 프로퍼티 로드

`assets/koin.properties` 파일에서 Koin 프로퍼티를 사용하여 키/값을 저장할 수 있습니다:

```kotlin
startKoin {
    // ...
    // assets/koin.properties에서 프로퍼티 사용
    androidFileProperties()   
}
```

## Androidx Startup으로 Koin 시작하기 (4.0.1) [실험적]

Gradle 패키지 `koin-androidx-startup`을 사용하면, `KoinStartup` 인터페이스를 사용하여 `Application` 클래스에서 Koin 구성을 선언할 수 있습니다:

```kotlin
class MainApplication : Application(), KoinStartup {

     override fun onKoinStartup() = koinConfiguration {
        androidContext(this@MainApplication)
        modules(appModule)
    }

    override fun onCreate() {
        super.onCreate()
    }
}
```

이는 일반적으로 `onCreate`에서 사용되는 `startKoin` 함수를 대체합니다. `koinConfiguration` 함수는 `KoinConfiguration` 인스턴스를 반환합니다.

:::info
`KoinStartup`은 시작 시 메인 스레드 블로킹을 방지하고 더 나은 성능을 제공합니다.
:::

## Koin을 사용한 시작 의존성

Koin이 설정되고 의존성을 주입할 수 있도록 하려면, `Initializer`가 `KoinInitializer`에 의존하도록 만들 수 있습니다:

```kotlin
class CrashTrackerInitializer : Initializer<Unit>, KoinComponent {

    private val crashTrackerService: CrashTrackerService by inject()

    override fun create(context: Context) {
        crashTrackerService.configure(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return listOf(KoinInitializer::class.java)
    }

}