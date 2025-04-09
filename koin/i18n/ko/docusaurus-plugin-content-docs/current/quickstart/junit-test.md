---
title: "JUnit 테스트"
---
> 이 튜토리얼은 Kotlin 애플리케이션을 테스트하고 Koin을 사용하여 컴포넌트를 주입하고 검색하는 방법을 보여줍니다.

## 코드 가져오기

:::info
[소스 코드는 Github에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 설정

먼저 다음과 같이 Koin 종속성을 추가하십시오.

```groovy
dependencies {
    // Koin testing tools
    testCompile "io.insert-koin:koin-test:$koin_version"
    // Needed JUnit version
    testCompile "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 선언된 의존성

`koin-core` 시작하기 프로젝트를 재사용하여 koin 모듈을 사용합니다.

```kotlin
val helloModule = module {
    single { HelloMessageData() }
    single { HelloServiceImpl(get()) as HelloService }
}
```

## 첫 번째 테스트 작성하기

첫 번째 테스트를 만들기 위해 간단한 Junit 테스트 파일을 작성하고 `KoinTest`로 확장해 보겠습니다. 그러면 `by inject()` 연산자를 사용할 수 있습니다.

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

> Koin KoinTestRule 규칙을 사용하여 Koin 컨텍스트를 시작/중지합니다.

MyPresenter에 직접 Mock을 만들거나 MyRepository를 테스트할 수도 있습니다. 이러한 컴포넌트는 Koin API와 연결되어 있지 않습니다.

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
```