---
title: 한정자 (Qualifiers)
---

# 한정자 (Qualifiers)

한정자(Qualifiers)를 사용하면 Koin 모듈 내에서 동일한 타입의 여러 정의를 구분할 수 있습니다.

## 한정자가 필요한 경우

다음과 같은 상황에서 한정자가 필요합니다:
- 동일한 인터페이스의 구현체가 여러 개인 경우
- 동일한 타입에 대해 서로 다른 설정이 필요한 경우
- 목적이 다른 인스턴스들을 구분하고 싶은 경우

```kotlin
// 한정자가 없는 경우 - 충돌 발생!
val networkModule = module {
    single { OkHttpClient.Builder()...build() }
    single { OkHttpClient.Builder()...build() }  // 어떤 것을 사용해야 할까요?
}
```

## 이름 기반 한정자 (Named Qualifiers)

`named()`를 사용하여 정의를 구분합니다:

### 정의하기

```kotlin
import org.koin.core.qualifier.named

val networkModule = module {
    single(named("encrypted")) {
        OkHttpClient.Builder()
            .addInterceptor(EncryptionInterceptor())
            .build()
    }

    single(named("logging")) {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .build()
    }
}
```

### 주입하기

```kotlin
// 모듈 정의에서
val apiModule = module {
    single {
        ApiService(
            encryptedClient = get(named("encrypted")),
            loggingClient = get(named("logging"))
        )
    }
}

// KoinComponent와 함께 사용 시
class MyService : KoinComponent {
    private val encryptedClient: OkHttpClient by inject(named("encrypted"))
}
```

### 어노테이션과 함께 사용하기

```kotlin
import org.koin.core.annotation.Named
import org.koin.core.annotation.Single

@Single
@Named("encrypted")
class EncryptedHttpClient : OkHttpClient()

@Single
@Named("logging")
class LoggingHttpClient : OkHttpClient()

@Single
class ApiService(
    @Named("encrypted") private val encryptedClient: OkHttpClient,
    @Named("logging") private val loggingClient: OkHttpClient
)
```

:::note
컴파일러 플러그인 DSL 및 클래식 DSL 자동 연결(`singleOf`, `factoryOf`)의 경우, 한정자는 자동으로 해결될 수 없습니다. 정의에 한정자가 필요한 경우 람다를 사용하는 클래식 DSL이나 어노테이션을 사용하세요.
:::

## 타입 안전 한정자 (Type-Safe Qualifiers)

### 타입 사용하기

어떤 타입이든 `named<T>()`와 함께 한정자로 사용할 수 있습니다:

```kotlin
// 한정자 타입 정의
object EncryptedClient
object LoggingClient

val networkModule = module {
    single(named<EncryptedClient>()) {
        OkHttpClient.Builder()
            .addInterceptor(EncryptionInterceptor())
            .build()
    }

    single(named<LoggingClient>()) {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .build()
    }
}

// 주입
val client: OkHttpClient = get(named<EncryptedClient>())
```

### 열거형(Enums) 사용하기

더 나은 IDE 지원을 위해 열거형을 사용하세요:

```kotlin
enum class NetworkClient {
    ENCRYPTED,
    LOGGING,
    FAST
}

val networkModule = module {
    single(named(NetworkClient.ENCRYPTED)) {
        OkHttpClient.Builder()
            .addInterceptor(EncryptionInterceptor())
            .build()
    }

    single(named(NetworkClient.LOGGING)) {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .build()
    }
}

// 주입 - 오타 발생 가능성 없음!
val client: OkHttpClient = get(named(NetworkClient.ENCRYPTED))
```

**타입 안전 한정자의 장점:**
- 컴파일 타임 타입 안전성
- 문자열 오타 방지
- IDE 자동 완성 및 리팩터링 지원

## JSR-330 @Qualifier

Koin은 표준 JSR-330 `@Qualifier` 어노테이션을 지원합니다:

```kotlin
import jakarta.inject.Qualifier

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class EncryptedClient

// 정의에서 사용
@Single
@IoDispatcher
fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO

// 주입에서 사용
@Single
class MyRepository(
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
)
```

## 일반적인 유스케이스

### 여러 API 버전

```kotlin
val networkModule = module {
    single(named("api_v1")) {
        Retrofit.Builder()
            .baseUrl("https://api.example.com/v1/")
            .build()
    }

    single(named("api_v2")) {
        Retrofit.Builder()
            .baseUrl("https://api.example.com/v2/")
            .build()
    }
}
```

