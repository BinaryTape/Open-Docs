---
title: Koin 설정 검증하기
---

Koin을 사용하면 설정 모듈을 검증할 수 있어, 런타임에 의존성 주입(Dependency Injection) 문제가 발생하는 것을 방지할 수 있습니다.

## Verify()를 이용한 Koin 설정 체크 - JVM 전용 [3.3]

Koin 모듈에서 `verify()` 확장 함수를 사용하세요. 그게 전부입니다! 내부적으로 이 함수는 모든 생성자 클래스를 확인하고 Koin 설정과 대조하여 해당 의존성에 대해 선언된 컴포넌트가 있는지 크로스체크합니다. 실패할 경우, 이 함수는 `MissingKoinDefinitionException`을 발생시킵니다.

```kotlin
val niaAppModule = module {
    includes(
        jankStatsKoinModule,
        dataKoinModule,
        syncWorkerKoinModule,
        topicKoinModule,
        authorKoinModule,
        interestsKoinModule,
        settingsKoinModule,
        bookMarksKoinModule,
        forYouKoinModule
    )
    viewModelOf(::MainActivityViewModel)
}
```

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Koin 설정 검증
        niaAppModule.verify()
    }
}
```

JUnit 테스트를 실행하면 끝입니다! ✅

보시다시피, Koin 설정에서 사용되지만 직접 선언되지 않은 타입을 나열하기 위해 추가적인 `extraTypes` 파라미터를 사용합니다. 이는 주입된 파라미터로 사용되는 `SavedStateHandle` 및 `WorkerParameters` 타입의 경우에 해당합니다. `Context`는 시작 시 `androidContext()` 함수에 의해 선언됩니다.

`verify()` API는 매우 가볍게 실행되며 설정 상에서 어떠한 종류의 모의 객체(mock)나 스텁(stub)도 필요하지 않습니다.

## 주입된 파라미터를 사용한 검증 - JVM 전용 [4.0]

`parametersOf`를 통해 객체 주입을 암시하는 설정이 있는 경우, 설정에 파라미터 타입에 대한 정의가 없으므로 검증이 실패합니다. 
하지만 `definition<Type>(Class1::class, Class2::class ...)`와 같이 주어진 정의와 함께 주입될 파라미터 타입을 정의할 수 있습니다.

사용법은 다음과 같습니다:

```kotlin
class ModuleCheck {

    // 주입된 정의가 포함된 정의가 주어졌을 때
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // 주입된 파라미터 검증 및 선언
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 타입 화이트리스트 지정 (Type White-Listing)

타입을 "화이트리스트(white-listed)"로 추가할 수 있습니다. 이는 해당 타입이 시스템의 모든 정의에 대해 존재하는 것으로 간주됨을 의미합니다. 사용법은 다음과 같습니다:

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Koin 설정 검증
        niaAppModule.verify(
            // 정의에서 사용되지만 직접 선언되지 않은 타입 목록 (파라미터 주입과 같은 경우)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## Core 어노테이션 - 안전한 타입 자동 선언

또한 Koin 어노테이션에서 추출한 어노테이션들을 메인 Koin 프로젝트(`koin-core-annotations` 모듈 아래)에 도입했습니다.
이들은 `@InjectedParam` 및 `@Provided`를 사용하여 Koin이 주입 계약을 추론하고 설정을 검증하도록 도와줌으로써 장황한 선언을 방지합니다. 복잡한 DSL 설정을 사용하는 대신, 이러한 요소들을 식별하는 데 도움을 줍니다. 
이 어노테이션들은 현재 `verify` API에서만 사용됩니다.

```kotlin
// "a"가 주입된 파라미터임을 나타냄
class ComponentB(@InjectedParam val a: ComponentA)
// "a"가 동적으로 제공됨을 나타냄
class ComponentBProvided(@Provided val a: ComponentA)
```

이는 사용자 정의 검증 로직을 작성하지 않고도 테스트나 런타임 중에 발생할 수 있는 미묘한 문제를 예방하는 데 도움이 됩니다.