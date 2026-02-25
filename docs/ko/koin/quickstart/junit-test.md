---
title: JUnit 테스트
---

> 이 튜토리얼에서는 Kotlin 애플리케이션을 테스트하고 Koin을 사용하여 컴포넌트를 주입(inject) 및 검색(retrieve)하는 방법을 알아봅니다.

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 설정

먼저, 아래와 같이 Koin 의존성을 추가합니다:

```groovy
dependencies {
    // Koin 테스트 도구
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 필요한 JUnit 버전
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 의존성 선언

`koin-core` 시작하기 프로젝트의 koin 모듈을 재사용합니다:

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 첫 번째 테스트 작성하기

첫 번째 테스트를 만들기 위해, 간단한 JUnit 테스트 파일을 작성하고 `KoinTest`를 상속받습니다. 그러면 `by inject()` 연산자를 사용할 수 있게 됩니다.

```kotlin
class HelloAppTest : KoinTest {

    val model by inject<HelloMessageData>()
    val service by inject<HelloService>()

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger()
        modules(helloModule)
    }

    @Test
    fun `unit test`() {
        val helloApp = HelloApplication()
        helloApp.sayHello()

        assertEquals(service, helloApp.helloService)
        assertEquals("Hey, ${model.message}", service.hello())
    }
}
```

> Koin의 `KoinTestRule`을 사용하여 Koin 컨텍스트를 시작하고 중지합니다.

`MyPresenter`에 직접 Mock을 만들거나 `MyRepository`를 테스트할 수도 있습니다. 이러한 컴포넌트들은 Koin API와 아무런 연결 고리가 없습니다.

```kotlin
class HelloMockTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger(Level.DEBUG)
        modules(helloModule)
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `mock test`() {
        val service = declareMock<HelloService> {
            given(hello()).willReturn("Hello Mock")
        }

        HelloApplication().sayHello()

        Mockito.verify(service,times(1)).hello()
    }
}