### 서로 다른 타임아웃 설정

```kotlin
val networkModule = module {
    single(named("fast")) {
        OkHttpClient.Builder()
            .connectTimeout(5, TimeUnit.SECONDS)
            .build()
    }

    single(named("slow")) {
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }
}
```

### 환경별 설정

```kotlin
val configModule = module {
    single(named("debug")) {
        AppConfig(apiUrl = "https://dev.example.com", loggingEnabled = true)
    }

    single(named("release")) {
        AppConfig(apiUrl = "https://api.example.com", loggingEnabled = false)
    }

    // 환경에 따라 선택
    single<AppConfig> {
        if (isDebug) get(named("debug")) else get(named("release"))
    }
}
```

## 권장 사항 (Best Practices)

### 1. 한정자는 꼭 필요한 경우에만 사용하세요

```kotlin
// 좋음 - 꼭 필요한 경우에만 한정자 사용
val appModule = module {
    single { UserRepository(get()) }  // 한정자 불필요
    single { AuthRepository(get()) }   // 서로 다른 타입
}

// 과도한 한정자 사용 - 피하세요
val appModule = module {
    single(named("user_repository")) { UserRepository(get()) }
    single(named("auth_repository")) { AuthRepository(get()) }
    // 불필요함 - 타입이 이미 서로 다름
}
```

### 2. 타입 차별화를 선호하세요

```kotlin
// 더 좋음 - 서로 다른 타입 사용
interface EncryptedHttpClient
interface LoggingHttpClient

class EncryptedOkHttpClient : OkHttpClient(), EncryptedHttpClient
class LoggingOkHttpClient : OkHttpClient(), LoggingHttpClient

val networkModule = module {
    single<EncryptedHttpClient> { EncryptedOkHttpClient() }
    single<LoggingHttpClient> { LoggingOkHttpClient() }
}
```

### 3. 한정자 체인을 피하세요

```kotlin
// 나쁨 - 복잡한 한정자 의존성
val badModule = module {
    single(named("a")) { A() }
    single(named("b")) { B(get(named("a"))) }
    single(named("c")) { C(get(named("b"))) }
}

// 좋음 - 구조를 단순화하거나 서로 다른 타입 사용
val goodModule = module {
    single { A() }
    single { B(get()) }
    single { C(get()) }
}
```

### 4. 한정자에 대해 설명(문서화)하세요

```kotlin
val networkModule = module {
    // 암호화를 사용하는 보안 API 호출용 클라이언트
    single(named("encrypted")) { ... }

    // 전체 요청/응답 로깅을 포함하는 디버깅용 클라이언트
    single(named("logging")) { ... }
}
```

## 명명 규칙 (Naming Conventions)

### 문자열 기반

```kotlin
// 좋음 - 설명적이며 언더바를 사용한 소문자
single(named("encrypted_client")) { ... }
single(named("user_database")) { ... }
single(named("api_v2")) { ... }

// 피함 - 불분명하거나 일관성 없음
single(named("client1")) { ... }  // "1"이 무엇을 의미하는지 알 수 없음
```

### 열거형 기반

```kotlin
// 좋음 - 명확한 열거형 이름
enum class DatabaseType {
    USER_DATA,
    CACHE,
    ANALYTICS
}

enum class ApiVersion {
    V1, V2, V3
}
```

## 흔히 발생하는 실수

### 주입 시 한정자 누락

```kotlin
val module = module {
    single(named("encrypted")) { OkHttpClient() }
}

val repoModule = module {
    single {
        MyRepository(get())  // ❌ 오류: OkHttpClient에 대한 정의를 찾을 수 없음
        // 다음과 같아야 함: get(named("encrypted"))
    }
}
```

### 한정자 이름 불일치

```kotlin
val module = module {
    single(named("encrypted_client")) { OkHttpClient() }
}

val repoModule = module {
    single {
        ApiService(
            get(named("encrypted"))  // ❌ 오타! "encrypted_client"여야 함
        )
    }
}
```

오타를 방지하려면 열거형 한정자를 사용하세요!

## 다음 단계

- **[정의 (Definitions)](/docs/reference/koin-core/definitions)** - 정의 타입 및 바인딩
- **[모듈 (Modules)](/docs/reference/koin-core/modules)** - 모듈 구성
- **[주입 (Injection)](/docs/reference/koin-core/injection)** - 의존성 가져오기