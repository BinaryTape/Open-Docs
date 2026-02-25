---
title: Koin 시작하기
---

Koin은 DSL이자 경량 컨테이너이며 실용적인 API입니다. Koin 모듈 내에 정의(definition)를 선언하고 나면, Koin 컨테이너를 시작할 준비가 된 것입니다.

### startKoin 함수

`startKoin` 함수는 Koin 컨테이너를 실행하는 주요 진입점(entry point)입니다. 실행하려면 *Koin 모듈 목록*이 필요합니다.
모듈이 로드되면 Koin 컨테이너에 의해 정의들이 해결(resolve)될 준비가 완료됩니다.

.Koin 시작하기
```kotlin
// Global context에서 KoinApplication 시작
startKoin {
    // 사용할 모듈 선언
    modules(coffeeAppModule)
}
```

`startKoin`이 호출되면 Koin은 모든 모듈과 정의를 읽어들입니다. 이후 Koin은 필요한 인스턴스를 검색하기 위한 모든 `get()` 또는 `by inject()` 호출에 응답할 준비가 됩니다.

Koin 컨테이너에는 여러 옵션을 설정할 수 있습니다.

* `logger` - 로깅 활성화 - [Logging](#logging) 섹션 참고
* `properties()`, `fileProperties( )` 또는 `environmentProperties( )` - 환경 변수, koin.properties 파일, 추가 프로퍼티 등에서 프로퍼티 로드 - [Loading properties](#loading-properties) 섹션 참고

:::info
 `startKoin`은 한 번 이상 호출할 수 없습니다. 모듈을 로드해야 할 지점이 여러 곳이라면 `loadKoinModules` 함수를 사용하세요.
:::

### Koin 시작 확장 (KMP 등의 재사용 지원)

Koin은 이제 `KoinConfiguration`을 위한 재사용 및 확장 가능한 설정 객체를 지원합니다. 플랫폼(Android, iOS, JVM 등) 간에 공유할 설정을 추출하거나 다양한 환경에 맞게 조정할 수 있습니다. 이는 `includes()` 함수를 통해 가능합니다. 아래 예시와 같이 공통 설정을 쉽게 재사용하고, 이를 확장하여 Android 환경 설정을 추가할 수 있습니다.

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) // 외부 설정 확장을 포함할 수 있음
        modules(appModule)
   }
}

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}
```

### 시작 프로세스 내부 - 내부의 Koin 인스턴스

Koin을 시작하면 Koin 컨테이너 설정 인스턴스를 나타내는 `KoinApplication` 인스턴스가 생성됩니다. 실행이 완료되면 모듈과 옵션이 반영된 `Koin` 인스턴스가 생성됩니다.
이 `Koin` 인스턴스는 `GlobalContext`에 유지되어 모든 `KoinComponent` 클래스에서 사용할 수 있게 됩니다.

`GlobalContext`는 Koin의 기본 JVM 컨텍스트 전략입니다. `startKoin`에 의해 호출되어 `GlobalContext`에 등록됩니다. 이는 Koin Multiplatform 관점에서 다른 종류의 컨텍스트를 등록할 수 있게 해줍니다.

### startKoin 이후에 모듈 로드하기

`startKoin` 함수는 두 번 이상 호출할 수 없지만, `loadKoinModules()` 함수는 직접 사용할 수 있습니다.

이 함수는 Koin을 사용하려는 SDK 개발자들에게 유용합니다. SDK 시작 부분에서 `startKoin()`을 호출할 필요 없이 `loadKoinModules`만 사용하면 되기 때문입니다.

```kotlin
loadKoinModules(module1, module2 ...)
```

### 모듈 언로드하기

지정된 함수를 사용하여 여러 정의를 언로드하고 해당 인스턴스를 해제하는 것도 가능합니다.

```kotlin
unloadKoinModules(module1, module2 ...)
```

### Koin 중지 - 모든 리소스 닫기

모든 Koin 리소스를 닫고 인스턴스 및 정의를 폐기할 수 있습니다. 이를 위해 어디서나 `stopKoin()` 함수를 호출하여 Koin `GlobalContext`를 중지할 수 있습니다.
또는 `KoinApplication` 인스턴스에서 `close()`를 호출하면 됩니다.

## Logging

Koin은 모든 Koin 활동(할당, 조회 등)을 기록하기 위한 간단한 로깅 API를 제공합니다. 로깅 API는 아래 클래스로 표현됩니다.

Koin Logger

```kotlin
abstract class Logger(var level: Level = Level.INFO) {

    abstract fun display(level: Level, msg: MESSAGE)

    fun debug(msg: MESSAGE) {
        log(Level.DEBUG, msg)
    }

    fun info(msg: MESSAGE) {
        log(Level.INFO, msg)
    }

    fun warn(msg: MESSAGE) {
        log(Level.WARNING, msg)
    }

    fun error(msg: MESSAGE) {
        log(Level.ERROR, msg)
    }
}
```

Koin은 대상 플랫폼에 따라 몇 가지 로깅 구현체를 제안합니다.

* `PrintLogger` - 콘솔에 직접 로그 기록 (`koin-core`에 포함)
* `EmptyLogger` - 아무것도 기록하지 않음 (`koin-core`에 포함)
* `SLF4JLogger` - SLF4J로 로그 기록. Ktor 및 Spark에서 사용 (`koin-logger-slf4j` 프로젝트)
* `AndroidLogger` - Android Logger에 로그 기록 (`koin-android`에 포함)

### 시작 시 로깅 설정

기본적으로 Koin은 `EmptyLogger`를 사용합니다. 다음과 같이 `PrintLogger`를 직접 사용할 수 있습니다.

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## Loading properties

시작 시 여러 유형의 프로퍼티를 로드할 수 있습니다.

* environment properties - *시스템* 프로퍼티 로드
* koin.properties 파일 - `/src/main/resources/koin.properties` 파일에서 프로퍼티 로드
* "extra" 시작 프로퍼티 - `startKoin` 함수에 전달된 값의 맵(map)

### 모듈에서 프로퍼티 읽기

Koin 시작 시 프로퍼티를 로드해야 합니다.

```kotlin
startKoin {
    // 기본 위치에서 프로퍼티 로드
    // (예: `/src/main/resources/koin.properties`)
    fileProperties()
}
```

Koin 모듈에서는 키(key)를 통해 프로퍼티를 가져올 수 있습니다.

/src/main/resources/koin.properties 파일 내용:
```java
// Key - value
server_url=http://service_url
```

`getProperty` 함수로 로드하면 됩니다.

```kotlin
val myModule = module {

    // "server_url" 키를 사용하여 해당 값을 검색
    single { MyService(getProperty("server_url")) }
}
```

## Koin Options - 기능 플래깅 (4.1.0)

이제 Koin 애플리케이션에서 다음과 같이 전용 `options` 섹션을 통해 일부 실험적 기능을 활성화할 수 있습니다.

```kotlin
startKoin {
    options(
        // ViewModel Scope factory 기능 활성화 
        viewModelScopeFactory()
    )
}