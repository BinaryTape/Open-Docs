---
title: Koin 어노테이션 시작하기
---

:::info Koin 어노테이션 상태
**Koin 어노테이션은 이제 Koin 프로젝트의 일부입니다.** `koin-annotations` 라이브러리는 메인 Koin 버전과 함께 제공되며 완벽하게 지원됩니다.

기존 KSP 프로세서(`koin-ksp-compiler`)는 **더 이상 사용되지 않으며(deprecated)** **Koin 컴파일러 플러그인**으로 대체되었습니다. 어노테이션은 그대로 유지되며 빌드 설정만 변경됩니다. [KSP에서 컴파일러 플러그인으로 마이그레이션하기](/docs/migration/from-ksp-to-compiler-plugin)를 참조하세요.
:::

Koin 어노테이션을 사용하면 클래스에 어노테이션을 추가하여 정의(definitions)를 선언할 수 있습니다. Koin 컴파일러 플러그인은 이러한 어노테이션을 처리하고 컴파일 시점에 모든 기반 Koin DSL을 자동으로 생성합니다.

## 시작하기

Koin이 처음이신가요? 먼저 [Koin 시작하기](https://insert-koin.io/docs/quickstart/kotlin/)를 살펴보세요.

### 설정

프로젝트에 Koin 컴파일러 플러그인을 추가하세요. 자세한 지침은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

### 컴포넌트에 어노테이션 추가하기

컴포넌트에 정의 어노테이션을 추가하세요:

```kotlin
@Singleton
class MyRepository

@Singleton
class MyService(val repository: MyRepository)

@Factory
class MyUseCase(val service: MyService)
```

### 모듈 선언하기

정의를 정리하기 위한 모듈을 생성합니다:

```kotlin
@Module
@ComponentScan("com.myapp")
class AppModule
```

### Koin 시작하기

타입화된 시작 API(typed startup API)와 함께 `@KoinApplication`을 사용하세요:

```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp> {
        printLogger()
    }

    // 일반적인 Koin API를 그대로 사용합니다
    KoinPlatform.getKoin().get<MyService>()
}
```

## 구성 레이블 (Configuration Labels)

레이블에 따라 로드되는 모듈을 생성하려면 `@Configuration`을 사용하세요:

```kotlin
@Module
@Configuration  // 기본 구성
class CoreModule

@Module
@Configuration("prod")
class ProdModule

@Module
@Configuration("test")
class TestModule
```

특정 구성을 로드합니다:

```kotlin
@KoinApplication(
    modules = [CoreModule::class],
    configurations = ["prod"]  // @Configuration("prod")가 지정된 모듈만 로드합니다
)
class ProdApp

fun main() {
    startKoin<ProdApp>()
}
```

## 타입화된 시작 API (Typed Startup APIs)

컴파일러 플러그인은 Koin을 시작하기 위한 타입화된 API를 제공합니다:

| API | 설명 |
|-----|-------------|
| `startKoin<T>()` | Koin을 전역적으로 시작 |
| `startKoin<T> { }` | 구성 블록과 함께 시작 |
| `koinApplication<T>()` | 격리된 KoinApplication 생성 |
| `koinConfiguration<T>()` | 구성 생성 (Compose, Ktor용) |
| `module<T>()` | 단일 `@Module` 클래스 로드 |
| `modules(A::class, B::class)` | 여러 `@Module` 클래스 로드 |

여기서 `T`는 `@KoinApplication`(시작 API용) 또는 `@Module`(모듈 로드 API용) 어노테이션이 지정된 클래스입니다.

### 개별 모듈 로드하기

`@KoinApplication` 없이 `@Module` 클래스를 직접 로드할 수 있습니다:

```kotlin
startKoin {
    module<NetworkModule>()
    modules(DataModule::class, CacheModule::class)
}
```

이는 특히 **테스트**에서 유용합니다:

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 컴파일 시점 안전성 (Compile-Time Safety)

컴파일러 플러그인은 컴파일 시점에 Koin 구성을 검증하여 모든 의존성이 선언되었고 접근 가능한지 확인합니다.

### @Provided를 사용한 우회

의존성이 외부에서 제공됨을 나타내려면 `@Provided`를 사용하세요:

```kotlin
class ExternalComponent  // 다른 곳에서 선언됨

@Factory
class MyPresenter(@Provided val external: ExternalComponent)
```

## 컴파일러 플러그인 옵션

모든 구성 옵션은 **[컴파일러 플러그인 옵션](/docs/reference/koin-annotations/options)**을 참조하세요.

## ProGuard 규칙 (ProGuard Rules)

ProGuard/R8를 사용하는 SDK 개발의 경우:

```
# 어노테이션 정의 유지
-keep class org.koin.core.annotation.** { *; }

# Koin 어노테이션이 지정된 클래스 유지
-keep @org.koin.core.annotation.* class * { *; }
```

## 참고 항목

- **[컴파일러 플러그인 설정](/docs/setup/compiler-plugin)** - 전체 설정 가이드
- **[정의 (Definitions)](/docs/reference/koin-annotations/definitions)** - 모든 정의 어노테이션
- **[모듈 (Modules)](/docs/reference/koin-annotations/modules)** - 모듈 구조화
- **[KMP 지원](/docs/reference/koin-annotations/kmp)** - Kotlin 멀티플랫폼 (Kotlin Multiplatform)