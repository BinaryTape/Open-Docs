[//]: # (title: 의존성 주입)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-di</code>
</p>
</tldr>

의존성 주입(DI) 플러그인을 사용하면 서비스와 구성 객체를 한 번 등록한 후, 프로젝트 전반의 애플리케이션 모듈, 플러그인, 라우트 및 기타 컴포넌트에 주입할 수 있습니다. Ktor의 DI는 기존 애플리케이션 라이프사이클과 자연스럽게 통합되도록 설계되었으며, 스코핑(scoping) 및 구조화된 구성(structured configuration)을 기본으로 지원합니다.

## 의존성 추가

DI를 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함합니다.

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>

## 기본 의존성 등록

람다, 함수 참조 또는 생성자 참조를 사용하여 의존성을 등록할 수 있습니다.

```kotlin
dependencies {
    // Lambda-based
    provide<GreetingService> { GreetingServiceImpl() }

    // Function references
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // Registering a lambda as a dependency
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 구성 기반 의존성 등록

구성 파일에서 클래스패스 참조를 사용하여 의존성을 선언적으로 구성할 수 있습니다. 이는 함수 참조와 클래스 참조를 모두 지원합니다.

```yaml
# application.yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
database:
  connectionUrl: postgres://localhost:3037/admin
```

```kotlin
// Repositories.kt
fun provideDatabase(@Property("database.connectionUrl") connectionUrl: String): Database =
  PostgresDatabase(connectionUrl)

class UserRepository(val db: Database) {
  // implementation 
}
```

Ktor는 DI 컨테이너를 사용하여 생성자 및 함수 파라미터를 자동으로 해결합니다. `@Property` 또는 `@Named`와 같은 어노테이션을 사용하여 특수 경우(예: 타입만으로는 값을 구분하기에 충분하지 않은 경우)에 파라미터를 재정의하거나 명시적으로 바인딩할 수 있습니다. 생략된 경우, Ktor는 DI 컨테이너를 사용하여 타입별로 파라미터를 해결하려고 시도합니다.

## 의존성 해결 및 주입

### 의존성 해결

의존성을 해결하려면 프로퍼티 위임(property delegation) 또는 직접 해결(direct resolution)을 사용할 수 있습니다.

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

### 비동기 의존성 해결

비동기 로딩을 지원하려면 중단 함수(suspending functions)를 사용할 수 있습니다.

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // suspends until provided
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 플러그인은 모든 의존성이 준비될 때까지 `resolve()` 호출을 자동으로 중단합니다.

### 애플리케이션 모듈에 주입

모듈 함수에 파라미터를 지정하여 애플리케이션 모듈에 의존성을 직접 주입할 수 있습니다. Ktor는 타입 매칭에 기반하여 DI 컨테이너에서 해당 의존성들을 해결합니다.

먼저, 구성의 `dependencies` 섹션에 의존성 제공자를 등록합니다.

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

다음은 의존성 제공자와 모듈 함수의 예시입니다.

```kotlin
// com.example.PrintStreamProvider.kt
fun stdout(): () -> PrintStream = { System.out }
```

```kotlin
// com.example.Logging.kt
fun Application.logging(printStreamProvider: () -> PrintStream) {
    dependencies {
        provide<Logger> { SimpleLogger(printStreamProvider()) }
    }
}
```

특정 키로 지정된 의존성을 주입하려면 `@Named`를 사용합니다.

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

### 프로퍼티 및 구성 주입

구성 값을 직접 주입하려면 `@Property`를 사용합니다.

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

이는 구조화된 구성 작업을 단순화하고 원시 타입의 자동 파싱을 지원합니다.

## 고급 의존성 기능

### 선택적 및 널러블 의존성

선택적 의존성을 유연하게 처리하려면 널러블 타입(nullable types)을 사용합니다.

```kotlin
// Using property delegation
val config: Config? by dependencies

// Or direct resolution
val config = dependencies.resolve<Config?>()
```

### 공변 제네릭

Ktor의 DI 시스템은 타입 공변성(type covariance)을 지원하며, 이는 타입 파라미터가 공변일 때 값을 해당 값의 상위 타입 중 하나로 주입할 수 있도록 합니다. 이는 서브타입과 함께 작동하는 컬렉션 및 인터페이스에 특히 유용합니다.

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// This will work due to type parameter covariance support
val stringList: List<CharSequence> by dependencies
// This will also work
val stringCollection: Collection<CharSequence> by dependencies
```

공변성은 비제네릭 상위 타입에서도 작동합니다.

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// This works because BufferedOutputStream is a subtype of OutputStream
val outputStream: OutputStream by dependencies
```

#### 제한 사항

DI 시스템은 제네릭 타입에 대한 공변성을 지원하지만, 현재 타입 인자 서브타입 전반에 걸쳐 파라미터화된 타입을 해결하는 것을 지원하지 않습니다. 즉, 등록된 타입보다 더 구체적이거나 더 일반적인 타입을 사용하여 의존성을 가져올 수 없습니다.

예를 들어, 다음 코드는 해결되지 않습니다.

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// Will not resolve
val charSequenceSink: Sink<String> by dependencies
```

## 리소스 라이프사이클 관리

DI 플러그인은 애플리케이션이 종료될 때 라이프사이클 및 정리를 자동으로 처리합니다.

### AutoCloseable 지원

기본적으로 `AutoCloseable`을 구현하는 모든 의존성은 애플리케이션이 중지될 때 자동으로 닫힙니다.

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // Close connections, release resources
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### 사용자 지정 정리 로직

`cleanup` 함수를 지정하여 사용자 지정 정리 로직을 정의할 수 있습니다.

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### 키를 사용한 스코프 정리

`key`를 사용하여 이름 지정된 리소스와 해당 리소스의 정리를 관리합니다.

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

의존성은 적절한 종료(teardown)를 보장하기 위해 선언된 순서의 역순으로 정리됩니다.

## 의존성 주입을 사용한 테스트

DI 플러그인은 테스트를 단순화하는 도구를 제공합니다. 애플리케이션 모듈을 로드하기 전에 의존성을 오버라이드(재정의)할 수 있습니다.

```kotlin
fun test() = testApplication {
  application {
    dependencies.provide<MyService> {
      MockService()
    }
    loadServices()
  }
}
```

### 테스트에서 구성 로드

`configure()`를 사용하여 테스트에서 구성 파일을 쉽게 로드할 수 있습니다.

```kotlin
fun test() = testApplication {
  // Load properties from the default config file path
  configure()
  // Load multiple files with overrides
  configure("root-config.yaml", "test-overrides.yaml")
}
```

충돌하는 선언은 테스트 엔진에 의해 무시되어 자유롭게 오버라이드할 수 있습니다.