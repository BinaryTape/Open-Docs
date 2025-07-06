---
title: Koin 구성 검증하기
---

Koin을 사용하면 구성 모듈을 검증하여 런타임에 의존성 주입 문제가 발생하는 것을 방지할 수 있습니다.

## Verify()를 사용한 Koin 구성 검사 - JVM 전용 [3.3]

Koin 모듈에서 `verify()` 확장 함수를 사용하세요. 그게 전부입니다! 내부적으로, 이 함수는 모든 생성자 클래스를 검증하고 Koin 구성과 교차 검사하여 이 의존성에 대해 선언된 컴포넌트가 있는지 확인합니다. 실패 시에는 `MissingKoinDefinitionException`을 발생시킵니다.

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

        // Verify Koin configuration
        niaAppModule.verify()
    }
}
```

JUnit 테스트를 실행하면 완료됩니다! ✅

보시다시피, Koin 구성에서 사용되지만 직접 선언되지 않은 타입을 나열하기 위해 `extra Types` 매개변수를 사용합니다. 이는 주입된 매개변수로 사용되는 `SavedStateHandle` 및 `WorkerParameters` 타입의 경우입니다. `Context`는 시작 시 `androidContext()` 함수에 의해 선언됩니다.

`verify()` API는 실행하기에 매우 가벼우며 구성에서 실행하기 위해 어떤 종류의 목(mock)/스텁(stub)도 필요하지 않습니다.

## 주입된 매개변수로 검증하기 - JVM 전용 [4.0]

`parametersOf`를 사용하여 주입된 객체를 포함하는 구성이 있는 경우, 구성에 매개변수 타입의 정의가 없기 때문에 검증이 실패합니다. 하지만 주어진 정의인 `definition<Type>(Class1::class, Class2::class ...)`와 함께 주입될 매개변수 타입을 정의할 수 있습니다.

방법은 다음과 같습니다:

```kotlin
class ModuleCheck {

    // given a definition with an injected definition
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // Verify and declare Injected Parameters
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 타입 화이트리스트

타입을 "화이트리스트"에 추가할 수 있습니다. 이는 해당 타입이 어떤 정의에서든 시스템에 존재하는 것으로 간주된다는 의미입니다. 방법은 다음과 같습니다:

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Verify Koin configuration
        niaAppModule.verify(
            // List types used in definitions but not declared directly (like parameter injection)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## 핵심 어노테이션 - 안전한 타입 자동 선언

저희는 또한 Koin 어노테이션에서 추출된 어노테이션을 메인 Koin 프로젝트(koin-core-annotations 모듈 하에)에 도입했습니다.
이는 `@InjectedParam` 및 `@Provided`를 사용하여 Koin이 주입 계약을 추론하고 구성을 검증하도록 돕는 장황한 선언을 피하게 해줍니다. 복잡한 DSL 구성 대신, 이는 이러한 요소를 식별하는 데 도움이 됩니다.
현재 이 어노테이션들은 `verify` API에서만 사용됩니다.

```kotlin
// indicates that "a" is an injected parameter
class ComponentB(@InjectedParam val a: ComponentA)
// indicates that "a" is dynamically provided
class ComponentBProvided(@Provided val a: ComponentA)
```

이는 사용자 정의 검증 로직을 작성하지 않고도 테스트 또는 런타임 중에 발생할 수 있는 미묘한 문제를 방지하는 데 도움이 됩니다.