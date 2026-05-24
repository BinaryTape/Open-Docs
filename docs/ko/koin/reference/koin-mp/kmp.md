---
title: KMP 고급 패턴
---

# KMP 고급 패턴

이 가이드는 Kotlin 멀티플랫폼(Kotlin Multiplatform, KMP) 프로젝트에서 Koin을 사용하는 고급 패턴을 다룹니다.

:::info
기본 설정은 [KMP 설정](/docs/reference/koin-core/kmp-setup)을 참고하세요. 모듈 구성은 [공유 패턴](/docs/reference/koin-core/kmp-shared-modules)을, ViewModel은 [ViewModel](/docs/reference/koin-core/viewmodel)을 참고하세요.
:::

## 소스 프로젝트

:::info
여기에서 Kotlin 멀티플랫폼 프로젝트를 찾을 수 있습니다: https://github.com/InsertKoinIO/hello-kmp
:::

## 고급 expect/actual 패턴

기본적인 `expect val platformModule: Module` 패턴을 넘어, 플랫폼별 코드를 위한 고급 접근 방식은 다음과 같습니다.

### 패턴 1: expect/actual 클래스

플랫폼별 API(Android Context, iOS UIDevice 등)가 필요한 경우 사용합니다:

```kotlin
// commonMain - 선언
expect class PlatformContext

expect fun createPlatformModule(): Module

// androidMain - Android 구현체
actual class PlatformContext(val context: Context)

actual fun createPlatformModule() = module {
    single<PlatformContext>()  // 컴파일러 플러그인 DSL
}

// iosMain - iOS 구현체
actual class PlatformContext

actual fun createPlatformModule() = module {
    single<PlatformContext>()
}
```

### 패턴 2: 인터페이스 + 플랫폼 구현체

플랫폼별로 다른 구현체를 주입하고 싶을 때 사용합니다:

```kotlin
// commonMain - 인터페이스
interface Logger {
    fun log(message: String)
}

// androidMain
class AndroidLogger : Logger {
    override fun log(message: String) {
        android.util.Log.d("App", message)
    }
}

val androidModule = module {
    single<AndroidLogger>() bind Logger::class
}

// iosMain
class IOSLogger : Logger {
    override fun log(message: String) {
        println("iOS: $message")
    }
}

val iosModule = module {
    single<IOSLogger>() bind Logger::class
}
```

### 패턴 3: 어노테이션이 포함된 expect 모듈

더 깔끔한 코드를 위해 `expect`/`actual`을 어노테이션과 결합합니다:

```kotlin
// commonMain
expect val platformModule: Module

// androidMain
@Module
@ComponentScan("com.myapp.android")
class AndroidPlatformModule

actual val platformModule = AndroidPlatformModule().module

// iosMain
@Module
@ComponentScan("com.myapp.ios")
class IosPlatformModule

actual val platformModule = IosPlatformModule().module
```

:::info
**어떤 패턴을 언제 사용해야 하는가:**
- **expect/actual 클래스**: 플랫폼 API (Context, UIDevice), 단순한 플랫폼 차이
- **인터페이스**: 플랫폼별로 달라지는 비즈니스 로직, 테스트 가능한 코드
- **expect 모듈**: 복잡한 플랫폼별 의존성 그래프
:::

## 공유 코드의 Android Context

공유 코드에서 Android `Context`에 접근하는 것은 흔히 발생하는 요구사항입니다. 다음은 권장되는 패턴입니다:

### ContextWrapper 패턴

```kotlin
// commonMain - 래퍼 인터페이스
interface AppContext

// androidMain - Android 구현체
class AndroidAppContext(val context: Context) : AppContext

val androidContextModule = module {
    single<AndroidAppContext>() bind AppContext::class
}

// iosMain - 빈 구현체
class IOSAppContext : AppContext

val iosContextModule = module {
    single<IOSAppContext>() bind AppContext::class
}
```

공유 코드에서의 사용:

```kotlin
// commonMain - Repository에서 플랫폼 컨텍스트 사용
class FileRepository(private val appContext: AppContext) {
    fun saveFile(data: String) {
        when (appContext) {
            is AndroidAppContext -> {
                val file = File(appContext.context.filesDir, "data.txt")
                file.writeText(data)
            }
            is IOSAppContext -> {
                // iOS 전용 파일 작업
            }
        }
    }
}

val sharedModule = module {
    single<FileRepository>()
}
```

:::note
순수한 공유 로직의 경우, `when` 문을 사용하는 것보다 플랫폼 작업을 인터페이스로 추상화하는 것을 권장합니다.
:::

## 아키텍처 패턴

### Ktor를 이용한 Repository 패턴

