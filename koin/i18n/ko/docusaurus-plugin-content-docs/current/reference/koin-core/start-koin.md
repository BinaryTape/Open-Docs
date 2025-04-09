---
title: "Koin 시작하기"
---
Koin은 DSL(Domain Specific Language)이자, 가벼운 컨테이너이며 실용적인 API입니다. Koin 모듈 내에서 정의를 선언했다면, Koin 컨테이너를 시작할 준비가 된 것입니다.

### startKoin 함수

`startKoin` 함수는 Koin 컨테이너를 시작하는 주요 진입점입니다. 실행하려면 *Koin 모듈 목록*이 필요합니다. 모듈이 로드되고 정의는 Koin 컨테이너에 의해 분석될 준비가 됩니다.

Koin 시작하기
```kotlin
// 전역 컨텍스트에서 KoinApplication 시작
startKoin {
    // 사용할 모듈 선언
    modules(coffeeAppModule)
}
```

`startKoin`이 호출되면, Koin은 모든 모듈 및 정의를 읽습니다. 그런 다음 Koin은 필요한 인스턴스를 검색하기 위해 `get()` 또는 `by inject()` 호출을 할 준비가 됩니다.

Koin 컨테이너는 다음과 같은 몇 가지 옵션을 가질 수 있습니다.

* `logger` - 로깅 활성화 - <<logging.adoc#_logging,logging>> 섹션 참조
* `properties()`, `fileProperties( )` 또는 `environmentProperties( )` - 환경, koin.properties 파일, 추가 속성 등에서 속성 로드 ... - <<properties.adoc#_lproperties,properties>> 섹션 참조

:::info
`startKoin`은 한 번 이상 호출할 수 없습니다. 모듈을 로드할 여러 지점이 필요한 경우 `loadKoinModules` 함수를 사용하십시오.
:::

### 시작의 배후 - 내부의 Koin 인스턴스

Koin을 시작하면 Koin 컨테이너 구성 인스턴스를 나타내는 `KoinApplication` 인스턴스를 생성합니다. 시작되면 모듈 및 옵션의 결과인 `Koin` 인스턴스를 생성합니다.
이 `Koin` 인스턴스는 `KoinComponent` 클래스에서 사용하기 위해 `GlobalContext`에 의해 유지됩니다.

`GlobalContext`는 Koin의 기본 JVM 컨텍스트 전략입니다. `startKoin`에 의해 호출되고 `GlobalContext`에 등록됩니다. 이를 통해 Koin Multiplatform의 관점에서 다른 종류의 컨텍스트를 등록할 수 있습니다.

### startKoin 후 모듈 로드

`startKoin` 함수를 한 번 이상 호출할 수 없습니다. 그러나 `loadKoinModules()` 함수를 직접 사용할 수 있습니다.

이 함수는 Koin을 사용하려는 SDK 제작자에게 유용합니다. `starKoin()` 함수를 사용할 필요 없이 라이브러리 시작 시 `loadKoinModules`를 사용할 수 있기 때문입니다.

```kotlin
loadKoinModules(module1,module2 ...)
```

### 모듈 언로드

일련의 정의를 언로드하고 지정된 함수로 해당 인스턴스를 해제할 수도 있습니다.

```kotlin
unloadKoinModules(module1,module2 ...)
```

### Koin 중지 - 모든 리소스 닫기

모든 Koin 리소스를 닫고 인스턴스 및 정의를 삭제할 수 있습니다. 이를 위해 Koin `GlobalContext`를 중지하기 위해 어디서든 `stopKoin()` 함수를 사용할 수 있습니다.
또는 `KoinApplication` 인스턴스에서 `close()`를 호출하십시오.

## 로깅

Koin은 Koin 활동(할당, 조회 등)을 기록하기 위한 간단한 로깅 API를 가지고 있습니다. 로깅 API는 아래 클래스로 표현됩니다.

Koin Logger

```kotlin
abstract class Logger(var level: Level = Level.INFO) {

    abstract fun log(level: Level, msg: MESSAGE)

    fun debug(msg: MESSAGE) {
        log(Level.DEBUG, msg)
    }

    fun info(msg: MESSAGE) {
        log(Level.INFO, msg)
    }

    fun error(msg: MESSAGE) {
        log(Level.ERROR, msg)
    }
}
```

Koin은 대상 플랫폼의 기능에서 로깅의 일부 구현을 제안합니다.

* `PrintLogger` - 콘솔에 직접 기록 (koin-core에 포함됨)
* `EmptyLogger` - 아무것도 기록하지 않음 (koin-core에 포함됨)
* `SLF4JLogger` - SLF4J로 기록. ktor 및 spark에서 사용 (`koin-logger-slf4j` 프로젝트)
* `AndroidLogger` - Android Logger에 기록 (koin-android에 포함됨)

### 시작 시 로깅 설정

기본적으로 Koin은 `EmptyLogger`를 사용합니다. 다음과 같이 `PrintLogger`를 직접 사용할 수 있습니다.

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## 속성 로드

시작 시 여러 유형의 속성을 로드할 수 있습니다.

* 환경 속성 - *시스템* 속성 로드
* koin.properties 파일 - `/src/main/resources/koin.properties` 파일에서 속성 로드
* "extra" 시작 속성 - `startKoin` 함수에서 전달된 값의 맵

### 모듈에서 속성 읽기

Koin 시작 시 속성을 로드해야 합니다.

```kotlin
startKoin {
    // 기본 위치에서 속성 로드
    // (예: `/src/main/resources/koin.properties`)
    fileProperties()
}
```

Koin 모듈에서 키로 속성을 가져올 수 있습니다.

/src/main/resources/koin.properties 파일에서
```java
// 키 - 값
server_url=http://service_url
```

`getProperty` 함수로 로드하기만 하면 됩니다.

```kotlin
val myModule = module {

    // "server_url" 키를 사용하여 해당 값을 검색합니다.
    single { MyService(getProperty("server_url")) }
}
```