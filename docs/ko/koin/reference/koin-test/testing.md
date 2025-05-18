---
title: "테스트에서 주입하기"
---
## KoinTest를 사용하여 테스트를 KoinComponent로 만들기

*경고*: 이는 Android Instrumented 테스트에는 적용되지 않습니다. Koin을 사용한 Instrumented 테스트는 [Android Instrumented Testing](/reference/koin-android/instrumented-testing.md)을 참조하십시오.

클래스에 `KoinTest` 태그를 지정하면 클래스는 `KoinComponent`가 되어 다음을 제공합니다.

* `by inject()` & `get()` - Koin에서 인스턴스를 검색하는 함수
* `checkModules` - 구성을 확인하는 데 도움
* `declareMock` & `declare` - 현재 컨텍스트에서 Mock 또는 새 정의를 선언

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
 앱을 부분적으로 빌드하는 데 도움이 되도록 Koin 모듈 구성을 오버로드하는 것을 주저하지 마십시오.
:::

## JUnit 규칙

### 테스트를 위한 Koin 컨텍스트 생성

다음 규칙을 사용하여 각 테스트에 대한 Koin 컨텍스트를 쉽게 만들고 유지할 수 있습니다.

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    // Your KoinApplication instance here
    modules(myModule)
}
```

### Mock 제공자 지정

`declareMock` API를 사용하려면 Koin이 Mock 인스턴스를 빌드하는 방법을 알 수 있도록 규칙을 지정해야 합니다. 이렇게 하면 필요에 맞는 올바른 mocking 프레임워크를 선택할 수 있습니다.

Mockito를 사용하여 Mock 생성:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    Mockito.mock(clazz.java)
}
```

MockK를 사용하여 Mock 생성:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Your way to build a Mock here
    mockkClass(clazz)
}
```

!> koin-test 프로젝트는 더 이상 mockito에 묶여 있지 않습니다.

## 즉시 Mocking

Mock이 필요할 때마다 새 모듈을 만드는 대신 `declareMock`을 사용하여 즉석에서 Mock을 선언할 수 있습니다.

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
 declareMock은 single 또는 factory를 원하는지, 모듈 경로에 포함할지 여부를 지정할 수 있습니다.
:::

## 즉석에서 컴포넌트 선언

Mock으로 충분하지 않고 이를 위해 모듈을 만들고 싶지 않은 경우 `declare`를 사용할 수 있습니다.

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

## Koin 모듈 확인

Koin은 Koin 모듈이 양호한지 테스트하는 방법(`checkModules`)을 제공합니다. 정의 트리를 탐색하고 각 정의가 바인딩되었는지 확인합니다.

```kotlin
    @Test
    fun `check MVP hierarchy`() {
        checkModules {
            modules(myModule1, myModule2 ...)
        } 
    }
```

## 테스트를 위해 Koin 시작 및 중지

모든 테스트 사이에 koin 인스턴스를 중지해야 합니다(테스트에서 `startKoin`을 사용하는 경우). 그렇지 않으면 로컬 koin 인스턴스의 경우 `koinApplication`을 사용하거나 현재 글로벌 인스턴스를 중지하려면 `stopKoin()`을 사용해야 합니다.

## JUnit5로 테스트

JUnit 5 지원은 Koin 컨텍스트의 시작 및 중지를 처리하는 [Extensions](https://junit.org/junit5/docs/current/user-guide/)를 제공합니다. 즉, 확장을 사용하는 경우 `AutoCloseKoinTest`를 사용할 필요가 없습니다.

### 의존성
JUnit5로 테스트하려면 `koin-test-junit5` 의존성을 사용해야 합니다.

### 테스트 작성
`KoinTestExtension`을 등록하고 모듈 구성을 제공해야 합니다. 이 작업이 완료되면 테스트에 컴포넌트를 가져오거나 주입할 수 있습니다. `@JvmField`를 `@RegisterExtension`과 함께 사용하는 것을 잊지 마십시오.

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

### JUnit5를 사용한 Mocking
이것은 JUnit4와 동일한 방식으로 작동하지만 `@RegisterExtension`을 사용해야 합니다.

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
생성된 koin 컨텍스트를 함수 파라미터로 가져올 수도 있습니다. 이는 테스트 함수에 함수 파라미터를 추가하여 수행할 수 있습니다.

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
```