```kotlin
// commonMain
interface UserRepository {
    suspend fun getUser(id: String): User
    suspend fun saveUser(user: User)
}

@Singleton
class UserRepositoryImpl(
    private val api: UserApi,
    private val database: UserDatabase
) : UserRepository {
    override suspend fun getUser(id: String): User {
        return try {
            api.fetchUser(id).also { database.saveUser(it) }
        } catch (e: Exception) {
            database.getUser(id)
        }
    }

    override suspend fun saveUser(user: User) {
        database.saveUser(user)
        api.updateUser(user)
    }
}

val dataModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

### 네트워크 레이어 (Ktor + Koin)

```kotlin
// commonMain
@Singleton
class ApiClient(private val client: HttpClient) {
    suspend fun fetchUser(id: String): User {
        return client.get("https://api.example.com/users/$id").body()
    }
}

val networkModule = module {
    single {
        HttpClient {
            install(ContentNegotiation) {
                json()
            }
        }
    }
    single<ApiClient>()
}
```

### 데이터베이스 레이어 (SqlDelight)

```kotlin
// commonMain
expect class DriverFactory {
    fun createDriver(): SqlDriver
}

val databaseModule = module {
    single { DriverFactory().createDriver() }
    single { AppDatabase(get()) }
    single { get<AppDatabase>().userQueries }
}

// androidMain
actual class DriverFactory(private val context: Context) {
    actual fun createDriver(): SqlDriver {
        return AndroidSqliteDriver(AppDatabase.Schema, context, "app.db")
    }
}

// iosMain
actual class DriverFactory {
    actual fun createDriver(): SqlDriver {
        return NativeSqliteDriver(AppDatabase.Schema, "app.db")
    }
}
```

## KMP 모듈 테스트

### 공유 모듈 유닛 테스트

```kotlin
// commonTest
class UserRepositoryTest : KoinTest {

    @Test
    fun testGetUser() = runTest {
        startKoin {
            modules(module {
                single<UserApi> { FakeUserApi() }
                single<UserDatabase> { FakeUserDatabase() }
                single<UserRepositoryImpl>() bind UserRepository::class
            })
        }

        val repository: UserRepository = get()
        val user = repository.getUser("123")

        assertEquals("John", user.name)

        stopKoin()
    }
}
```

### 플랫폼별 의존성 테스트

```kotlin
// commonTest
expect fun createTestPlatformModule(): Module

// androidTest
actual fun createTestPlatformModule() = module {
    single<PlatformContext> { TestAndroidContext() }
}

// iosTest
actual fun createTestPlatformModule() = module {
    single<PlatformContext> { TestIOSContext() }
}

// commonTest - 플랫폼 모듈을 사용한 테스트
class PlatformDependentTest : KoinTest {
    @Test
    fun testWithPlatformContext() {
        startKoin {
            modules(
                createTestPlatformModule(),
                module {
                    single<MyService>()
                }
            )
        }

        val service: MyService = get()
        // 서비스 테스트

        stopKoin()
    }
}
```

## 흔히 발생하는 실수 (Common Pitfalls)

### 권장 사항 (DO): 테스트 가능한 공유 코드를 위해 인터페이스 사용

```kotlin
// 좋음 - 테스트 가능
interface Logger {
    fun log(message: String)
}

val sharedModule = module {
    single<UserService>()  // Logger 인터페이스에 의존
}
```

### 금지 사항 (DON'T): 비즈니스 로직에 expect 클래스 사용

```kotlin
// 나쁨 - 테스트하기 어렵고 플랫폼 결합도가 높음
expect class Logger {
    fun log(message: String)
}
```

### 권장 사항 (DO): 플랫폼 모듈을 별도로 유지

```kotlin
// 좋음 - 명확한 분리
fun initKoin() {
    startKoin {
        modules(commonModules() + platformModule)
    }
}
```

### 금지 사항 (DON'T): 공유 모듈에 플랫폼별 코드를 혼합

```kotlin
// 나쁨 - commonMain에 플랫폼별 코드가 있음
val sharedModule = module {
    single {
        if (Platform.isAndroid) { /* ... */ } // 이렇게 하지 마세요!
    }
}
```

### 권장 사항 (DO): 대규모 앱의 경우 lazy 모듈 사용

```kotlin
// 좋음 - 시작 시 최적화
val lazyFeatureModule = lazyModule {
    single<HeavyService>()
}

startKoin {
    modules(coreModules)
    lazyModules(lazyFeatureModule)
}
```

### 금지 사항 (DON'T): scope 닫기를 잊지 마세요

```kotlin
// 나쁨 - 메모리 누수 발생
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()
    // scope를 닫는 것을 잊었습니다!
}

