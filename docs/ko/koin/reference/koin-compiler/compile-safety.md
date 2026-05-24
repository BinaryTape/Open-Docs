---
title: 컴파일 타임 안정성
---

Koin 컴파일러 플러그인은 컴파일 타임에 의존성 그래프를 검증하여, 앱이 실행되기 전에 누락된 의존성, 한정자(qualifier) 불일치 및 잘못된 호출 지점(call site)을 찾아냅니다.

이는 `verify()` 및 `checkModules()`와 같은 런타임 검증 도구를 대체합니다. 컴파일이 된다면, 정상적으로 작동함을 의미합니다.

## 작동 방식

플러그인은 컴파일 중에 세 가지 수준에서 그래프를 검증합니다.

### A2 — 모듈별 검증 (조기 피드백)

각 모듈의 정의는 해당 모듈에서 볼 수 있는 정의(자신의 정의, 명시적으로 포함된 모듈, `@Configuration` 형제 모듈)를 기준으로 체크됩니다.

```kotlin
@Module(includes = [DataModule::class])
@ComponentScan("app")
class AppModule
// 검증: AppModule + DataModule의 정의들
```

`@Configuration` 레이블을 공유하는 모듈은 서로를 볼 수 있습니다.

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule  // Repository 제공

@Module @ComponentScan("service") @Configuration("prod")
class ServiceModule  // Service(repo: Repository) → OK, CoreModule에서 보임
```

서로 다른 레이블은 격리됩니다.

```kotlin
@Configuration("core")
class CoreModule

@Configuration("service")  // 다른 레이블 — CoreModule을 볼 수 없음
class ServiceModule         // Service(repo: Repository) → 오류(ERROR)
```

**A2가 포착하는 사항:**

- 누락된 의존성
- 한정자 불일치 (`@Named("prod")`를 요청했지만 `@Named("test")`만 제공된 경우 등)
- 크로스 스코프(Cross-scope) 위반
- `T`가 제공되지 않은 `Lazy<T>`
- `@Provided`로 표시되지 않은 외부 의존성

### A3 — 전체 그래프 (완전한 보장)

`startKoin<T>()` 호출 시, 모든 소스의 모든 모듈이 조립되어 전체 그래프가 검증됩니다. A2에서 볼 수 없었던 모듈 간 의존성, JAR의 정의 등이 여기서 체크됩니다.

```kotlin
@KoinApplication(modules = [CoreModule::class, ServiceModule::class])
object MyApp

startKoin<MyApp> { }
// 검증: CoreModule + ServiceModule이 결합된 모든 정의
```

A3는 DSL 정의(`single<T>()`, `factory<T>()` 등)가 그래프의 일부일 때 이들도 함께 검증합니다.

### A4 — 호출 지점 검증 (Call-Site Validation)

코드베이스의 모든 `koinViewModel<T>()`, `get<T>()`, `inject<T>()` 호출을 가로챕니다. 플러그인은 대상 타입, 파일, 라인 및 컬럼 정보를 캡처한 다음, 조립된 그래프에 `T`가 존재하는지 확인합니다.

```kotlin
@Composable
fun UserScreen() {
    val viewModel: UserViewModel = koinViewModel()  // ← A4가 이를 검증함
}

