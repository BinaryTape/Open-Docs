---
title: 테스트에서 주입하기
---

## KoinTest를 사용하여 테스트를 KoinComponent로 만들기

*경고*: 이 내용은 Android 계측 테스트(Instrumented tests)에는 적용되지 않습니다. Koin을 사용한 계측 테스트에 대해서는 [Android 계측 테스트](/docs/reference/koin-android/instrumented-testing.md)를 참조하세요.

클래스에 `KoinTest`를 태그하면, 해당 클래스는 `KoinComponent`가 되어 다음 기능을 제공합니다:

* `by inject()` & `get()` - Koin에서 인스턴스를 가져오는 함수
* `checkModules` - 구성을 확인하는 데 도움
* `declareMock` & `declare` - 현재 컨텍스트에서 모의(mock) 또는 새로운 정의를 선언

```kotlin
class ComponentA
class ComponentB(val a: ComponentA)

class MyTest : KoinTest {

    // Lazy inject property
    val componentB : ComponentB by inject()

    @Test
    fun `should inject my components`() {
        startKoin {
            modules(
                module {
                    single { ComponentA() }
                    single { ComponentB(get()) }
                })
        }

        // directly request an instance
        val componentA = get<ComponentA>()

        assertNotNull(a)
        assertEquals(componentA, componentB.a)
    }
```

:::note
 Koin 모듈 구성을 오버로드하여 앱을 부분적으로 빌드하는 데 활용하는 것을 주저하지 마세요.
:::

## JUnit 규칙

### 테스트를 위한 Koin 컨텍스트 생성

다음 규칙을 사용하여 각 테스트에 대한 Koin 컨텍스트를 쉽게 생성하고 유지할 수 있습니다:

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // Your KoinApplication instance here
    modules(myModule)
}
```

### 모의(Mock) 제공자 지정

`declareMock` API를 사용하려면 Koin이 모의 인스턴스를 어떻게 빌드하는지 알 수 있도록 규칙을 지정해야 합니다. 이를 통해 필요에 맞는 적절한 모의 프레임워크를 선택할 수 있습니다.

Mockito를 사용하여 모의(mock) 생성:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    Mockito.mock(clazz.java)
}
```

MockK를 사용하여 모의(mock) 생성:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    mockkClass(clazz)
}
```

!> koin-test 프로젝트는 더 이상 mockito에 종속되지 않습니다

## 즉시 사용 가능한 모의(Mocking)

모의(mock)가 필요할 때마다 새 모듈을 만드는 대신, `declareMock`을 사용하여 즉석에서 모의(mock)를 선언할 수 있습니다:

```kotlin
class ComponentA
class ComponentB(val a: ComponentA)

class MyTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            module {
                single { ComponentA() }
                single { ComponentB(get()) }
            })
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }
    
    @Test
    fun `should inject my components`() {
    
    }
        // Replace current definition by a Mock
        val mock = declareMock<ComponentA>()

        // retrieve mock, same as variable above 
        assertNotNull(get<ComponentA>())

        // is built with mocked ComponentA
        assertNotNull(get<ComponentB>())
    }
```

:::note
 declareMock은 single 또는 factory 여부와 모듈 경로에 포함할지 여부를 지정할 수 있습니다.
:::

## 즉석에서 컴포넌트 선언하기

모의(mock)만으로는 부족하고, 이를 위해 별도의 모듈을 만들고 싶지 않을 때 `declare`를 사용할 수 있습니다:

```kotlin
    @Test
    fun `successful declare an expression mock`() {
        startKoin { }

        declare {
            factory { ComponentA("Test Params") }
        }

        Assert.assertNotEquals(get<ComponentA>(), get<ComponentA>())
    }
```

## Koin 모듈 확인하기

Koin은 Koin 모듈이 올바른지 테스트하는 방법을 제공합니다: `checkModules` - 정의 트리를 탐색하고 각 정의가 바인딩되어 있는지 확인합니다.

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## 테스트를 위한 Koin 시작 및 중지

각 테스트 사이에 Koin 인스턴스를 중지하는 데 주의하세요 (테스트에서 `startKoin`을 사용하는 경우). 그렇지 않으면 로컬 Koin 인스턴스에는 `koinApplication`을, 현재 전역 인스턴스를 중지하려면 `stopKoin()`을 사용해야 합니다.

## JUnit5로 테스트하기
JUnit 5 지원은 Koin 컨텍스트의 시작 및 중지를 처리하는 [확장 기능(Extensions)](https://junit.org/junit5/docs/current/user-guide/#extensions)을 제공합니다. 이는 해당 확장 기능을 사용하면 `AutoCloseKoinTest`를 사용할 필요가 없음을 의미합니다.

### 의존성
JUnit5로 테스트하려면 `koin-test-junit5` 의존성을 사용해야 합니다.

### 테스트 작성
`KoinTestExtension`을 등록하고 모듈 구성을 제공해야 합니다. 이 작업이 완료되면 컴포넌트를 테스트에 가져오거나 주입할 수 있습니다. `@RegisterExtension`과 함께 `@JvmField`를 사용하는 것을 잊지 마세요.

```kotlin
class ExtensionTests: KoinTest {

    private val componentB by inject<Simple.ComponentB>()

    @JvmField
    @RegisterExtension
    val koinTestExtension = KoinTestExtension.create {
        modules(
                module {
            single { Simple.ComponentA() }
            single { Simple.ComponentB(get()) }
        })
    }

    @Test
    fun contextIsCreatedForTheTest() {
        Assertions.assertNotNull(get<Simple.ComponentA>())
        Assertions.assertNotNull(componentB)
    }
}

```

### JUnit5로 모의(Mocking)하기
이는 JUnit4와 동일한 방식으로 작동하지만, `@RegisterExtension`을 사용해야 한다는 점이 다릅니다.

```kotlin
class MockExtensionTests: KoinTest {

    val mock: Simple.UUIDComponent by inject()

    @JvmField
    @RegisterExtension
    val koinTestExtension = KoinTestExtension.create {
        modules(
                module {
                    single { Simple.UUIDComponent() }
                })
    }

    @JvmField
    @RegisterExtension
    val mockProvider = MockProviderExtension.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun mockProviderTest() {
        val uuidValue = "UUID"
        declareMock<Simple.UUIDComponent> {
            BDDMockito.given(getUUID()).will { uuidValue }
        }

        Assertions.assertEquals(uuidValue, mock.getUUID())
    }
}
```

### 생성된 Koin 인스턴스 가져오기
생성된 Koin 컨텍스트를 함수 파라미터로 가져올 수도 있습니다. 이는 테스트 함수에 함수 파라미터를 추가하여 달성할 수 있습니다.

```kotlin
class ExtensionTests: KoinTest {
    
    @RegisterExtension
    @JvmField
    val koinTestExtension = KoinTestExtension.create {
        modules(
                module {
                    single { Simple.ComponentA() }
                })
    }

    @Test
    fun contextIsCreatedForTheTest(koin: Koin) {
        // get<SimpleComponentA>() == koin.get<Simple.ComponentA>()
        Assertions.assertNotNull(koin.get<Simple.ComponentA>())
    }
}