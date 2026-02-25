---
title: Koin DSL
---

Kotlin 언어의 강력함 덕분에, Koin은 어노테이션을 달거나 코드를 생성하는 대신 앱을 설명하는 데 도움을 주는 DSL을 제공합니다. Koin은 Kotlin DSL을 통해 의존성 주입을 준비하기 위한 스마트하고 함수형인 API를 제공합니다.

## Application & Module DSL

Koin은 Koin 애플리케이션의 요소를 설명할 수 있는 여러 키워드를 제공합니다:

- Application DSL: Koin 컨테이너 설정을 설명하기 위해 사용
- Module DSL: 주입해야 할 컴포넌트를 설명하기 위해 사용

## Application DSL

`KoinApplication` 인스턴스는 Koin 컨테이너 인스턴스 설정입니다. 이를 통해 로깅, 프로퍼티 로딩 및 모듈을 설정할 수 있습니다.

새로운 `KoinApplication`을 빌드하려면 다음 함수를 사용하세요:

* `koinApplication { }` - `KoinApplication` 컨테이너 설정을 생성합니다.
* `startKoin { }` - `KoinApplication` 컨테이너 설정을 생성하고, GlobalContext API를 사용할 수 있도록 `GlobalContext`에 등록합니다.

`KoinApplication` 인스턴스를 설정하려면 다음 함수 중 어느 것이든 사용할 수 있습니다:

* `logger( )` - 사용할 로그 레벨과 Logger 구현체를 설명합니다 (기본적으로 EmptyLogger를 사용함).
* `modules( )` - 컨테이너에 로드할 Koin 모듈 목록을 설정합니다 (list 또는 vararg list).
* `properties()` - HashMap 프로퍼티를 Koin 컨테이너로 로드합니다.
* `fileProperties( )` - 주어진 파일의 프로퍼티를 Koin 컨테이너로 로드합니다.
* `environmentProperties( )` - OS 환경 변수의 프로퍼티를 Koin 컨테이너로 로드합니다.
* `createEagerInstances()` - 즉시 초기화되는 인스턴스(`createdAtStart`로 표시된 Single 정의)를 생성합니다.

## KoinApplication instance: Global vs Local

위에서 보았듯이, Koin 컨테이너 설정은 `koinApplication` 또는 `startKoin` 함수를 통해 두 가지 방식으로 설명할 수 있습니다. 

- `koinApplication`은 Koin 컨테이너 인스턴스를 설명합니다.
- `startKoin`은 Koin 컨테이너 인스턴스를 설명하고 이를 Koin `GlobalContext`에 등록합니다.

컨테이너 설정을 `GlobalContext`에 등록하면 글로벌 API가 이를 직접 사용할 수 있습니다. 모든 `KoinComponent`는 `Koin` 인스턴스를 참조하며, 기본적으로 `GlobalContext`에 있는 인스턴스를 사용합니다.

자세한 내용은 Custom Koin instance에 관한 장을 확인하세요.

## Starting Koin

Koin을 시작한다는 것은 `GlobalContext`에서 `KoinApplication` 인스턴스를 실행하는 것을 의미합니다.

모듈과 함께 Koin 컨테이너를 시작하려면 다음과 같이 `startKoin` 함수를 사용하면 됩니다:

```kotlin
// Global context에서 KoinApplication 시작
startKoin {
    // 사용할 로거 선언
    logger()
    // 사용할 모듈 선언
    modules(coffeeAppModule)
}
```

## Module DSL

Koin 모듈은 애플리케이션을 위해 주입하거나 결합할 정의(definition)들을 모읍니다. 새 모듈을 만들려면 다음 함수를 사용하세요:

* `module { // module content }` - Koin 모듈을 생성합니다.

모듈 내의 콘텐츠를 설명하려면 다음 함수들을 사용할 수 있습니다:

* `factory { //definition }` - 팩토리 빈 정의를 제공합니다.
* `single { //definition  }` - 싱글톤 빈 정의를 제공합니다 (`bean`이라는 별칭으로도 사용 가능).
* `get()` - 컴포넌트 의존성을 해결(resolve)합니다 (이름, 스코프 또는 파라미터도 사용할 수 있음).
* `bind()` - 주어진 빈 정의에 바인딩할 타입을 추가합니다.
* `binds()` - 주어진 빈 정의에 바인딩할 타입 배열을 추가합니다.
* `scope { // scope group }` - `scoped` 정의를 위한 논리적 그룹을 정의합니다.
* `scoped { //definition }`- 특정 스코프 내에서만 존재하는 빈 정의를 제공합니다.

참고: `named()` 함수를 사용하면 문자열, 열거형(enum) 또는 타입을 통해 한정자(qualifier)를 지정할 수 있습니다. 이는 정의에 이름을 붙이는 데 사용됩니다.

### 모듈 작성하기

Koin 모듈은 *모든 컴포넌트를 선언하는 공간*입니다. `module` 함수를 사용하여 Koin 모듈을 선언하세요:

```kotlin
val myModule = module {
   // 여기에 의존성을 선언하세요
}
```

이 모듈 내에서 아래에 설명된 대로 컴포넌트를 선언할 수 있습니다.

### withOptions - DSL 옵션 (3.2 버전부터)

새로운 [Constructor DSL](./dsl-update.md) 정의와 마찬가지로, `withOptions` 연산자를 사용하여 "일반적인(regular)" 정의에 옵션을 지정할 수 있습니다:

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

이 옵션 람다 내에서 다음과 같은 옵션들을 지정할 수 있습니다:

* `named("a_qualifier")` - 정의에 문자열 한정자를 부여합니다.
* `named<MyType>()` - 정의에 타입 한정자를 부여합니다.
* `bind<MyInterface>()` - 주어진 빈 정의에 바인딩할 타입을 추가합니다.
* `binds(arrayOf(...))` - 주어진 빈 정의에 바인딩할 타입 배열을 추가합니다.
* `createdAtStart()` - Koin 시작 시 싱글톤 인스턴스를 생성합니다.