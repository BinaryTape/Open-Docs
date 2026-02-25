---
title: CheckModules - Koin 설정 확인 (Deprecated)
---

:::warning
이 API는 Koin 4.0부터 지원 중단(deprecated)되었습니다.
:::

Koin을 사용하면 설정 모듈을 검증하여, 런타임에 의존성 주입 문제가 발생하는 것을 방지할 수 있습니다.

### Koin 동적 체크(Dynamic Check) - CheckModules()  

간단한 JUnit 테스트 내에서 `checkModules()` 함수를 호출하세요. 이렇게 하면 모듈을 실행하고 가능한 각 정의(definition)를 직접 실행하려고 시도합니다. 

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

`checkKoinModules`를 사용하는 것도 가능합니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

주입된 파라미터(parameter), 프로퍼티(property) 또는 동적 인스턴스를 사용하는 정의의 경우, `checkModules` DSL을 사용하여 다음과 같은 상황에서 어떻게 동작할지 지정할 수 있습니다:

* `withInstance(value)` - `value` 인스턴스를 Koin 그래프에 추가합니다 (의존성 또는 파라미터에서 사용 가능).

* `withInstance<MyType>()` - `MyType`의 모의(mocked) 인스턴스를 추가합니다. `MockProviderRule`을 사용하세요. (의존성 또는 파라미터에서 사용 가능).

* `withParameter<Type>(qualifier){ qualifier -> value }` - 파라미터로 주입될 `value` 인스턴스를 추가합니다.

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 파라미터로 주입될 `value` 인스턴스를 추가합니다.

* `withProperty(key,value)` - Koin에 프로퍼티를 추가합니다.

#### Junit rule로 모의 객체(mocking) 허용하기

`checkModules`와 함께 모의 객체를 사용하려면 `MockProviderRule`을 제공해야 합니다.

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 제공된 clazz에 따라 여기서 사용하는 프레임워크로 모의 객체를 생성하세요. 
}
```

#### 동적 동작을 포함한 모듈 검증 (3.1.3+)

다음과 같은 동적 동작을 검증하려면, CheckKoinModules DSL을 사용하여 테스트에 누락된 인스턴스 데이터를 제공해 봅시다:

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

다음과 같이 검증할 수 있습니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // Koin에 추가할 값, 정의에서 사용됨
                withInstance("_my_id_value")
            }
        }
    }
}
```

이 방식을 통해, `FactoryPresenter` 정의에는 위에서 정의한 `"_my_id_value"`가 주입됩니다.

또한 그래프를 채우기 위해 모의 인스턴스를 사용할 수도 있습니다. Koin이 주입된 모든 정의를 모의할 수 있도록 `MockProviderRule` 선언이 필요하다는 점에 유의하세요.

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// 또는
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // 모의 객체 프레임워크 설정
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // Koin에 ComponentA의 모의 객체 추가 
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### Android용 모듈 확인 (3.1.3)

전형적인 Android 앱에서 그래프를 테스트하는 방법은 다음과 같습니다:

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

`checkKoinModules`를 사용하는 것도 가능합니다:

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

필요한 경우 검증된 모듈의 모든 타입에 대해 기본값을 설정할 수 있습니다. 예를 들어, 주입된 모든 String 값을 오버라이드할 수 있습니다:

`checkModules` 블록에서 `withInstance()` 함수를 사용하여 모든 정의에 대한 기본값을 정의해 보겠습니다:

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

주입된 `String` 파라미터를 사용하는 모든 주입 정의는 `"_ID_"`를 받게 됩니다:

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

#### 스코프 링크(Scope Links) 제공

`checkModules` 블록에서 `withScopeLink` 함수를 사용하여 다른 스코프의 정의로부터 인스턴스를 주입받아 스코프를 연결할 수 있습니다:

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