// 좋음 - 적절한 정리
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()

    fun onDestroy() {
        scope.close()
    }
}
```

## 데스크톱 플랫폼 통합

JVM 데스크톱 앱(Compose Desktop)의 경우:

```kotlin
// desktopMain
fun main() = application {
    startKoin {
        modules(
            sharedModule,
            desktopModule
        )
    }

    Window(onCloseRequest = ::exitApplication) {
        App()
    }
}

val desktopModule = module {
    single<DesktopLogger>() bind Logger::class
    single<DesktopFileManager>()
}
```

## 웹 플랫폼 통합 (실험적)

Kotlin/JS 및 Kotlin/WASM의 경우:

```kotlin
// jsMain 또는 wasmJsMain
fun main() {
    startKoin {
        modules(
            sharedModule,
            webModule
        )
    }
    // 웹 앱 초기화
}

val webModule = module {
    single<ConsoleLogger>() bind Logger::class
    single<BrowserStorage>()
}
```

:::warning
WASM 지원은 실험적입니다. 일부 기능이 예상대로 작동하지 않을 수 있습니다.
:::

## iOS Swift 상호운용성 (Interop)

### Swift를 위한 KoinComponent

```kotlin
// shared/src/iosMain/kotlin/Helper.kt
class GreetingHelper : KoinComponent {
    private val greeting: Greeting by inject()
    fun greet(): String = greeting.greeting()
}
```

Swift에서:

```swift
struct ContentView: View {
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### Swift에서 의존성 선언하기

어떤 경우에는 Swift에서 직접 의존성을 선언해야 할 수도 있습니다. 예를 들어, Swift 전용 클래스를 Koin에 등록해야 할 때입니다. `declare` 함수를 Kotlin/Native 상호운용성(interop)과 결합하여 Objective-C 타입을 Kotlin `KClass`로 변환하여 사용할 수 있습니다.

`iosMain`에 다음 헬퍼를 추가하세요:

```kotlin
// shared/src/iosMain/kotlin/KoinSwiftHelper.kt
@OptIn(BetaInteropApi::class)
fun Koin.declareFromSwift(
    instance: Any,
    bindTo: ObjCObject,
    qualifier: Qualifier? = null,
    allowOverride: Boolean = true
) {
    val kClass: KClass<*> = when (bindTo) {
        is ObjCClass -> getOriginalKotlinClass(bindTo)
        is ObjCProtocol -> getOriginalKotlinClass(bindTo)
        else -> null
    } ?: error("Can't resolve Kotlin KClass from $bindTo")

    declare(
        instance = instance,
        qualifier = qualifier,
        secondaryTypes = listOf(kClass),
        allowOverride = allowOverride
    )
}
```

그런 다음 Swift에서 클래스 또는 프로토콜 참조와 함께 이를 호출합니다:

```swift
koin.declareFromSwift(
    instance: MyService(),
    bindTo: MyServiceProtocol.self,
    qualifier: nil,
    allowOverride: true
)
```

:::note
이 방식은 `kotlin.native`의 `getOriginalKotlinClass()`를 사용하여 Objective-C 타입을 해당하는 Kotlin `KClass`로 매핑합니다. `bindTo` 파라미터는 `ObjCClass`(클래스의 `.self`) 또는 `ObjCProtocol`(프로토콜의 `.self`)을 모두 수용합니다.

최초 제안: [@SarahDelCastillo](https://github.com/InsertKoinIO/koin/issues/1108#issuecomment-3645990426).
:::

### 스레딩 고려 사항

iOS 및 기타 Native 타겟에서 Koin 인스턴스는 새로운 메모리 모델과 매끄럽게 작동합니다:

- Koin 정의(definition)는 스레드 세이프(thread-safe)합니다.
- Scope는 여러 스레드에 걸쳐 생성되고 사용될 수 있습니다.
- 필요한 경우 전역 Koin 인스턴스에 `@SharedImmutable`을 사용하세요.

:::note
새로운 Kotlin/Native 메모리 모델(Kotlin 1.7.20+ 기본값)은 Koin 사용을 훨씬 더 단순하게 만들어 줍니다.
:::

## 다음 단계

- **[KMP 설정](/docs/reference/koin-core/kmp-setup)** - 기본 KMP 구성
- **[공유 패턴](/docs/reference/koin-core/kmp-shared-modules)** - 모듈 구성
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 멀티플랫폼 ViewModel
- **[Compose용 Koin](/docs/reference/koin-compose/compose)** - Compose 통합
- **[KMP 어노테이션](/docs/reference/koin-annotations/kmp)** - KMP에서의 어노테이션 기반 DI