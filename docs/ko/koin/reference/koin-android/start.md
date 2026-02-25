---
title: Android에서 Koin 시작하기
---

`koin-android` 프로젝트는 Android 환경에 Koin의 기능을 제공하는 데 특화되어 있습니다. 자세한 내용은 [Android 설정](/docs/setup/koin#android) 섹션을 참고하세요.

## Application 클래스에서 시작하기

`Application` 클래스에서 다음과 같이 `startKoin` 함수를 사용하고 `androidContext`를 통해 Android 컨텍스트를 주입할 수 있습니다:

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Android 로거에 Koin 로그 기록
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
Application 클래스에서 시작하고 싶지 않다면 어디서든 Koin을 시작할 수 있습니다.
:::

다른 Android 클래스에서 Koin을 시작해야 하는 경우, 다음과 같이 `startKoin` 함수를 사용하고 Android `Context` 인스턴스를 제공할 수 있습니다:

```kotlin
startKoin {
    // Android 컨텍스트 주입
    androidContext(/* your android context */)
    // ...
}
```

## 추가 설정

Koin 설정(`startKoin { }` 코드 블록) 내에서 Koin의 여러 부분을 구성할 수도 있습니다.

### Android용 Koin 로깅

`KoinApplication` 인스턴스에는 `AndroidLogger()` 클래스를 사용하는 `androidLogger` 확장 함수가 있습니다. 이 로거는 Koin 로거의 Android 구현체입니다.

요구 사항에 맞지 않는 경우 이 로거를 변경할 수 있습니다.

```kotlin
startKoin {
    // Android 로거 사용 - 기본값은 Level.INFO
    androidLogger()
    // ...
}
```

### 프로퍼티 로드하기

`assets/koin.properties` 파일에 Koin 프로퍼티를 사용하여 키/값 쌍을 저장할 수 있습니다:

```kotlin
startKoin {
    // ...
    // assets/koin.properties의 프로퍼티 사용
    androidFileProperties()   
}
```

## AndroidX Startup으로 Koin 시작하기 (4.0.1) [실험적]

`koin-androidx-startup` Gradle 패키지를 사용하면, `KoinStartup` 인터페이스를 사용하여 Application 클래스에 Koin 설정을 선언할 수 있습니다:

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

이 방식은 일반적으로 `onCreate`에서 사용하는 `startKoin` 함수를 대체합니다. `koinConfiguration` 함수는 `KoinConfiguration` 인스턴스를 반환합니다.

:::info
`KoinStartup`은 시작 시 메인 스레드 차단을 방지하며 더 나은 성능을 제공합니다.
:::

## Koin과의 Startup 의존성

Koin 설정이 완료되어야 하고 의존성 주입이 필요한 경우, `Initializer`가 `KoinInitializer`에 의존하도록 만들 수 있습니다:

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