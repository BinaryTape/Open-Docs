[//]: # (title: 의존성 주입)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-di</code>
</p>
</tldr>

의존성 주입(Dependency Injection, DI) 플러그인을 사용하면 서비스와 구성 객체를 한 번 등록한 후 프로젝트 전반의 애플리케이션 모듈, 플러그인, 라우트 및 기타 컴포넌트에 주입할 수 있습니다. Ktor의 DI는 기존 애플리케이션 수명 주기와 자연스럽게 통합되도록 설계되었으며, 기본적으로 스코핑(scoping) 및 구조화된 구성을 지원합니다.

## 의존성 추가

DI를 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함하세요:

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 기본 의존성 등록

람다, 함수 참조 또는 생성자 참조를 사용하여 의존성을 등록할 수 있습니다:

```kotlin
dependencies {
    // 람다 기반
    provide<GreetingService> { GreetingServiceImpl() }

    // 함수 참조
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // 람다 자체를 의존성으로 등록
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 구성 기반 의존성 등록

구성 파일에서 클래스패스 참조를 사용하여 의존성을 선언적으로 구성할 수 있습니다. 이는 함수와 클래스 참조를 모두 지원합니다:

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
  // 구현부
}
```

Ktor는 DI 컨테이너를 사용하여 생성자와 함수 파라미터를 자동으로 해결합니다. 타입만으로는 값을 구분하기 충분하지 않은 경우와 같이 특별한 상황에서는 `@Property` 또는 `@Named`와 같은 어노테이션을 사용하여 파라미터를 재정의하거나 명시적으로 바인딩할 수 있습니다. 어노테이션을 생략하면 Ktor는 DI 컨테이너를 사용하여 타입별로 파라미터 해결을 시도합니다.

## 의존성 해결 및 주입

### 의존성 해결

의존성을 해결하려면 프로퍼티 위임(property delegation) 또는 직접 해결을 사용할 수 있습니다:

```kotlin
// 프로퍼티 위임 사용
val service: GreetingService by dependencies

// 직접 해결
val service = dependencies.resolve<GreetingService>()
```

### 비동기 의존성 해결

비동기 로딩을 지원하기 위해 서스펜딩 함수(suspending functions)를 사용할 수 있습니다:

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // 제공될 때까지 일시 중단됨
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 플러그인은 모든 의존성이 준비될 때까지 `resolve()` 호출을 자동으로 일시 중단합니다.

### 애플리케이션 모듈에 주입

모듈 함수에 파라미터를 지정하여 애플리케이션 모듈에 직접 의존성을 주입할 수 있습니다. Ktor는 타입 매칭을 기반으로 DI 컨테이너에서 이러한 의존성을 해결합니다.

먼저, 구성의 `dependencies` 섹션에 의존성 제공자(provider)를 등록합니다:

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

의존성 제공자와 모듈 함수는 다음과 같습니다:

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

특정 키가 지정된 의존성을 주입하려면 `@Named`를 사용하세요:

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // "mongo"라는 이름의 의존성을 사용합니다.
}
```

### 프로퍼티 및 구성 주입

`@Property`를 사용하여 구성 값을 직접 주입할 수 있습니다:

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

이는 구조화된 구성 작업을 간소화하며 기본 타입의 자동 파싱을 지원합니다.

## 고급 의존성 기능

### 선택적 및 Null 허용 의존성

선택적 의존성을 유연하게 처리하려면 Null 허용 타입을 사용하세요:

```kotlin
// 프로퍼티 위임 사용
val config: Config? by dependencies

// 또는 직접 해결
val config = dependencies.resolve<Config?>()
```

### 공변 제네릭 (Covariant generics)

Ktor의 DI 시스템은 타입 공변성(type covariance)을 지원합니다. 이를 통해 타입 파라미터가 공변적일 때 값을 해당 상위 타입 중 하나로 주입할 수 있습니다. 이는 특히 하위 타입과 함께 작동하는 컬렉션 및 인터페이스에 유용합니다.

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 타입 파라미터 공변성 지원 덕분에 작동합니다.
val stringList: List<CharSequence> by dependencies
// 이 또한 작동합니다.
val stringCollection: Collection<CharSequence> by dependencies
```

공변성은 제네릭이 아닌 상위 타입과도 작동합니다:

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// BufferedOutputStream이 OutputStream의 하위 타입이므로 작동합니다.
val outputStream: OutputStream by dependencies
```

#### 제한 사항

DI 시스템은 제네릭 타입에 대한 공변성을 지원하지만, 현재 타입 인자 하위 타입 전반에 걸친 매개변수화된 타입(parameterized types) 해결은 지원하지 않습니다. 즉, 등록된 것보다 더 구체적이거나 더 일반적인 타입을 사용하여 의존성을 가져올 수 없음을 의미합니다.

예를 들어, 다음 코드는 해결되지 않습니다:

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 해결되지 않음
val charSequenceSink: Sink<String> by dependencies
```

## 리소스 수명 주기 관리

DI 플러그인은 애플리케이션이 종료될 때 수명 주기와 정리를 자동으로 처리합니다.

### AutoCloseable 지원

기본적으로 `AutoCloseable`을 구현하는 모든 의존성은 애플리케이션이 중지될 때 자동으로 닫힙니다:

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 연결 종료, 리소스 해제
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### 커스텀 정리 로직

`cleanup` 함수를 지정하여 커스텀 정리 로직을 정의할 수 있습니다:

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### 키를 사용한 스코프 정리

`key`를 사용하여 이름이 지정된 리소스와 해당 정리를 관리할 수 있습니다:

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

의존성은 선언된 역순으로 정리되어 적절한 해제가 이루어지도록 보장합니다.

## 의존성 주입을 사용한 테스트

DI 플러그인은 테스트를 간소화하는 도구를 제공합니다. 애플리케이션 모듈을 로드하기 전에 의존성을 재정의할 수 있습니다:

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

`configure()`를 사용하여 테스트에서 구성 파일을 쉽게 로드할 수 있습니다:

```kotlin
fun test() = testApplication {
  // 기본 구성 파일 경로에서 프로퍼티 로드
  configure()
  // 재정의가 포함된 여러 파일 로드
  configure("root-config.yaml", "test-overrides.yaml")
}
```

충돌하는 선언은 테스트 엔진에서 무시되므로 자유롭게 재정의할 수 있습니다.