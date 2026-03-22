---
title: 모듈
---

# 모듈

Koin 모듈은 의존성 주입 설정을 구성하는 기본 단위입니다.

## 모듈이란 무엇인가요?

모듈은 관련된 정의(definition)들을 그룹화하는 논리적인 컨테이너입니다:

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

모듈은 다음과 같은 이점을 제공합니다:
- 기능이나 계층별로 정의를 **정리**할 수 있습니다.
- 관련된 의존성을 **캡슐화**합니다.
- 다양한 컨텍스트에서 설정을 **재사용**할 수 있습니다.
- 모듈화된 프로젝트에서 **가시성(visibility)을 제어**할 수 있습니다.

## 모듈 생성하기

### 컴파일러 플러그인 DSL 사용

```kotlin
import org.koin.plugin.module.dsl.*

val networkModule = module {
    single<ApiClient>()
    single<TokenManager>()
}

val databaseModule = module {
    single<Database>()
    single<UserDao>()
}
```

### 애노테이션 사용

```kotlin
@Module
@ComponentScan("com.myapp.network")
class NetworkModule

@Module
@ComponentScan("com.myapp.database")
class DatabaseModule
```

### 클래식 DSL 사용

```kotlin
val networkModule = module {
    singleOf(::ApiClient)
    singleOf(::TokenManager)
}
```

## 여러 모듈 사용하기

의존성은 다른 모듈에 있는 정의를 참조할 수 있습니다:

```kotlin
// 데이터 계층
val dataModule = module {
    single<Database>()
    single<UserRepository>()  // 이 모듈의 Database를 사용할 수 있음
}

// 프레젠테이션 계층
val viewModelModule = module {
    viewModel<UserViewModel>()  // dataModule의 UserRepository를 사용할 수 있음
}

// 둘 다 로드
startKoin {
    modules(dataModule, viewModelModule)
}
```

:::info
Koin은 로드된 모든 모듈에 걸쳐 의존성을 자동으로 해결(resolve)합니다. 명시적인 임포트(import)는 필요하지 않습니다.
:::

:::note
모듈을 직접 나열하는 방식도 작동하지만, 더 나은 구조와 최적화된 로딩을 위해 [`includes()`](#includes를-사용한-모듈-구성)를 사용하여 모듈을 계층 구조로 구성하는 것을 고려해 보세요.
:::

## `includes()`를 사용한 모듈 구성

`includes()` 함수는 모듈을 구성하는 **권장되는 방식**입니다. 다음과 같은 기능을 제공합니다:

- **모듈 계층 구조** - 명확한 부모-자식 관계로 모듈을 구조화합니다.
- **최적화된 로딩** - Koin은 포함된 모듈의 중복을 제거하여 불필요한 등록을 방지합니다.
- **깔끔한 시작 절차** - 긴 리스트 대신 단일 루트 모듈만 로드하면 됩니다.
- **캡슐화** - 내부(internal) 모듈을 퍼블릭 API 모듈 뒤로 숨길 수 있습니다.

:::tip
**Best Practice:** `startKoin`에서 모든 모듈을 나열하는 대신 `includes()`를 사용하여 모듈 계층을 구축하세요. 이는 조직화 수준을 높이고 효율적인 모듈 로딩을 보장합니다.
:::

```kotlin
val networkModule = module {
    single<ApiClient>()
}

val storageModule = module {
    single<Database>()
}

// 부모 모듈이 자식 모듈들을 포함함
val dataModule = module {
    includes(networkModule, storageModule)
    single<UserRepository>()
}

// ✅ 권장: includes가 포함된 루트 모듈 로드
startKoin {
    modules(dataModule)
}

// ❌ 지양: 모듈을 평탄한 리스트로 나열
startKoin {
    modules(networkModule, storageModule, dataModule)
}
```

### `includes()`의 로딩 최적화 방식

모듈이 여러 번 포함되더라도 Koin은 이를 한 번만 로드합니다:

```kotlin
val commonModule = module {
    single<Logger>()
}

val featureAModule = module {
    includes(commonModule)
    single<FeatureA>()
}

val featureBModule = module {
    includes(commonModule)  // 여기서도 commonModule을 포함함
    single<FeatureB>()
}

val appModule = module {
    includes(featureAModule, featureBModule)
}

// commonModule은 두 번 포함되었지만, 실제로는 단 '한 번'만 로드됩니다.
startKoin {
    modules(appModule)
}
```

### 멀티 모듈 프로젝트

가시성 수정자(visibility modifiers)를 사용하여 노출되는 내용을 제어하세요:

```kotlin
// :feature:user 모듈

// Private - 다른 모듈에서 숨겨짐
private val userDataModule = module {
    single<UserDao>()
    single<UserCache>()
}

// 퍼블릭 API
val userFeatureModule = module {
    includes(userDataModule)
    viewModel<UserViewModel>()
}
```

```kotlin
// :app 모듈
startKoin {
    modules(userFeatureModule)  // 이것만 접근 가능함
}
```

## 모듈 재정의 (Module Override)

### 기본 동작

기본적으로 **마지막에 로드된 정의가 우선**합니다:

```kotlin
val productionModule = module {
    single<ApiService> { ProductionApi() }
}

val debugModule = module {
    single<ApiService> { DebugApi() }
}

startKoin {
    modules(productionModule, debugModule)  // DebugApi가 적용됨
}
```

### 엄격 모드 (Strict Mode)

프로덕션 환경에서는 재정의를 비활성화할 수 있습니다:

```kotlin
startKoin {
    allowOverride(false)  // 재정의 시도 시 예외 발생
    modules(productionModule)
}
```

### 명시적 재정의

엄격 모드에서도 특정 정의에 대해 재정의를 허용할 수 있습니다:

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()  // 허용됨
}