class MyFragment : Fragment() {
    val service: PaymentService by inject()  // ← A4가 이를 검증함
}
```

만약 `UserViewModel`이 그래프에 없다면, 정확한 파일, 라인, 컬럼 정보와 함께 빌드 오류가 발생합니다.

**모듈 간 호출 지점:** 기능 모듈이 `koinViewModel<T>()`을 호출하지만 전체 그래프에 대한 가시성이 없는 경우, 플러그인은 호출 지점 힌트(call-site hint)를 생성합니다. 앱 모듈이 컴파일될 때 의존성 JAR에서 이러한 힌트들을 발견하고 전체 그래프를 기준으로 검증합니다.

## 검증 대상

| 시나리오 | 결과 |
|----------|--------|
| Null 허용 안 함 파라미터, 정의 없음 | **오류(ERROR)** |
| Null 허용 파라미터(`T?`), 정의 없음 | OK — `getOrNull()` 사용 |
| 기본값이 있는 파라미터, 정의 없음 | OK — Kotlin 기본값 사용 (`skipDefaultValues=true`인 경우) |
| `@InjectedParam`, 정의 없음 | OK — 런타임에 `parametersOf()`를 통해 제공됨 |
| `@Property("key")` 파라미터 | OK — 프로퍼티 주입 (`@PropertyValue` 기본값이 없으면 경고) |
| `List<T>` 파라미터 | OK — 정의가 없으면 `getAll()`이 빈 리스트 반환 |
| `Lazy<T>`, `T`에 대한 정의 없음 | **오류(ERROR)** — 내부 타입을 검증하기 위해 래핑을 해제함 |
| `@Named("x")` 파라미터, 일치하는 한정자 없음 | **오류(ERROR)** — 한정자가 없는 바인딩이 존재하면 힌트 제공 |
| 잘못된 스코프의 스코프 의존성 | **오류(ERROR)** |
| `@Named` 한정자가 있는 기본값 파라미터 | **오류(ERROR)** — 한정자가 주입을 강제함 |
| `@Provided` 타입 또는 파라미터, 정의 없음 | OK — 런타임에 외부에서 제공됨 |
| `@ScopeId(name = "x")` 파라미터 | OK — 런타임에 이름이 지정된 스코프에서 확인됨 |
| `Scope` 타입 파라미터 | OK — 스코프 리시버가 직접 전달됨 |
| Android 프레임워크 타입 (예: `Context`) | OK — 하드코딩된 화이트리스트 |
| 순환 의존성 (A → B → A) | **오류(ERROR)** — A2/A3 그래프 탐색 중에 감지됨 |

## 애노테이션을 통한 안정성

클래스에 애노테이션을 달고 모듈로 구성하면 컴파일러가 모든 것을 검증합니다.

```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val db: Database)

@KoinViewModel
class UserViewModel(private val repo: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

플러그인은 `@ComponentScan`을 통해 애노테이션이 달린 클래스를 찾아내고, A2에서 각 모듈의 정의를 검증하며, 애플리케이션 진입점을 선언할 때 A3에서 전체 그래프를 검증합니다.

```kotlin
@KoinApplication(modules = [AppModule::class])
object MyApp

startKoin<MyApp> { }  // ← A3 전체 그래프 검증을 트리거함
```

**최상위 함수(Top-level functions)**도 지원됩니다. 애노테이션이 달린 최상위 함수는 `@ComponentScan`에 의해 발견되며 클래스 정의와 동일하게 검증됩니다.

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)
// ← 검증됨: DatabaseService가 존재함
```

`@Configuration` 레이블을 사용하여 모듈을 함께 검증할 그룹으로 구성할 수 있습니다.

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule

@Module @ComponentScan("feature") @Configuration("prod")
class FeatureModule  // CoreModule의 정의를 볼 수 있음
```

## DSL을 통한 안정성

컴파일러 플러그인은 DSL 정의도 검증합니다. `single<T>()`, `factory<T>()` 또는 `viewModel<T>()`를 작성하면 플러그인이 호출을 가로채서 생성자를 자동으로 연결(auto-wire)하고 모든 파라미터를 검증합니다.

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()       // ← 검증됨: Database가 존재함
    viewModel<UserViewModel>()     // ← 검증됨: UserRepository가 존재함
}
```

수동으로 `get()`을 호출할 필요가 없습니다. 플러그인이 이를 생성하는 동시에 검증합니다.

`create(::T)` 함수도 검증됩니다. 이 함수는 함수 참조(일반적으로 빌더 함수이지만 생성자일 수도 있음)를 호출하고 모든 파라미터를 검증합니다.

```kotlin
fun buildUserRepository(db: Database): UserRepository = UserRepository(db)

val appModule = module {
    scope<UserSession> {
        scoped { create(::buildUserRepository) }  // ← 검증됨: Database가 존재함
    }
}
```

DSL 정의는 A3 검증(전체 그래프) 및 A4 검증(호출 지점)에 참여합니다. `startKoin { modules(appModule) }`을 사용하면 플러그인은 조립된 그래프를 기반으로 모든 DSL 정의를 검증합니다.

## 두 스타일의 혼용

한 프로젝트 내에서 애노테이션과 DSL을 혼합하여 사용할 수 있습니다. 둘 다 동일한 검증 그래프로 수집됩니다.

```kotlin
// 애노테이션
@Singleton class Database

// DSL
val featureModule = module {
    single<UserRepository>()  // ← 검증됨: 애노테이션으로 생성된 Database가 보임
}
```

## 오류 메시지

오류는 누락된 타입, 해당 타입이 필요한 정의, 그리고 어떤 모듈에 있는지 보고합니다.

```
[Koin] Missing dependency: Repository
  required by: Service (parameter 'repo')
  in module: ServiceModule
