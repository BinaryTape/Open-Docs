---
title: 컨텍스트 격리 (Context Isolation)
---

## 컨텍스트 격리란 무엇인가요?

SDK 개발자는 전역 방식이 아닌 방식으로도 Koin을 사용할 수 있습니다. 라이브러리의 의존성 주입(DI)에 Koin을 사용하면서, 라이브러리 사용자와 Koin 간의 충돌을 방지하기 위해 컨텍스트를 격리할 수 있습니다.

표준적인 방식으로는 다음과 같이 Koin을 시작할 수 있습니다:

```kotlin
// KoinApplication을 시작하고 전역 컨텍스트에 등록합니다.
startKoin {

    // 사용할 모듈 선언
    modules(...)
}
```

이 방식은 기본 Koin 컨텍스트를 사용하여 의존성을 등록합니다.

하지만 격리된 Koin 인스턴스를 사용하려면, 인스턴스를 선언하고 이를 보유할 클래스에 저장해야 합니다. 라이브러리 내에서 Koin Application 인스턴스를 유지하고 이를 커스텀 `KoinComponent` 구현체에 전달해야 합니다.

여기 `MyIsolatedKoinContext` 클래스가 Koin 인스턴스를 보유하고 있습니다:

```kotlin
// Koin 인스턴스를 위한 컨텍스트 가져오기
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // 사용할 모듈 선언
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

이제 `MyIsolatedKoinContext`를 사용하여 격리된 컨텍스트를 사용할 `IsolatedKoinComponent` 인터페이스를 정의해 보겠습니다:

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // 기본 Koin 인스턴스 오버라이드
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

모든 준비가 끝났습니다. 이제 격리된 컨텍스트에서 인스턴스를 가져오기 위해 `IsolatedKoinComponent`를 사용하면 됩니다:

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject 및 get은 MyIsolatedKoinContext를 대상으로 합니다.
}
```

## 테스트 (Testing)

`by inject()` 위임(delegate)을 통해 의존성을 조회하는 클래스를 테스트하려면 `getKoin()` 메서드를 오버라이드하고 커스텀 Koin 모듈을 정의하세요:

```kotlin
class MyClassTest : KoinTest {
    // 의존성 조회를 위해 사용되는 Koin 컨텍스트
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // 커스텀 Koin 모듈 정의
        val module = module {
            // 의존성 등록
        }

        koin.loadModules(listOf(module))
    }
}