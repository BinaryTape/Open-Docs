---
title: 어노테이션을 이용한 정의
---

Koin 어노테이션을 사용하면 일반적인 Koin DSL과 동일한 종류의 정의를 어노테이션으로 선언할 수 있습니다. 클래스에 필요한 어노테이션을 태깅하기만 하면, 모든 것이 자동으로 생성됩니다!

예를 들어, DSL 선언인 `single { MyComponent(get()) }`와 동일한 작업은 다음과 같이 `@Single`을 태깅하는 것만으로 처리할 수 있습니다:

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin 어노테이션은 Koin DSL과 동일한 시맨틱(semantics)을 유지합니다. 다음 정의들을 사용하여 컴포넌트를 선언할 수 있습니다:

- `@Single` - 싱글톤 인스턴스 (DSL의 `single { }`로 선언됨)
- `@Factory` - 팩토리 인스턴스. 인스턴스가 필요할 때마다 매번 새로 생성됩니다. (DSL의 `factory { }`로 선언됨)
- `@KoinViewModel` - 안드로이드 ViewModel 인스턴스 (DSL의 `viewModel { }`로 선언됨)
- `@KoinWorker` - 안드로이드 Worker Workmanager 인스턴스 (DSL의 `worker { }`로 선언됨)

스코프(Scope)에 대해서는 [스코프 선언하기](/docs/reference/koin-core/scopes) 섹션을 확인하세요.

## 최상위 함수 어노테이션(Annotated Top-Level Functions)

어노테이션은 클래스뿐만 아니라 **최상위 함수(top-level functions)**에서도 작동합니다. 이는 외부 라이브러리나 빌더 패턴에서 인스턴스를 제공할 때 유용합니다. 최상위 함수는 클래스와 마찬가지로 `@ComponentScan`에 의해 감지됩니다:

```kotlin
import org.koin.core.annotation.Singleton
import org.koin.core.annotation.Factory
import org.koin.core.annotation.Named

// Room 데이터베이스 인스턴스 제공
@Singleton
fun provideDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()

// JSON 직렬화 도구 제공
@Singleton
fun provideJson(): Json = Json { ignoreUnknownKeys = true }

// HTTP 클라이언트 제공
@Singleton
@Named("api")
fun provideHttpClient(json: Json): HttpClient = HttpClient { install(ContentNegotiation) { json(json) } }
```

파라미터는 DI 컨테이너에서 자동으로 해결(resolve)됩니다. 한정자(Qualifier, `@Named`, 커스텀 `@Qualifier`)는 함수와 파라미터 모두에 적용할 수 있습니다.

## 모듈 함수 (제공자 함수)

`@Module` 클래스 내부에서 `@Singleton`, `@Factory` 등의 어노테이션이 붙은 함수는 Dagger/Hilt의 `@Provides`와 유사한 제공자 함수(provider functions) 역할을 합니다:

```kotlin
import org.koin.core.annotation.Module
import org.koin.core.annotation.Singleton

@Module
internal object DatabaseModule {

    @Singleton
    fun providesDatabase(context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()
}

@Module(includes = [DatabaseModule::class])
class DaosModule {

    @Singleton
    fun providesTopicDao(database: AppDatabase): TopicDao = database.topicDao()

    @Singleton
    fun providesNewsDao(database: AppDatabase): NewsResourceDao = database.newsResourceDao()
}
```

이는 직접 어노테이션을 추가할 수 없는 외부 라이브러리(Room, Retrofit, OkHttp 등)를 래핑할 때 사용하는 패턴입니다.

## 커스텀 한정자 어노테이션 (Custom Qualifier Annotations)

`@Named` 외에도 `@Qualifier`를 사용하여 파라미터가 있는 커스텀 한정자 어노테이션을 만들 수 있습니다:

```kotlin
import org.koin.core.annotation.Qualifier

@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class Dispatcher(val niaDispatcher: NiaDispatchers)

enum class NiaDispatchers { Default, IO }
```

