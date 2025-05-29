---
title: 어노테이션을 사용한 정의
---

Koin 어노테이션을 사용하면 일반 Koin DSL과 동일한 종류의 정의를 어노테이션으로 선언할 수 있습니다. 필요한 어노테이션으로 클래스를 태그하기만 하면, Koin이 모든 것을 자동으로 생성해 줍니다!

예를 들어, `single { MyComponent(get()) }` DSL 선언과 동일한 기능은 다음과 같이 `@Single`로 태그하는 것만으로 이루어집니다:

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin 어노테이션은 Koin DSL과 동일한 의미(semantic)를 가집니다. 다음 정의를 사용하여 컴포넌트를 선언할 수 있습니다:

-   `@Single` - 싱글톤 인스턴스 (DSL에서는 `single { }`로 선언)
-   `@Factory` - 팩토리 인스턴스. 인스턴스가 필요할 때마다 재생성되는 인스턴스입니다. (DSL에서는 `factory { }`로 선언)
-   `@KoinViewModel` - Android ViewModel 인스턴스 (DSL에서는 `viewModel { }`로 선언)
-   `@KoinWorker` - Android Worker Workmanager 인스턴스 (DSL에서는 `worker { }`로 선언)

스코프에 대해서는 [스코프 선언](/docs/reference/koin-core/scopes.md) 섹션을 참조하세요.

### Kotlin Multiplatform용 Compose ViewModel 생성 (버전 1.4.0부터)

`@KoinViewModel` 어노테이션은 Android 또는 Compose KMP ViewModel을 생성하는 데 사용될 수 있습니다. 일반 `org.koin.androidx.viewmodel.dsl.viewModel` 대신 `org.koin.compose.viewmodel.dsl.viewModel`을 사용하여 `viewModel` Koin 정의를 생성하려면, `KOIN_USE_COMPOSE_VIEWMODEL` 옵션을 활성화해야 합니다:

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
`USE_COMPOSE_VIEWMODEL` 키는 `KOIN_USE_COMPOSE_VIEWMODEL`로 인해 더 이상 사용되지 않습니다.
:::

:::note
Koin 4.0에서는 ViewModel 타입 인자가 동일한 라이브러리에서 오므로 이 두 ViewModel DSL이 하나로 병합될 예정입니다.
:::

## 자동 또는 특정 바인딩

컴포넌트를 선언할 때, 감지된 모든 "바인딩" (관련 상위 타입)이 자동으로 준비됩니다. 예를 들어, 다음 정의는:

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin은 `MyComponent` 컴포넌트가 `MyInterface`에도 연결되어 있음을 선언합니다. DSL 동등 구문은 `single { MyComponent(get()) } bind MyInterface::class`입니다.

Koin이 자동으로 감지하도록 하는 대신, `binds` 어노테이션 파라미터를 사용하여 실제로 바인딩하려는 타입을 지정할 수도 있습니다:

```kotlin
@Single(binds = [MyBoundType::class])
```

## 널 허용 의존성

컴포넌트가 널 허용 의존성을 사용하는 경우, 걱정하지 마세요. 자동으로 처리됩니다. 기존의 정의 어노테이션을 계속 사용하면 Koin이 알아서 처리할 것입니다:

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

생성된 DSL 동등 구문은 `single { MyComponent(getOrNull()) }`가 됩니다.

> 이는 주입된 파라미터(Parameters)와 프로퍼티(properties)에도 동일하게 적용됩니다.

## @Named를 사용한 한정자

동일한 타입에 대한 여러 정의를 구분하기 위해 `@Named` 어노테이션으로 정의에 "이름" (한정자(qualifier)라고도 함)을 추가할 수 있습니다:

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

의존성을 해결할 때, `named` 함수와 함께 한정자를 사용하기만 하면 됩니다:

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

커스텀 한정자 어노테이션을 생성하는 것도 가능합니다. 이전 예시를 사용하면 다음과 같습니다:

```kotlin
@Named
annotation class InMemoryLogger

@Named
annotation class DatabaseLogger

@Single
@InMemoryLogger
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@DatabaseLogger
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

```kotlin
val logger: LoggerDataSource by inject(named<InMemoryLogger>())
```

## @InjectedParam을 사용한 주입된 파라미터

생성자 멤버를 "주입된 파라미터(injected parameter)"로 태그할 수 있습니다. 이는 해결(resolution)을 호출할 때 의존성이 그래프에 전달됨을 의미합니다.

예를 들어:

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

그런 다음 `MyComponent`를 호출하고 `MyDependency`의 인스턴스를 전달할 수 있습니다:

```kotlin
val m = MyDependency
// Resolve MyComponent while passing  MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

생성된 DSL 동등 구문은 `single { params -> MyComponent(params.get()) }`가 됩니다.

## 지연 의존성 주입 - `Lazy<T>`

Koin은 지연 의존성을 자동으로 감지하고 해결할 수 있습니다. 예를 들어, 여기서는 `LoggerDataSource` 정의를 지연 방식으로 해결하고자 합니다. 다음과 같이 `Lazy` Kotlin 타입을 사용하기만 하면 됩니다:

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

내부적으로는 `get()` 대신 `inject()`와 같이 DSL을 생성합니다:

```kotlin
single { LoggerAggregator(inject()) }
```

## 의존성 목록 주입 - `List<T>`

Koin은 의존성 목록 전체를 자동으로 감지하고 해결할 수 있습니다. 예를 들어, 여기서는 모든 `LoggerDataSource` 정의를 해결하고자 합니다. 다음과 같이 `List` Kotlin 타입을 사용하기만 하면 됩니다:

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource

@Single
class LoggerAggregator(val datasource : List<LoggerDataSource>)
```

내부적으로는 `getAll()` 함수와 같이 DSL을 생성합니다:

```kotlin
single { LoggerAggregator(getAll()) }
```

## @Property를 사용한 프로퍼티

정의에서 Koin 프로퍼티를 해결하려면, 생성자 멤버를 `@Property`로 태그하기만 하면 됩니다. 이는 어노테이션에 전달된 값을 통해 Koin 프로퍼티를 해결합니다:

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

생성된 DSL 동등 구문은 `factory { ComponentWithProps(getProperty("id")) }`가 됩니다.

### @PropertyValue - 기본값을 가진 프로퍼티 (버전 1.4부터)

Koin 어노테이션은 `@PropertyValue` 어노테이션을 사용하여 코드에서 직접 프로퍼티의 기본값을 정의할 수 있는 기능을 제공합니다. 다음 예시를 따릅니다:

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
){
    public companion object {
        @PropertyValue("id")
        public const val DEFAULT_ID : String = "_empty_id"
    }
}
```

생성된 DSL 동등 구문은 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`가 됩니다.