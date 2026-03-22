---
title: Android에서 Koin 시작하기
---

`koin-android` 프로젝트는 Android 환경에 Koin의 기능을 제공하는 데 특화되어 있습니다. 자세한 내용은 [Android 설정](/docs/setup/koin#android) 섹션을 참고하세요.

## Application 클래스에서 시작하기

`Application` 클래스에서 다음과 같이 `startKoin` 함수를 사용하고 `androidContext`를 통해 Android 컨텍스트를 주입할 수 있습니다:

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.super.onCreate()

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

## 애노테이션으로 Koin 시작하기

Koin 애노테이션(Annotations)을 사용하는 경우, `startKoin<T>()`를 사용하여 애노테이션이 지정된 모듈 클래스로 Koin을 시작할 수 있습니다:

```kotlin
@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin<MainApplication> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

`startKoin<T>()` 함수는 `@Module` 애노테이션이 지정된 클래스에서 생성된 모듈을 자동으로 로드합니다.

여러 모듈을 사용하는 경우:

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp.data")
class DataModule

@Module
@Configuration
@ComponentScan("com.myapp.domain")
class DomainModule

@KoinApplication
class MainApplication

// 여러 모듈로 시작하기
startKoin<MainApplication> {
    androidLogger()
    androidContext(this@MainApplication)
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

## AndroidX Startup으로 Koin 시작하기 (4.0.1)

[AndroidX Startup](https://developer.android.com/topic/libraries/app-startup)은 앱 시작 시 구성 요소를 초기화하는 간단한 방법을 제공하는 라이브러리입니다. 단일 ContentProvider를 사용하여 모든 의존성을 초기화하므로, 조기 초기화가 필요한 각 구성 요소에 대해 별도의 ContentProvider를 사용하는 오버헤드를 방지합니다.

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
`KoinStartup`은 AndroidX App Startup과 통합되어 `Application.onCreate()` 이전에 ContentProvider를 통해 Koin을 초기화합니다. 이는 Koin이 준비되어 있어야 하는 다른 Initializer들과의 초기화 순서를 관리해야 할 때 유용합니다.
:::

:::warning
`KoinStartup`은 앱 시작 시 메인 스레드에서 실행됩니다. 다른 Initializer를 관리하기 위해 AndroidX App Startup 라이브러리를 사용하지 않는다면, `KoinStartup`을 사용할 **이점이 없습니다**. 대신 표준 `startKoin` 방식을 사용하세요. 모듈 로딩을 백그라운드 스레드로 분산하려면 [Lazy Modules](/docs/reference/koin-core/lazy-modules)를 참고하세요.
:::

Koin이 필요한 다른 Initializer가 있는 경우, 해당 Initializer가 `KoinInitializer`에 의존하도록 설정하세요:

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
```

## 다음 단계

- **[JSR-330 호환성](/docs/reference/koin-android/jsr330)** - 표준 `@Inject`, `@Singleton` 애노테이션 사용
- **[Android에서 주입하기](/docs/reference/koin-android/get-instances)** - Activity, Fragment, Service에서 인스턴스 가져오기
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 주입 및 스코핑(scoping)
- **[Hilt 마이그레이션](/docs/reference/koin-android/hilt-migration)** - Hilt에서 Koin으로 마이그레이션하기