제공자 함수와 주입 지점(injection points)에서 이를 사용합니다:

```kotlin
import org.koin.core.annotation.Module
import org.koin.core.annotation.Configuration
import org.koin.core.annotation.Singleton

@Module
@Configuration
class DispatchersModule {

    @Singleton
    @Dispatcher(NiaDispatchers.IO)
    fun providesIODispatcher(): CoroutineDispatcher = Dispatchers.IO

    @Singleton
    @Dispatcher(NiaDispatchers.Default)
    fun providesDefaultDispatcher(): CoroutineDispatcher = Dispatchers.Default

    @Singleton
    fun providesApplicationScope(
        @Dispatcher(NiaDispatchers.Default) dispatcher: CoroutineDispatcher,
    ): CoroutineScope = CoroutineScope(SupervisorJob() + dispatcher)
}
```

커스텀 한정자는 컴파일 타임에 검증됩니다. 제공자의 한정자와 주입 지점의 한정자가 일치하지 않으면 빌드 에러가 발생합니다.

### Kotlin 멀티플랫폼을 위한 ViewModel

`@KoinViewModel` 어노테이션은 통합된 `koin-core-viewmodel` API를 사용하여 ViewModel을 생성하며, Kotlin 멀티플랫폼 호환성을 제공합니다.

```kotlin
@KoinViewModel
class UserViewModel(val repository: UserRepository) : ViewModel()
```

이는 안드로이드와 Compose 멀티플랫폼 모두와 호환되는 `viewModel` 정의를 생성합니다.

## 자동 또는 특정 바인딩

컴포넌트를 선언할 때, 감지된 모든 "바인딩"(연관된 상위 타입)이 이미 준비됩니다. 예를 들어, 다음과 같은 정의가 있다면:

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin은 `MyComponent` 컴포넌트가 `MyInterface`에도 연결되어 있음을 선언합니다. DSL로는 `single { MyComponent(get()) } bind MyInterface::class`와 동일합니다.

Koin이 자동으로 감지하도록 하는 대신, `binds` 어노테이션 파라미터를 사용하여 실제로 바인딩하려는 타입을 직접 지정할 수도 있습니다:

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## Nullable 의존성

컴포넌트가 nullable 의존성을 사용하더라도 자동으로 처리되니 걱정하지 마세요. 정의 어노테이션을 그대로 사용하면 Koin이 어떻게 처리할지 판단합니다:

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

생성된 DSL은 `single { MyComponent(getOrNull()) }`과 동일합니다.

> 참고: 이는 주입된 파라미터(injected Parameters)와 프로퍼티(properties)에도 적용됩니다.

## @Named를 사용한 한정자(Qualifier)

동일한 타입에 대한 여러 정의를 구분하기 위해 `@Named` 어노테이션을 사용하여 정의에 "이름"(한정자라고도 함)을 추가할 수 있습니다:

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

의존성을 해결(resolve)할 때는 `named` 함수와 함께 한정자를 사용하면 됩니다:

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

커스텀 한정자 어노테이션을 만드는 것도 가능합니다. 이전 예제를 사용하면 다음과 같습니다:

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

생성자 멤버를 "주입된 파라미터(injected parameter)"로 태깅할 수 있습니다. 이는 의존성 해결을 요청할 때 해당 의존성이 그래프에 전달됨을 의미합니다.

예를 들어:

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

그런 다음 `MyComponent`를 호출할 때 `MyDependency`의 인스턴스를 전달할 수 있습니다:

```kotlin
val m = MyDependency()
// MyDependency를 전달하며 MyComponent 해결
koin.get<MyComponent> { parametersOf(m) }
```

생성된 DSL은 `single { params -> MyComponent(params.get()) }`과 동일합니다.

## 지연 의존성 주입 - `Lazy<T>`