startKoin {
    allowOverride(false)
    modules(productionModule, testModule)
}
```

## 즉시 생성 모듈 (Eager Module Creation)

시작 시 싱글톤을 즉시 생성하도록 설정합니다:

```kotlin
val coreModule = module(createdAtStart = true) {
    single<ConfigManager>()
    single<LoggingSystem>()
}
```

## 파라미터화된 모듈

동적으로 모듈을 생성할 수 있습니다:

```kotlin
fun featureModule(debug: Boolean) = module {
    single<Logger> {
        if (debug) DebugLogger() else ProductionLogger()
    }
}

startKoin {
    modules(featureModule(debug = BuildConfig.DEBUG))
}
```

## 전략 패턴 (Strategy Pattern)

모듈을 사용하여 구현체를 교체할 수 있습니다:

```kotlin
val repositoryModule = module {
    single<UserRepository>()  // Datasource에 의존함
}

// 전략 옵션들
val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}

// 프로덕션
startKoin {
    modules(repositoryModule, remoteDatasourceModule)
}

// 오프라인 모드
startKoin {
    modules(repositoryModule, localDatasourceModule)
}
```

## 애노테이션 기반 모듈

Koin은 DSL의 대안으로 애노테이션 기반 모듈 설정을 지원합니다.

```kotlin
@Module
@ComponentScan("com.myapp.data")
class DataModule

@Module
@ComponentScan("com.myapp.network")
class NetworkModule

// 다른 모듈 포함하기
@Module(includes = [DataModule::class, NetworkModule::class])
class AppModule
```

주요 특징:
- `@Module`은 클래스를 Koin 모듈로 지정합니다.
- `@ComponentScan`은 패키지 내의 애노테이션이 달린 클래스들을 자동으로 탐색합니다.
- `@Configuration`은 시작 시 자동 탐색을 활성화합니다.
- 모듈 함수를 통해 외부 라이브러리 인스턴스를 제공할 수 있습니다.

:::info
애노테이션 기반 모듈에 대한 자세한 문서는 [애노테이션 레퍼런스 - 모듈](/docs/reference/koin-annotations/modules)을 참조하세요.
:::

## 모범 사례 (Best Practices)

### 조직화

1. **기능/계층별 그룹화**
   ```kotlin
   val authModule = module { /* 인증 기능 */ }
   val networkModule = module { /* 네트워크 계층 */ }
   ```

2. **`includes()`를 사용하여 모듈 계층 구조 구축** (권장)
   ```kotlin
   // 모든 기능을 포함하는 루트 모듈 생성
   val appModule = module {
       includes(
           coreModule,
           networkModule,
           featureAModule,
           featureBModule
       )
   }

   // 단일 모듈로 깔끔하게 시작
   startKoin {
       modules(appModule)
   }
   ```

3. **모듈의 집중도 유지** - 모듈당 하나의 책임만 갖도록 합니다.

### 명명 규칙

- 서술적인 이름을 사용하세요: `networkModule`, `userFeatureModule`
- 관련된 것끼리 그룹화하세요: `authDataModule`, `authDomainModule`

### 멀티 모듈 프로젝트

1. **기능당 하나의 퍼블릭 모듈**을 둡니다.
2. **구현 모듈에는 `private` 또는 `internal`을 사용**하세요.
3. **공유 모듈은 `:core`에 배치**합니다.

## 다음 단계

- **[정의(Definitions)](/docs/reference/koin-core/definitions)** - 정의 생성하기
- **[한정자(Qualifiers)](/docs/reference/koin-core/qualifiers)** - 이름 및 타입 한정자
- **[스코프(Scopes)](/docs/reference/koin-core/scopes)** - 스코프를 이용한 수명 주기 관리
- **[트러블슈팅](/docs/reference/koin-core/troubleshooting)** - 일반적인 문제 디버깅 및 해결