```

다른 한정자로 바인딩이 존재하는 경우 힌트가 표시됩니다.

```
[Koin] Missing dependency: NetworkClient (qualifier: @Named("http"))
  required by: ApiService (parameter 'client')
  in module: AppModule
  Hint: Found NetworkClient without qualifier — did you mean to add @Named("http")?
```

호출 지점 오류에는 정확한 위치가 포함됩니다.

```
[Koin] Missing definition: com.app.UserRepository
  resolved by: koinViewModel<UserViewModel>()
  No matching definition found in any declared module.
  → file: UserScreen.kt, line: 12, column: 5
```

## 금지된 정의

일부 반환 타입은 Koin을 통해 의미 있게 해석될 수 없으며 컴파일 타임에 거부됩니다.

### KOIN-D007: suspend `fun interface`를 반환하는 `@Factory`

suspend `fun interface`를 확장하는 타입을 반환하는 `@Factory`는 Koin의 동기식 `get<T>()` API를 통해 호출될 수 없습니다. 플러그인은 이를 컴파일 타임에 차단합니다.

```kotlin
fun interface AsyncTask { suspend operator fun invoke(): Result }

@Factory
fun provideTask(): AsyncTask = AsyncTask { ... }
// KOIN-D007 — 오류: @Factory 반환 타입은 suspend fun interface를 확장할 수 없습니다.
```

일반 인터페이스로 리팩터링하거나, suspend 메서드가 있는 클래스를 통해 suspend 작업을 노출하세요.

## 제네릭 DSL 타입

런타임 Koin은 **소거된 로우 클래스(erased raw class)**를 기반으로 정의를 해석합니다. 즉, 타입 파라미터는 조회 키의 일부가 아닙니다. 컴파일 안정성도 이를 따릅니다. `get<Box<X>>()` 호출은 그래프 내의 모든 `Box<*>` 공급자를 대상으로 검증되며, `single<Box<A>>()`와 `single<Box<B>>()`라는 두 개의 선언은 충돌합니다(동일한 로우 클래스, 한정자 없음).

```kotlin
class Box<T>(val value: T)

val appModule = module {
    single { Box(42) }   // Box(raw)로 등록됨
}

koin.get<Box<Int>>()    // → 등록된 단일 Box를 반환
koin.get<Box<String>>() // → 동일한 등록을 반환 (타입 소거)
```

로우 클래스에서 검증하면 DSL 정의에 치환되지 않은 타입 파라미터가 포함될 때 iOS 빌드에서 크래시를 일으키던 Kotlin/Native klib 시그니처 맹글링(mangling) 오류도 방지할 수 있습니다.

### 제네릭 인스턴스 구별: 제네릭 파라미터의 타입 한정자 사용

동일한 제네릭 클래스의 여러 인스턴스가 공존해야 할 때 관용적인 패턴은 **구체적인 래퍼 타입**을 등록하고 **제네릭 파라미터에서 파생된 타입 한정자**(`named<T>()`)를 사용하는 것입니다. 이는 `koin-compose-navigation3`가 각 내비게이션 경로를 해당 경로 타입에 매핑하기 위해 내부적으로 사용하는 방식입니다.

```kotlin
inline fun <reified T : Any> Module.navigation(
    noinline definition: @Composable Scope.(T) -> Unit,
): KoinDefinition<EntryProviderInstaller> {
    // 제네릭 파라미터 T에서 파생된 타입 한정자로 구별되는
    // 구체적인 타입(EntryProviderInstaller)을 등록합니다.
    return _singleInstanceFactory<EntryProviderInstaller>(named<T>(), { ... })
}
```

양쪽에서 사용되는 예시:

```kotlin
// 선언 — T는 구체적인 타입임 (HomeRoute, SettingsRoute, ...)
module {
    navigation<HomeRoute> { route -> HomeScreen() }
    navigation<SettingsRoute> { route -> SettingsScreen() }
}

