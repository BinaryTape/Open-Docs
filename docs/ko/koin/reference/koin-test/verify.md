---
title: "Koin 구성 확인하기"
---
Koin을 사용하면 구성 모듈을 검증하여 런타임 시 의존성 주입 문제를 발견하는 것을 방지할 수 있습니다.

## Verify()를 사용한 Koin 구성 확인 - JVM 전용 [3.3]

Koin Module에서 `verify()` 확장 함수를 사용하세요. 그게 다입니다! 내부적으로 이는 모든 생성자 클래스를 검증하고 Koin 구성과 교차 검사하여 해당 의존성에 대해 선언된 컴포넌트가 있는지 확인합니다. 실패할 경우 이 함수는 `MissingKoinDefinitionException`을 발생시킵니다.

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

        // Koin 구성 확인
        niaAppModule.verify()
    }
}
```

JUnit 테스트를 실행하면 완료됩니다! ✅

보시다시피, Koin 구성에 사용되지만 직접 선언되지 않은 유형을 나열하기 위해 추가 Types 파라미터를 사용합니다. 이는 주입된 파라미터로 사용되는 `SavedStateHandle` 및 `WorkerParameters` 유형의 경우입니다. `Context`는 시작 시 `androidContext()` 함수에 의해 선언됩니다.

`verify()` API는 실행하기 매우 가볍고 구성을 실행하기 위해 어떤 종류의 mock/stub도 필요하지 않습니다.

## 주입된 파라미터로 검증 - JVM 전용 [4.0]

`parametersOf`를 사용하여 주입된 객체를 포함하는 구성이 있는 경우 구성에 파라미터 유형에 대한 정의가 없기 때문에 검증이 실패합니다.
그러나 주어진 정의 `definition<Type>(Class1::class, Class2::class ...)`으로 주입될 파라미터 유형을 정의할 수 있습니다.

다음은 그 방법입니다.

```kotlin
class ModuleCheck {

    // 주입된 정의가 있는 정의가 주어지면
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

## 유형 화이트리스트

유형을 "화이트리스트(white-listed)"로 추가할 수 있습니다. 이는 이 유형이 모든 정의에 대해 시스템에 존재하는 것으로 간주됨을 의미합니다. 다음은 그 방법입니다.

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Koin 구성 확인
        niaAppModule.verify(
            // 정의에 사용되지만 직접 선언되지 않은 유형 나열 (파라미터 주입과 같이)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```