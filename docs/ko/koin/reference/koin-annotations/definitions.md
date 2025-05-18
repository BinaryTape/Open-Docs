---
title: "주석이 있는 정의 (Definitions with Annotations)"
---
Koin Annotations는 일반적인 Koin DSL과 동일한 종류의 정의를 어노테이션을 사용하여 선언할 수 있도록 합니다. 필요한 어노테이션으로 클래스에 태그를 지정하기만 하면 모든 것이 자동으로 생성됩니다!

예를 들어 `single { MyComponent(get()) }` DSL 선언과 동일한 내용은 다음과 같이 `@Single`로 태그를 지정하여 간단하게 수행할 수 있습니다.

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotations는 Koin DSL과 동일한 의미 체계를 유지합니다. 다음 정의를 사용하여 컴포넌트를 선언할 수 있습니다.

- `@Single` - 싱글톤 인스턴스 (DSL에서 `single { }`로 선언)
- `@Factory` - 팩토리 인스턴스. 인스턴스가 필요할 때마다 다시 생성됩니다. (DSL에서 `factory { }`로 선언)
- `@KoinViewModel` - Android ViewModel 인스턴스 (DSL에서 `viewModel { }`로 선언)
- `@KoinWorker` - Android Worker Workmanager 인스턴스 (DSL에서 `worker { }`로 선언)

스코프의 경우 [스코프 선언](/reference/koin-core/scopes.md) 섹션을 확인하십시오.

### Kotlin Multiplatform용 Compose ViewModel 생성 (1.4.0부터)

`@KoinViewModel` 어노테이션은 Android 또는 Compose KMP ViewModel을 생성하는 데 사용할 수 있습니다. 일반적인 `org.koin.androidx.viewmodel.dsl.viewModel` 대신 `org.koin.compose.viewmodel.dsl.viewModel`을 사용하여 `viewModel` Koin 정의를 생성하려면 `KOIN_USE_COMPOSE_VIEWMODEL` 옵션을 활성화해야 합니다.

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
    `USE_COMPOSE_VIEWMODEL` 키는 더 이상 사용되지 않으며 `KOIN_USE_COMPOSE_VIEWMODEL`이 대신 사용됩니다.
:::

:::note
    Koin 4.0에서는 ViewModel 타입 인수가 동일한 라이브러리에서 제공되므로 이러한 2개의 ViewModel DSL이 하나로 병합될 예정입니다.
:::

## 자동 또는 특정 바인딩

컴포넌트를 선언할 때 감지된 모든 "바인딩"(연관된 슈퍼타입)은 이미 준비되어 있습니다. 예를 들어 다음 정의를 살펴보겠습니다.

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin은 `MyComponent` 컴포넌트가 `MyInterface`에도 연결되어 있다고 선언합니다. DSL과 동일한 내용은 `single { MyComponent(get()) } bind MyInterface::class`입니다.

Koin이 자동으로 감지하도록 하는 대신 `binds` 어노테이션 파라미터를 사용하여 실제로 바인딩할 타입을 지정할 수도 있습니다.

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## Nullable 종속성

컴포넌트가 nullable 종속성을 사용하는 경우 걱정하지 마십시오. 자동으로 처리됩니다. 정의 어노테이션을 계속 사용하면 Koin이 수행할 작업을 추측합니다.

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

생성된 DSL과 동일한 내용은 `single { MyComponent(getOrNull()) }`입니다.

> 이는 주입된 파라미터와 프로퍼티에도 적용됩니다.

## @Named를 사용한 Qualifier

`@Named` 어노테이션을 사용하여 정의에 "이름"(Qualifier라고도 함)을 추가하여 동일한 타입에 대한 여러 정의를 구별할 수 있습니다.

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

종속성을 해결할 때 `named` 함수와 함께 Qualifier를 사용하십시오.

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

사용자 지정 Qualifier 어노테이션을 만들 수도 있습니다. 이전 예제를 사용하면 다음과 같습니다.

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

생성자 멤버에 "주입된 파라미터"로 태그를 지정할 수 있습니다. 이는 해결을 위해 호출할 때 그래프에서 종속성이 전달됨을 의미합니다.

예를 들어:

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

그런 다음 `MyDependency`의 인스턴스를 전달하여 `MyComponent`를 호출할 수 있습니다.

```kotlin
val m = MyDependency
// MyDependency를 전달하면서 MyComponent 해결
koin.get<MyComponent> { parametersOf(m) }
```

생성된 DSL과 동일한 내용은 `single { params -> MyComponent(params.get()) }`입니다.

## Lazy 종속성 주입 - `Lazy<T>`

Koin은 Lazy 종속성을 자동으로 감지하고 해결할 수 있습니다. 예를 들어 `LoggerDataSource` 정의를 느리게 해결하려고 합니다. 다음과 같이 `Lazy` Kotlin 타입을 사용하기만 하면 됩니다.

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

내부적으로 `get()` 대신 `inject()`를 사용하여 DSL을 생성합니다.

```kotlin
single { LoggerAggregator(inject()) }
```

## 종속성 목록 주입 - `List<T>`

Koin은 모든 종속성 목록을 자동으로 감지하고 해결할 수 있습니다. 예를 들어 모든 `LoggerDataSource` 정의를 해결하려고 합니다. 다음과 같이 `List` Kotlin 타입을 사용하기만 하면 됩니다.

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

내부적으로 `getAll()` 함수와 같은 DSL을 생성합니다.

```kotlin
single { LoggerAggregator(getAll()) }
```

## @Property를 사용한 프로퍼티

정의에서 Koin 프로퍼티를 해결하려면 생성자 멤버에 `@Property`로 태그를 지정하기만 하면 됩니다. 이렇게 하면 어노테이션에 전달된 값 덕분에 Koin 프로퍼티가 해결됩니다.

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

생성된 DSL과 동일한 내용은 `factory { ComponentWithProps(getProperty("id")) }`입니다.

### @PropertyValue - 기본값이 있는 프로퍼티 (1.4부터)

Koin Annotations는 `@PropertyValue` 어노테이션을 사용하여 코드에서 직접 프로퍼티에 대한 기본값을 정의할 수 있는 기능을 제공합니다.
샘플을 따라해 보겠습니다.

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

생성된 DSL과 동일한 내용은 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`입니다.