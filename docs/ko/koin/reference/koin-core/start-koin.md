---
title: Koin 시작하기
---

Koin은 DSL이자, 경량 컨테이너이며, 실용적인 API입니다. Koin 모듈 내에 정의를 선언하면, Koin 컨테이너를 시작할 준비가 된 것입니다.

### `startKoin` 함수

`startKoin` 함수는 Koin 컨테이너를 실행하는 주요 진입점입니다. 이 함수는 실행할 *Koin 모듈 목록*을 필요로 합니다.
모듈이 로드되고 정의가 Koin 컨테이너에 의해 해결될 준비가 됩니다.

Koin 시작하기
```kotlin
// Global 컨텍스트에서 KoinApplication 시작
startKoin {
    // 사용될 모듈 선언
    modules(coffeeAppModule)
}
```

`startKoin`이 호출되면, Koin은 모든 모듈과 정의를 읽습니다. 그러면 Koin은 필요한 인스턴스를 가져오기 위한 모든 `get()` 또는 `by inject()` 호출에 대비할 준비가 됩니다.

Koin 컨테이너는 다음과 같은 몇 가지 옵션을 가질 수 있습니다.

* `logger` - 로깅을 활성화합니다. - [로깅](#logging) 섹션 참조
* `properties()`, `fileProperties( )` 또는 `environmentProperties( )` - 환경, `koin.properties` 파일, 추가 프로퍼티 등에서 프로퍼티를 로드합니다. - [프로퍼티 로드](#loading-properties) 섹션 참조

:::info
`startKoin`은 두 번 이상 호출될 수 없습니다. 여러 지점에서 모듈을 로드해야 하는 경우, `loadKoinModules` 함수를 사용하세요.
:::

### Koin 시작 확장 (KMP 및 기타 재사용성 지원)

Koin은 이제 KoinConfiguration을 위한 재사용 가능하고 확장 가능한 구성 객체를 지원합니다. 공유 구성을 플랫폼(Android, iOS, JVM 등) 간에 사용하거나 다른 환경에 맞게 조정하여 추출할 수 있습니다. 이는 `includes()` 함수로 수행할 수 있습니다. 아래에서 일반적인 구성을 쉽게 재사용하고, Android 환경 설정을 추가하여 확장할 수 있습니다:

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) // 외부 구성 확장을 포함할 수 있음
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

### 시작 과정의 내부 동작 - Koin 인스턴스

Koin을 시작할 때, Koin 컨테이너 구성 인스턴스를 나타내는 `KoinApplication` 인스턴스를 생성합니다. 일단 실행되면, 모듈과 옵션의 결과로 `Koin` 인스턴스를 생성하게 됩니다.
이 `Koin` 인스턴스는 이후 `GlobalContext`에 의해 유지되며, 모든 `KoinComponent` 클래스에서 사용될 수 있습니다.

`GlobalContext`는 Koin의 기본 JVM 컨텍스트 전략입니다. `startKoin`에 의해 호출되고 `GlobalContext`에 등록됩니다. 이는 Koin 멀티플랫폼 관점에서 다른 종류의 컨텍스트를 등록할 수 있게 해줍니다.

### `startKoin` 이후 모듈 로드

`startKoin` 함수를 두 번 이상 호출할 수는 없습니다. 하지만 `loadKoinModules()` 함수를 직접 사용할 수 있습니다.

이 함수는 Koin을 사용하려는 SDK 개발자에게 유용합니다. 왜냐하면 그들은 `startKoin()` 함수를 사용할 필요 없이 라이브러리 시작 시 `loadKoinModules`를 사용하기만 하면 되기 때문입니다.

```kotlin
loadKoinModules(module1,module2 ...)
```

### 모듈 언로드

주어진 함수를 사용하여 여러 정의를 언로드하고 해당 인스턴스들을 해제하는 것도 가능합니다.

```kotlin
unloadKoinModules(module1,module2 ...)
```

### Koin 중지 - 모든 리소스 닫기

모든 Koin 리소스를 닫고 인스턴스와 정의를 삭제할 수 있습니다. 이를 위해 어디서든 `stopKoin()` 함수를 사용하여 Koin `GlobalContext`를 중지할 수 있습니다.
또는 `KoinApplication` 인스턴스에서 단순히 `close()`를 호출하기만 하면 됩니다.

## 로깅

Koin은 모든 Koin 활동(할당, 조회 등)을 로깅하는 간단한 로깅 API를 제공합니다. 이 로깅 API는 아래 클래스로 표현됩니다.

Koin 로거

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

Koin은 대상 플랫폼에 따라 몇 가지 로깅 구현을 제공합니다.

* `PrintLogger` - 콘솔에 직접 로깅합니다 (`koin-core`에 포함됨)
* `EmptyLogger` - 아무것도 로깅하지 않습니다 (`koin-core`에 포함됨)
* `SLF4JLogger` - SLF4J를 사용하여 로깅합니다. Ktor 및 Spark에서 사용됩니다 (`koin-logger-slf4j` 프로젝트)
* `AndroidLogger` - Android 로거에 로깅합니다 (`koin-android`에 포함됨)

### 시작 시 로깅 설정

기본적으로 Koin은 `EmptyLogger`를 사용합니다. 다음과 같이 `PrintLogger`를 직접 사용할 수 있습니다.

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## 프로퍼티 로드

시작 시 다음과 같은 여러 종류의 프로퍼티를 로드할 수 있습니다.

* 환경 프로퍼티 - *시스템* 프로퍼티를 로드합니다.
* `koin.properties` 파일 - `/src/main/resources/koin.properties` 파일에서 프로퍼티를 로드합니다.
* "추가" 시작 프로퍼티 - `startKoin` 함수에 전달되는 값의 맵입니다.

### 모듈에서 프로퍼티 읽기

Koin 시작 시 프로퍼티를 로드해야 합니다.

```kotlin
startKoin {
    // 기본 위치에서 프로퍼티 로드
    // (예: `/src/main/resources/koin.properties`)
    fileProperties()
}
```

Koin 모듈에서는 키를 사용하여 프로퍼티를 가져올 수 있습니다.

`/src/main/resources/koin.properties` 파일에서
```java
// 키 - 값
server_url=http://service_url
```

`getProperty` 함수로 로드하기만 하면 됩니다.

```kotlin
val myModule = module {

    // "server_url" 키를 사용하여 해당 값 가져오기
    single { MyService(getProperty("server_url")) }
}
```

## Koin 옵션 - 기능 플래그 (4.1.0)

이제 Koin 애플리케이션은 전용 `options` 섹션을 통해 일부 실험적 기능을 활성화할 수 있습니다. 예를 들어:

```kotlin
startKoin {
    options(
        // ViewModel Scope 팩토리 기능 활성화 
        viewModelScopeFactory()
    )
}
```