// 해석 — 동일한 타입 한정자가 조회를 위한 키가 됨
koin.get<EntryProviderInstaller>(named<HomeRoute>())
```

`named<T>()`는 구체화된(reified) `T`로부터 타입 한정자를 생성하므로, 각 제네릭 인스턴스는 안정적이고 고유한 한정자를 갖게 됩니다. 런타임 Koin은 (로우 클래스 + 한정자)를 매칭하여 타입 소거로 인해 사라진 변별력을 다시 도입합니다.

제네릭 인스턴스를 구분해야 할 때마다 `single<Box<X>>()`를 직접 사용하는 것보다 이 패턴을 권장합니다.

## 스코프 파라미터 주입

`org.koin.core.scope.Scope` 타입의 파라미터는 애노테이션 없이도 스코프 리시버와 함께 자동으로 주입됩니다. 스코프를 주입하면 동적 조회가 가능해지므로 검증은 생략됩니다.

```kotlin
@Scoped
class ScopedService(val scope: Scope) {
    fun dynamicLookup() = scope.get<SomeDep>()
}
// 생성됨: ScopedService(scope) — 스코프 리시버를 직접 전달함
```

## 명명된 스코프 해석: `@ScopeId`

현재 스코프 대신 명명된 Koin 스코프에서 의존성을 해석하려면 `@ScopeId`를 사용하세요. 스코프는 런타임에 해석되므로 검증은 생략됩니다.

```kotlin
@Factory
class ProfileService(@ScopeId(name = "user_session") val session: UserSession)
// 생성됨: ProfileService(scope.getScope("user_session").get<UserSession>())
```

`@ScopeId`는 두 가지 형태를 지원합니다.

| 형태 | 예시 | 스코프 ID |
|------|---------|----------|
| 문자열 이름 | `@ScopeId(name = "user_session")` | `"user_session"` |
| 타입 참조 | `@ScopeId(UserSessionScope::class)` | FQ(전체 경로) 클래스 이름 |

## 프로퍼티 검증

`@Property("key")` 파라미터는 Koin 프로퍼티(시작 시 `properties()`를 통해 설정됨)에서 해석됩니다. 플러그인은 `@PropertyValue("key")` 기본값이 존재하지 않을 때 컴파일 타임에 경고를 표시합니다.

```kotlin
@PropertyValue("api.timeout")
val defaultTimeout = 30

@Factory
class ApiClient(@Property("api.timeout") val timeout: Int)
// OK — @PropertyValue("api.timeout")이 컴파일 타임 기본값을 제공함

@Factory
class Other(@Property("missing.key") val value: String)
// 경고(WARNING) — @PropertyValue("missing.key")를 찾을 수 없음
// (여전히 컴파일됨 — 프로퍼티는 런타임에 제공될 수 있음)
```

## 외부 타입: `@Provided`

일부 타입은 런타임에 플랫폼이나 외부 프레임워크에 의해 제공되며 Koin 정의로 선언되지 않습니다. 검증을 건너뛰려면 이들에 `@Provided` 표시를 하세요.

`@Provided`는 **클래스**(해당 타입의 모든 사용에 대해 검증 건너뜀)와 **파라미터**(해당 파라미터만 건너뜀) 모두에 사용할 수 있습니다.

```kotlin
// 클래스에 사용 — 이 타입의 모든 사용은 검증을 건너뜀
@Provided
class SavedStateHandle

// 파라미터에 사용 — 이 파라미터만 검증을 건너뜀
@Singleton
class MyViewModel(@Provided val handle: SavedStateHandle)
```

**`@Provided`를 사용해야 하는 경우:**

- 화이트리스트에 없는 **Android 프레임워크 타입** — 예: 커스텀 Android 서비스
- 외부에서 주입되는 **서드 파티 SDK 타입** — 예: Firebase, 분석(analytics) SDK
- **Koin을 사용하지 않는 모듈의 교차 모듈 타입** — Koin을 사용하지 않는 라이브러리에서 의존성이 오는 경우
- **테스트 더블(Test doubles)** — 테스트 구성에서 실제 구현을 대체할 때
- **수동으로 제공되는 타입** — `androidContext()`, 수동 `single { }` 등록

```kotlin
// 외부 SDK — Koin에 의해 관리되지 않음
@Singleton
class AnalyticsService(@Provided val firebaseAnalytics: FirebaseAnalytics)

