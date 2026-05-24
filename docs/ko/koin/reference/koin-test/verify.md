---
title: Koin 설정 검증하기
---

Koin을 사용하면 설정 모듈을 검증할 수 있어, 런타임에 의존성 주입(Dependency Injection) 문제가 발생하는 것을 방지할 수 있습니다.

:::tip 현재 컴파일 타임 안정성 사용 가능
**Koin 컴파일러 플러그인**은 이제 컴파일 타임 의존성 검증 기능을 제공하여, 누락된 의존성, 한정자(qualifier) 불일치, 잘못된 호출 지점을 빌드 타임에 찾아낼 수 있습니다. 대부분의 경우 이는 `verify()`와 `checkModules()`를 대체합니다.

마이그레이션 방법은 [컴파일 타임 안정성](/docs/reference/koin-compiler/compile-safety)을 참조하세요.
:::

## Verify API - JVM 전용 [3.3+]

Koin 모듈에서 `verify()` 확장 함수를 사용하세요. 내부적으로 이 함수는 모든 생성자 클래스를 확인하고 Koin 설정과 대조하여 해당 의존성에 대해 선언된 컴포넌트가 있는지 크로스체크합니다. 실패할 경우, 이 함수는 `MissingKoinDefinitionException`을 발생시킵니다.

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
    viewModel<MainActivityViewModel>()
}
```

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {
        // Koin 설정 검증
        niaAppModule.verify()
    }
}
```

JUnit 테스트를 실행하면 끝입니다!

`verify()` API는 매우 가볍게 실행되며 설정 상에서 어떠한 종류의 모의 객체(mock)나 스텁(stub)도 필요하지 않습니다.

### 주입된 파라미터를 사용한 검증 [4.0+]

`parametersOf`를 통해 객체 주입을 암시하는 설정이 있는 경우, 설정에 파라미터 타입에 대한 정의가 없으므로 검증이 실패합니다. 
하지만 `definition<Type>(Class1::class, Class2::class ...)`와 같이 주어진 정의와 함께 주입될 파라미터 타입을 정의할 수 있습니다.

```kotlin
class ModuleCheck {

    // 주입된 정의가 포함된 정의가 주어졌을 때
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

### 타입 화이트리스트 지정 (Type White-Listing)

타입을 "화이트리스트(white-listed)"로 추가할 수 있습니다. 이는 해당 타입이 시스템의 모든 정의에 대해 존재하는 것으로 간주됨을 의미합니다.

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Koin 설정 검증
        niaAppModule.verify(
            // 정의에서 사용되지만 직접 선언되지 않은 타입 목록 (파라미터 주입과 같은 경우)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

### 검증을 위해 어노테이션 사용하기

`koin-core-annotations`의 어노테이션은 Koin이 주입 계약을 추론하고 설정을 검증하도록 도와줍니다. 복잡한 DSL 설정을 사용하는 대신, 이러한 요소들을 식별하는 데 도움을 줍니다.

```kotlin
// "a"가 주입된 파라미터임을 나타냄
class ComponentB(@InjectedParam val a: ComponentA)
// "a"가 동적으로 제공됨을 나타냄
class ComponentBProvided(@Provided val a: ComponentA)
```

이는 사용자 정의 검증 로직을 작성하지 않고도 테스트나 런타임 중에 발생할 수 있는 미묘한 문제를 예방하는 데 도움이 됩니다.

---

## CheckModules API (지원 중단)

:::warning
`checkModules()` API는 Koin 4.0부터 지원 중단(deprecated)되었습니다. 대신 `verify()`를 사용하거나 컴파일 타임 안정성을 위해 Koin 컴파일러 플러그인으로 마이그레이션하세요.
:::

`checkModules()` 함수는 모듈을 실행하고 가능한 모든 정의를 실행하려고 시도합니다.

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {

        koinApplication {
            modules(module1, module2)
            checkModules()
        }
    }
}
```

또는 `checkKoinModules`를 사용할 수 있습니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        checkKoinModules(listOf(module1, module2))
    }
}
```

### CheckModule DSL

주입된 파라미터, 프로퍼티 또는 동적 인스턴스를 사용하는 정의의 경우:

* `withInstance(value)` - `value` 인스턴스를 Koin 그래프에 추가합니다.
* `withInstance<MyType>()` - `MyType`의 모의 객체(mock) 인스턴스를 추가합니다. (MockProviderRule 필요)
* `withParameter<Type>(qualifier){ qualifier -> value }` - 파라미터로 주입될 `value` 인스턴스를 추가합니다.
* `withProperty(key, value)` - Koin에 프로퍼티를 추가합니다.

### JUnit Rule을 이용한 모의 객체(Mocking) 처리

`checkModules`와 함께 모의 객체(mock)를 사용하려면 `MockProviderRule`을 제공하세요:

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 주어진 clazz에 대해 사용 중인 프레임워크로 모의 객체 생성
    Mockito.mock(clazz.java)
}
```

### 동적 동작이 포함된 모듈 검증하기

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

다음과 같이 검증합니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {

        koinApplication {
            modules(myModule)
            checkModules(){
                // 정의에서 사용될 Koin에 추가할 값
                withInstance("_my_id_value")
            }
        }
    }
}
```

### Android 예시

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

### 스코프 연결(Scope Link) 제공하기

`withScopeLink`를 사용하여 스코프를 연결합니다:

```kotlin
val myModule = module {
    scope(named("scope1")) {
        scoped { ComponentA() }
    }
    scope(named("scope2")) {
        scoped { ComponentB(get()) }
    }
}

@Test
fun `test DI modules`(){
    koinApplication {
        modules(myModule)
        checkModules(){
            withScopeLink(named("scope2"), named("scope1"))
        }
    }
}
```

---

## 컴파일 타임 안정성으로 마이그레이션

Koin 컴파일러 플러그인은 이제 컴파일 타임 의존성 검증 기능을 제공하여 런타임 검증의 필요성을 대체합니다.

| 이전 | 이후 |
|--------|-------|
| 테스트 코드의 `module.verify()` | 컴파일러 플러그인 (자동) |
| 테스트 코드의 `checkModules()` | 컴파일러 플러그인 (자동) |
| 런타임 검증 | 컴파일 타임 검증 |
| 수동 테스트 설정 | 테스트 코드 불필요 |

컴파일러는 모든 빌드 시점에 검증을 수행하므로 테스트 코드가 필요하지 않습니다. 컴파일러 플러그인을 활성화한 후에는 `verify()` 및 `checkModules()` 테스트를 안전하게 제거할 수 있습니다.

자세한 내용은 [컴파일 타임 안정성](/docs/reference/koin-compiler/compile-safety)을 참조하고, 설정 방법은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.