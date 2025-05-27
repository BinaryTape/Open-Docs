---
title: CheckModules - Koin 설정 확인 (사용 중단됨)
---

:::warning
이 API는 Koin 4.0부터 사용 중단되었습니다.
:::

Koin을 사용하면 설정 모듈을 확인할 수 있어 런타임에 의존성 주입 문제가 발생하는 것을 방지합니다.

### Koin 동적 확인 - CheckModules()  

간단한 JUnit 테스트 내에서 `checkModules()` 함수를 호출하십시오. 이렇게 하면 모듈이 실행되고 가능한 각 정의를 실행하려고 시도합니다.

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(module1,module2)
            checkModules()
        }
    }
}
```

또한 `checkKoinModules`를 사용할 수도 있습니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

주입된 매개변수, 프로퍼티 또는 동적 인스턴스를 사용하는 모든 정의에 대해 `checkModules` DSL은 다음 경우에 어떻게 작동할지 지정할 수 있도록 합니다:

* `withInstance(value)` - Koin 그래프에 `value` 인스턴스를 추가합니다 (의존성 또는 매개변수에 사용될 수 있습니다)

* `withInstance<MyType>()` - `MyType`의 목(mock) 인스턴스를 추가합니다. MockProviderRule을 사용하세요. (의존성 또는 매개변수에 사용될 수 있습니다)

* `withParameter<Type>(qualifier){ qualifier -> value }` - `value` 인스턴스를 매개변수로 주입하도록 추가합니다

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - `value` 인스턴스를 매개변수로 주입하도록 추가합니다

* `withProperty(key,value)` - Koin에 프로퍼티를 추가합니다

#### JUnit 규칙으로 목(mock) 허용

`checkModules`와 함께 목(mock)을 사용하려면 `MockProviderRule`을 제공해야 합니다.

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 주어진 `clazz`로 프레임워크를 사용하여 목(mock)을 만드세요 
}
```

#### 동적 동작으로 모듈 확인 (3.1.3+)

다음과 같은 동적 동작을 확인하려면 CheckKoinModules DSL을 사용하여 테스트에 누락된 인스턴스 데이터를 제공해 봅시다:

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

다음과 같이 확인할 수 있습니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // Koin에 추가할 값, 정의에서 사용됩니다
                withInstance("_my_id_value")
            }
        }
    }
}
```

이런 식으로 `FactoryPresenter` 정의는 위에서 정의된 `"_my_id_value"`로 주입됩니다.

목(mock) 인스턴스를 사용하여 그래프를 채울 수도 있습니다. Koin이 주입된 모든 정의를 목(mock)할 수 있도록 하려면 `MockProviderRule` 선언이 필요하다는 것을 알 수 있습니다.

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// or
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // 목 프레임워크를 설정하세요
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // ComponentA의 목을 Koin에 추가합니다 
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### Android용 모듈 확인 (3.1.3)

아래는 일반적인 Android 앱용 그래프를 테스트할 수 있는 방법입니다:

```kotlin
class CheckModulesTest {

    @get:Rule
    val rule: TestRule = InstantTaskExecutorRule()

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `test DI modules`(){
        koinApplication {
            modules(allModules)
            checkModules(){
                withInstance<Context>()
                withInstance<Application>()
                withInstance<SavedStateHandle>()
                withInstance<WorkerParameters>()
            }
        }
    }
}
```

또한 `checkKoinModules`를 사용할 수도 있습니다:

```kotlin
class CheckModulesTest {

    @get:Rule
    val rule: TestRule = InstantTaskExecutorRule()

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `test DI modules`(){
        checkKoinModules(allModules) {
            withInstance<Context>()
            withInstance<Application>()
            withInstance<SavedStateHandle>()
            withInstance<WorkerParameters>()
        }
    }
}
```

#### 기본값 제공 (3.1.4)

필요하다면, 확인된 모듈 내의 모든 타입에 대해 기본값을 설정할 수 있습니다. 예를 들어, 주입된 모든 문자열 값을 재정의할 수 있습니다:

`checkModules` 블록에서 `withInstance()` 함수를 사용하여 모든 정의에 대한 기본값을 정의해 봅시다:

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(allModules)
        checkModules(){
            withInstance("_ID_")
        }
    }
}
```

주입된 `String` 매개변수를 사용하는 모든 주입된 정의는 `"_ID_"`를 받게 됩니다:

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### ParametersOf 값 제공 (3.1.4)

`withParameter` 또는 `withParameters` 함수를 사용하여 특정 정의에 주입될 기본값을 정의할 수 있습니다:

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(allModules)
        checkModules(){
            withParameter<FactoryPresenter> { "_FactoryId_" }
            withParameters<FactoryPresenter> { parametersOf("_FactoryId_",...) }
        }
    }
}
```

#### 스코프 링크 제공

`checkModules` 블록에서 `withScopeLink` 함수를 사용하여 다른 스코프의 정의로부터 인스턴스를 주입하도록 스코프를 연결할 수 있습니다:

```kotlin
val myModule = module {
    scope(named("scope1")) {
        scoped { ComponentA() }
    }
    scope(named("scope2")) {
        scoped { ComponentB(get()) }
    }
}
```

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(myModule)
        checkModules(){
            withScopeLink(named("scope2"), named("scope1"))
        }
    }
}