---
title: Koin DSL
---

Kotlin 언어의 강력함 덕분에 Koin은 어노테이션을 붙이거나 코드를 생성하는 대신 앱을 기술(describe)하는 데 도움이 되는 DSL을 제공합니다. Kotlin DSL을 통해 Koin은 의존성 주입을 준비할 수 있도록 스마트한 함수형 API를 제공합니다.

## 애플리케이션 & 모듈 DSL

Koin은 Koin 애플리케이션의 요소를 기술(describe)할 수 있도록 몇 가지 키워드를 제공합니다.

- 애플리케이션 DSL: Koin 컨테이너 구성을 기술합니다.
- 모듈 DSL: 주입되어야 할 컴포넌트들을 기술합니다.

## 애플리케이션 DSL

`KoinApplication` 인스턴스는 Koin 컨테이너 인스턴스 구성입니다. 이를 통해 로깅, 속성 로딩 및 모듈을 구성할 수 있습니다.

새로운 `KoinApplication`을 빌드하려면 다음 함수들을 사용합니다.

* `koinApplication { }` - `KoinApplication` 컨테이너 구성을 생성합니다.
* `startKoin { }` - `KoinApplication` 컨테이너 구성을 생성하고 `GlobalContext`에 등록하여 GlobalContext API 사용을 허용합니다.

`KoinApplication` 인스턴스를 구성하려면 다음 함수들 중 하나를 사용할 수 있습니다.

* `logger( )` - 어떤 레벨과 로거 구현을 사용할지 기술합니다 (기본적으로 `EmptyLogger`를 사용합니다).
* `modules( )` - 컨테이너에 로드할 Koin 모듈 목록을 설정합니다 (목록 또는 가변 인자(vararg) 목록).
* `properties()` - HashMap 속성을 Koin 컨테이너로 로드합니다.
* `fileProperties( )` - 주어진 파일에서 속성을 Koin 컨테이너로 로드합니다.
* `environmentProperties( )` - OS 환경에서 속성을 Koin 컨테이너로 로드합니다.
* `createEagerInstances()` - 즉시 생성되는(eager) 인스턴스를 생성합니다 (`createdAtStart`로 표시된 싱글톤 정의).

## KoinApplication 인스턴스: 전역(Global) vs 지역(Local)

위에서 보듯이, Koin 컨테이너 구성을 `koinApplication` 또는 `startKoin` 함수라는 두 가지 방식으로 기술할 수 있습니다.

- `koinApplication`은 Koin 컨테이너 인스턴스를 기술합니다.
- `startKoin`은 Koin 컨테이너 인스턴스를 기술하고 Koin `GlobalContext`에 등록합니다.

컨테이너 구성을 `GlobalContext`에 등록하면 글로벌 API가 이를 직접 사용할 수 있습니다. 모든 `KoinComponent`는 `Koin` 인스턴스를 참조합니다. 기본적으로는 `GlobalContext`의 인스턴스를 사용합니다.

자세한 내용은 커스텀 Koin 인스턴스에 대한 챕터를 참조하세요.

## Koin 시작하기

Koin을 시작하는 것은 `GlobalContext`에서 `KoinApplication` 인스턴스를 실행하는 것을 의미합니다.

모듈을 사용하여 Koin 컨테이너를 시작하려면 다음과 같이 `startKoin` 함수를 사용하면 됩니다.

```kotlin
// Global 컨텍스트에서 KoinApplication 시작
startKoin {
    // 사용할 로거 선언
    logger()
    // 사용할 모듈 선언
    modules(coffeeAppModule)
}
```

## 모듈 DSL

Koin 모듈은 애플리케이션에서 주입/결합할 정의들을 모아둡니다. 새로운 모듈을 생성하려면 다음 함수를 사용합니다.

* `module { // module content }` - Koin 모듈을 생성합니다.

모듈 내부에 내용을 기술(describe)하려면 다음 함수들을 사용할 수 있습니다.

* `factory { //definition }` - 팩토리 빈 정의를 제공합니다.
* `single { //definition }` - 싱글톤 빈 정의를 제공합니다 (`bean`으로도 별칭 지정됨).
* `get()` - 컴포넌트 의존성을 해결(resolve)합니다 (이름, 스코프 또는 파라미터도 사용할 수 있습니다).
* `bind()` - 주어진 빈 정의에 바인딩할 타입을 추가합니다.
* `binds()` - 주어진 빈 정의에 바인딩할 타입 배열을 추가합니다.
* `scope { // scope group }` - `scoped` 정의를 위한 논리적 그룹을 정의합니다.
* `scoped { //definition }`- 스코프 내에서만 존재하는 빈 정의를 제공합니다.

참고: `named()` 함수는 문자열, 열거형(enum) 또는 타입으로 한정자(qualifier)를 지정할 수 있도록 합니다. 이는 정의에 이름을 부여하는 데 사용됩니다.

### 모듈 작성

Koin 모듈은 *모든 컴포넌트를 선언하는 공간*입니다. `module` 함수를 사용하여 Koin 모듈을 선언합니다.

```kotlin
val myModule = module {
   // 여기에 의존성을 선언합니다
}
```

이 모듈에서 아래에 설명된 대로 컴포넌트를 선언할 수 있습니다.

### withOptions - DSL 옵션 (3.2 버전부터)

새로운 [생성자 DSL](./dsl-update.md) 정의와 마찬가지로, `withOptions` 연산자를 사용하여 "일반" 정의에 정의 옵션을 지정할 수 있습니다.

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

이 옵션 람다 내에서 다음 옵션들을 지정할 수 있습니다.

* `named("a_qualifier")` - 정의에 문자열 한정자(qualifier)를 부여합니다.
* `named<MyType>()` - 정의에 타입 한정자(qualifier)를 부여합니다.
* `bind<MyInterface>()` - 주어진 빈 정의에 바인딩할 타입을 추가합니다.
* `binds(arrayOf(...))` - 주어진 빈 정의에 바인딩할 타입 배열을 추가합니다.
* `createdAtStart()` - Koin 시작 시 싱글톤 인스턴스를 생성합니다.