Koin은 지연 의존성을 자동으로 감지하고 해결할 수 있습니다. 예를 들어, 여기서는 `LoggerDataSource` 정의를 지연해서 해결하고자 합니다. 다음과 같이 Kotlin의 `Lazy` 타입을 사용하기만 하면 됩니다:

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

내부적으로는 `get()` 대신 `inject()`를 사용하는 DSL을 생성합니다:

```kotlin
single { LoggerAggregator(inject()) }
```

## 의존성 리스트 주입 - `List<T>`

Koin은 의존성 리스트를 자동으로 감지하고 해결할 수 있습니다. 예를 들어, 여기서는 모든 `LoggerDataSource` 정의를 해결하고자 합니다. 다음과 같이 `List` Kotlin 타입을 사용하기만 하면 됩니다:

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

내부적으로는 `getAll()` 함수를 사용하는 DSL을 생성합니다:

```kotlin
single { LoggerAggregator(getAll()) }
```

## @Property를 사용한 프로퍼티

정의에서 Koin 프로퍼티를 해결하려면 생성자 멤버에 `@Property`를 태깅하면 됩니다. 어노테이션에 전달된 값을 통해 Koin 프로퍼티를 해결하게 됩니다:

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

생성된 DSL은 `factory { ComponentWithProps(getProperty("id")) }`와 동일합니다.

### @PropertyValue - 기본값이 있는 프로퍼티 (1.4부터)

Koin 어노테이션은 `@PropertyValue` 어노테이션을 통해 코드에서 직접 프로퍼티의 기본값을 정의할 수 있는 기능을 제공합니다.
예제를 살펴보겠습니다:

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

생성된 DSL은 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`와 동일합니다.

## JSR-330 호환 어노테이션

Koin 어노테이션은 `koin-jsr330` 모듈을 통해 JSR-330(Jakarta Inject) 호환 어노테이션을 제공합니다. 이 어노테이션들은 Hilt, Dagger 또는 Guice와 같은 다른 JSR-330 호환 프레임워크에서 마이그레이션하는 개발자들에게 특히 유용합니다.

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

이는 Koin에서 싱글톤 인스턴스라는 `@Single`과 동일한 결과를 생성합니다.

#### @Named (jakarta.inject.Named)

문자열 기반 한정자를 위한 JSR-330 표준 한정자 어노테이션입니다:

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

JSR-330 표준 주입 어노테이션입니다. Koin 어노테이션은 명시적인 생성자 마킹이 필요하지 않지만, JSR-330 호환성을 위해 `@Inject`를 사용할 수 있습니다:

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

커스텀 한정자 어노테이션을 만들기 위한 메타 어노테이션입니다:

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

커스텀 스코프 어노테이션을 만들기 위한 메타 어노테이션입니다:

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
// JSR-330 스타일
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin 스타일  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// 동일 클래스 내 혼합 사용
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### 프레임워크 마이그레이션의 이점

JSR-330 어노테이션을 사용하면 프레임워크 마이그레이션 시 다음과 같은 몇 가지 장점이 있습니다:

- **익숙한 API**: Hilt, Dagger 또는 Guice를 사용하던 개발자들이 익숙한 어노테이션을 사용할 수 있습니다.
- **점진적 마이그레이션**: 기존의 JSR-330 어노테이션이 적용된 코드를 최소한의 수정으로 그대로 사용할 수 있습니다.
- **표준 준수**: JSR-330을 따르면 의존성 주입 표준과의 호환성을 보장합니다.
- **팀 온보딩**: 다른 DI 프레임워크에 익숙한 팀원들이 더 쉽게 적응할 수 있습니다.

:::info
Koin의 JSR-330 어노테이션은 해당 Koin 어노테이션과 동일한 기본 DSL을 생성합니다. JSR-330과 Koin 어노테이션 중 무엇을 선택할지는 순전히 스타일의 문제이며, 팀의 선호도나 마이그레이션 요구 사항에 따라 결정하면 됩니다.
:::