// 모듈 간 의존성: 런타임에 다른 팀의 모듈에 의해 제공됨
@Factory
class PaymentProcessor(@Provided val paymentGateway: PaymentGateway)
```

**일반적인 Android 프레임워크 타입은 자동으로 화이트리스트에 포함**되어 있으며 `@Provided`가 필요하지 않습니다.

- `android.content.Context`
- `android.app.Application`
- `android.app.Activity`
- `androidx.fragment.app.Fragment`
- `androidx.lifecycle.SavedStateHandle`
- `androidx.work.WorkerParameters`

## 기본값과 skipDefaultValues

`skipDefaultValues`가 활성화된 경우(기본값), Kotlin 기본값이 있는 파라미터는 DI 컨테이너에서 해석되는 대신 기본값을 사용합니다.

```kotlin
// skipDefaultValues = true (기본값)인 경우:
@Singleton
class ServiceWithDefault(val timeout: Int = 5000)
// → DI 해석 대신 Kotlin 기본값(5000)을 사용함

// Null 허용 파라미터는 여전히 주입됩니다:
@Singleton
class Service(val dep: Dependency? = null)
// → DI에서 getOrNull()을 사용함

// 애노테이션이 달린 파라미터는 기본값과 상관없이 항상 DI를 사용합니다:
@Singleton
class Service(@Named("custom") val name: String = "fallback")
// → @Named("custom") 한정자로 DI에서 해석함

// 혼합: 일부는 DI에서, 일부는 기본값에서
@Singleton
class ApiClient(
    val repo: UserRepository,                        // → DI에서 해석됨
    val timeout: Int = 30_000,                       // → Kotlin 기본값 사용
    @Property("api_url") val url: String = "https://api.example.com"  // → DI에서 해석됨 (애노테이션됨)
)
```

Kotlin 기본값을 무시하고 항상 DI 컨테이너에서 모든 파라미터를 주입하려면 `skipDefaultValues = false`로 설정하세요.

## 설정

컴파일 타임 안정성은 기본적으로 활성화되어 있습니다. 비활성화하려면 다음과 같이 설정합니다.

```kotlin
koinCompiler {
    compileSafety = false  // 컴파일 타임 안정성 검사 비활성화
}
```

기타 관련 옵션:

```kotlin
koinCompiler {
    compileSafety = true       // 컴파일 타임 의존성 검증 (기본값: true)
    strictSafety = true        // 모든 빌드 시 애그리게이터(aggregator)의 안정성 패스를 강제로 다시 실행
                               // (기본값: startKoin / @KoinApplication이 있는 모듈에서 자동 감지됨)
    skipDefaultValues = true   // 기본값이 있는 파라미터의 주입 건너뛰기 (기본값: true)
    unsafeDslChecks = true     // create()가 람다의 유일한 명령인지 검증 (기본값: true)
}
```

:::info 증분 컴파일 & `strictSafety`
전체 그래프 패스(A3)는 애그리게이터의 `compileKotlin`에서만 실행됩니다. K2 기반의 Kotlin 증분 컴파일은 `module { }` 람다 본문 내부의 DSL 변경 사항이나 `@ComponentScan` 패키지에 새로 추가된 클래스를 추적하지 않습니다. 따라서 그래프가 변경되었음에도 애그리게이터가 UP-TO-DATE로 표시될 수 있습니다. 플러그인은 감지된 애그리게이터 모듈에서 [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety)를 자동으로 활성화하여 A3가 다시 실행되도록 강제합니다. 라이브러리 및 기능 모듈은 계속해서 완전한 증분 컴파일을 유지합니다.
:::

## verify() / checkModules()에서 마이그레이션하기

컴파일러 플러그인은 런타임 검증을 대체합니다. 기존 검증 테스트를 제거할 수 있습니다.

| 이전 | 이후 |
|--------|-------|
| 테스트 내 `module.verify()` | 컴파일러 플러그인 (자동) |
| 테스트 내 `checkModules()` | 컴파일러 플러그인 (자동) |
| 런타임 검증 | 컴파일 타임 검증 |
| 수동 테스트 설정 | 테스트 코드 불필요 |

컴파일러가 매 빌드 시 검증하므로 테스트 코드가 필요하지 않습니다.

## 관련 내용

- **[컴파일러 플러그인 옵션](/docs/reference/koin-annotations/options)** - 모든 구성 옵션
- **[컴파일러 플러그인 설정](/docs/setup/compiler-plugin)** - 설치 가이드
- **[애노테이션 시작하기](/docs/reference/koin-annotations/start)** - 시작 가이드
- **[Playground 앱](https://github.com/InsertKoinIO/koin-compiler-plugin/tree/main/playground-apps)** - 애노테이션(`app-annotations/`) 및 DSL(`app-dsl/`) 방식을 모두 사용하는 전체 참조 앱