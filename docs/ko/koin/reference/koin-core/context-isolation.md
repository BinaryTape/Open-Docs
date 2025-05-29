---
title: 컨텍스트 격리
---

## 컨텍스트 격리란 무엇인가요?

SDK 개발자라면 Koin을 전역 방식이 아닌 방법으로도 사용할 수 있습니다. 라이브러리의 의존성 주입(DI)에 Koin을 사용하고, 컨텍스트를 격리하여 라이브러리와 Koin을 사용하는 사람들 간의 잠재적인 충돌을 피할 수 있습니다.

일반적인 방식으로 Koin을 시작하는 방법은 다음과 같습니다:

```kotlin
// start a KoinApplication and register it in Global context
startKoin {

    // declare used modules
    modules(...)
}
```

이는 기본 Koin 컨텍스트를 사용하여 의존성을 등록합니다.

하지만 격리된 Koin 인스턴스를 사용하려면, 인스턴스를 선언하고 이를 담을 클래스에 저장해야 합니다. Koin Application 인스턴스를 라이브러리 내에서 사용할 수 있도록 유지하고, 이를 사용자 지정 KoinComponent 구현에 전달해야 합니다.

여기서는 `MyIsolatedKoinContext` 클래스가 Koin 인스턴스를 담고 있습니다:

```kotlin
// Get a Context for your Koin instance
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // declare used modules
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

`MyIsolatedKoinContext`를 사용하여 `IsolatedKoinComponent` 클래스를 정의해봅시다. 이 클래스는 우리의 격리된 컨텍스트를 사용할 KoinComponent입니다.

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // Override default Koin instance
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

모든 준비가 완료되었습니다. `IsolatedKoinComponent`를 사용하여 격리된 컨텍스트에서 인스턴스를 가져오기만 하면 됩니다:

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject & get will target MyKoinContext
}
```

## 테스트

`by inject()` 델리게이트를 사용하여 의존성을 가져오는 클래스를 테스트하려면, `getKoin()` 메서드를 오버라이드하고 사용자 지정 Koin 모듈을 정의해야 합니다:

```kotlin
class MyClassTest : KoinTest {
    // Koin Context used to retrieve dependencies
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // Define custom Koin module
        val module = module {
            // Register dependencies
        }

        koin.loadModules(listOf(module))
    }
}