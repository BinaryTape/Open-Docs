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

- `@Single` - 싱글톤 인스턴스 (DSL에서는 `single { }`로 선언)
- `@Factory` - 팩토리 인스턴스. 인스턴스가 필요할 때마다 재생성되는 인스턴스입니다. (DSL에서는 `factory { }`로 선언)
- `@KoinViewModel` - Android ViewModel 인스턴스 (DSL에서는 `viewModel { }`로 선언)
- `@KoinWorker` - Android Worker Workmanager 인스턴스 (DSL에서는 `worker { }`로 선언)

스코프에 대해서는 [스코프 선언](/docs/reference/koin-core/scopes.md) 섹션을 참조하세요.

### Kotlin Multiplatform용 Compose ViewModel 생성 (버전 1.4.0부터)

`@KoinViewModel` 어노테이션은 기본적으로 `koin-core-viewmodel`의 메인 DSL을 사용하여 ViewModel을 생성합니다 (2.2.0부터 활성화됨). 이는 Kotlin Multiplatform 호환성을 제공하며 통합 ViewModel API를 사용합니다.

`KOIN_USE_COMPOSE_VIEWMODEL` 옵션은 기본적으로 활성화되어 있습니다:

```groovy
ksp {
    // This is the default behavior since 2.2.0
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

이는 멀티플랫폼 호환성을 위해 `org.koin.compose.viewmodel.dsl.viewModel`로 `viewModel` 정의를 생성합니다.

:::info
- `KOIN_USE_COMPOSE_VIEWMODEL`은 어노테이션 2.2.0부터 기본적으로 활성화됩니다.
- 이는 모든 플랫폼에서 통합 ViewModel API와의 일관성을 보장합니다.
- 이전 `USE_COMPOSE_VIEWMODEL` 키는 제거되었습니다.
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
val m = MyDependency()
// Resolve MyComponent while passing MyDependency
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

생성된 DSL 동등 구문은 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`가 됩니다.

## JSR-330 호환성 어노테이션

Koin 어노테이션은 `koin-jsr330` 모듈을 통해 JSR-330 (Jakarta Inject) 호환 어노테이션을 제공합니다. 이 어노테이션은 Hilt, Dagger 또는 Guice와 같은 다른 JSR-330 호환 프레임워크에서 마이그레이션하는 개발자에게 특히 유용합니다.

### 설정

프로젝트에 `koin-jsr330` 의존성을 추가하세요:

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 사용 가능한 JSR-330 어노테이션

#### @Singleton (jakarta.inject.Singleton)

JSR-330 표준 싱글톤 어노테이션으로, Koin의 `@Single`과 동일합니다:

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

이는 `@Single`과 동일한 결과인 Koin의 싱글톤 인스턴스를 생성합니다.

#### @Named (jakarta.inject.Named)

문자열 기반 한정자(qualifier)를 위한 JSR-330 표준 한정자 어노테이션입니다:

```kotlin
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
@Named("inMemory")
class InMemoryCache : Cache

@Singleton  
@Named("redis")
class RedisCache : Cache
```

#### @Inject (jakarta.inject.Inject)

JSR-330 표준 주입 어노테이션입니다. Koin 어노테이션은 명시적인 생성자 마킹을 요구하지 않지만, `@Inject`는 JSR-330 호환성을 위해 사용될 수 있습니다:

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

커스텀 한정자 어노테이션을 생성하기 위한 메타 어노테이션입니다:

```kotlin
import jakarta.inject.Qualifier

@Qualifier
annotation class Database

@Qualifier  
annotation class Cache

@Singleton
@Database
class DatabaseConfig

@Singleton
@Cache  
class CacheConfig
```

#### @Scope (jakarta.inject.Scope)

커스텀 스코프 어노테이션을 생성하기 위한 메타 어노테이션입니다:

```kotlin
import jakarta.inject.Scope

@Scope
annotation class RequestScoped

// Koin의 스코프 시스템과 함께 사용
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 혼합 사용

동일한 프로젝트에서 JSR-330 어노테이션과 Koin 어노테이션을 자유롭게 혼합하여 사용할 수 있습니다:

```kotlin
// JSR-330 style
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin style  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// Mixed in same class
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### 프레임워크 마이그레이션 이점

JSR-330 어노테이션을 사용하면 프레임워크 마이그레이션에 여러 가지 이점을 제공합니다:

-   **익숙한 API**: Hilt, Dagger 또는 Guice에서 넘어온 개발자는 익숙한 어노테이션을 사용할 수 있습니다.
-   **점진적 마이그레이션**: 기존 JSR-330 어노테이션이 적용된 코드가 최소한의 변경으로 작동합니다.
-   **표준 준수**: JSR-330을 따르면 의존성 주입 표준과의 호환성이 보장됩니다.
-   **팀 온보딩**: 다른 DI 프레임워크에 익숙한 팀에게 더 쉽습니다.

:::info
Koin의 JSR-330 어노테이션은 Koin의 동등한 어노테이션과 동일한 기본 DSL을 생성합니다. JSR-330 어노테이션과 Koin 어노테이션 중 어떤 것을 선택할지는 순전히 스타일적인 선호도나 마이그레이션 요구 사항에 따라 달라집니다.
:::