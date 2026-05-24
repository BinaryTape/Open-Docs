---
title: 컴파일러 플러그인 설정
---

# Koin 컴파일러 플러그인 설정

**Koin 컴파일러 플러그인(Koin Compiler Plugin)**은 모든 새로운 Kotlin 2.x 프로젝트에 권장되는 방식입니다. 이 플러그인은 자동 주입(auto-wiring), 컴파일 타임 안정성, 그리고 더 깔끔한 DSL 구문을 제공합니다.

## 컴파일러 플러그인이란 무엇인가요?

Koin 컴파일러 플러그인은 다음과 같은 기능을 제공하는 **네이티브 코틀린 컴파일러 플러그인(K2)**입니다.

- 생성자 의존성 자동 감지
- 컴파일 타임 분석 제공
- DSL 및 어노테이션(Annotations) 모두와 함께 작동
- 별도의 가시적인 파일을 생성하지 않음

기능과 장점에 대한 자세한 내용은 [Koin 컴파일러 플러그인 소개](/docs/intro/koin-compiler-plugin)를 참조하세요.

:::tip IDE 플러그인
Android Studio 및 IntelliJ IDEA용 **[Koin IDE 플러그인](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)**을 설치하세요. 정의와 주입 지점 간의 코드 탐색, 실시간 안정성 검사, 의존성 그래프 시각화 기능을 제공합니다.
:::

## 요구 사항

- **Kotlin 2.3.20+** (K2 컴파일러)
- **Gradle 8.x+**

## 설정

### 1단계: 버전 카탈로그에 Koin 추가

먼저 최신 버전을 확인하세요:
- Koin: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin Compiler Plugin: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

그 다음, `gradle/libs.versions.toml` 파일에 추가합니다:

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### 2단계: 설정 구성

`settings.gradle.kts` 파일에 다음을 추가합니다:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### 3단계: 플러그인 적용

모듈의 `build.gradle.kts` 파일에 다음을 추가합니다:

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // 어노테이션 지원을 위해 필요
}
```

:::tip
**`@KoinViewModel` 또는 `@KoinWorker`를 사용하시나요?** 해당 어노테이션들은 클래스패스(classpath)에 런타임 DSL이 있어야 합니다:

- `@KoinViewModel` → `implementation("io.insert-koin:koin-core-viewmodel")`
- `@KoinWorker` → `implementation("io.insert-koin:koin-android-workmanager")`

런타임 라이브러리 없이 어노테이션을 추가하면 컴파일러가 누락된 아티팩트를 명시하는 명확한 에러를 발생시킵니다. 이제 시작 시점에 소리 없이 발생하는 `NoDefinitionFoundException`은 더 이상 없습니다.
:::

## 전체 예시

### gradle/libs.versions.toml

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### settings.gradle.kts

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### build.gradle.kts

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

## 컴파일러 플러그인 사용하기

### DSL 스타일

컴파일러 플러그인 패키지에서 임포트합니다:

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info
컴파일러 플러그인 DSL은 **`org.koin.plugin.module.dsl`** 패키지에 있습니다. 클래식 DSL은 `org.koin.dsl`에 그대로 유지됩니다.
:::

### 어노테이션 스타일

클래스에 어노테이션을 사용합니다:

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

### 어노테이션으로 Koin 시작하기

컴파일러 플러그인을 사용하면 타입 기반 API를 사용하여 Koin을 시작할 수 있습니다. **생성된 코드는 필요하지 않습니다**:

```kotlin
@KoinApplication
@ComponentScan("com.myapp")
class MyApp

// 타입 기반 API로 Koin 시작
startKoin<MyApp>()

// 또는 추가 구성과 함께 시작
startKoin<MyApp> {
    androidContext(this@MyApplication)
    printLogger()
}
```

**사용 가능한 타입 기반 API:**

| API | 설명 |
|-----|-------------|
| `startKoin<T>()` | 애플리케이션 T를 사용하여 전역적으로 Koin 시작 |
| `startKoin<T> { }` | 애플리케이션 T와 구성 블록을 사용하여 Koin 시작 |
| `koinApplication<T>()` | T를 사용하여 격리된 KoinApplication 생성 |
| `koinConfiguration<T>()` | T로부터 KoinConfiguration 생성 (Compose KoinApplication, Ktor 등을 위해 사용) |

여기서 `T`는 `@KoinApplication` 어노테이션이 달린 클래스입니다.

**개별 모듈 로드하기:**

`@KoinApplication` 없이 `module<T>()` 또는 `modules()`를 사용하여 `@Module` 클래스를 직접 로드할 수도 있습니다:

```kotlin
startKoin {
    module<NetworkModule>()                              // 단일 모듈 로드
    modules(DataModule::class, CacheModule::class)       // 여러 모듈 로드
}
```

| API | 설명 |
|-----|-------------|
| `module<T>()` | 단일 `@Module` 클래스를 KoinApplication에 로드 |
| `modules(vararg KClass)` | 여러 `@Module` 클래스를 KoinApplication에 로드 |

여기서 `T` 또는 각 `KClass`는 `@Module` 어노테이션이 달린 클래스입니다. 이는 테스트 환경이나 어노테이션과 DSL 모듈을 혼용할 때 유용합니다:

```kotlin
// 테스트에서
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 구성 옵션

`build.gradle.kts`에서 컴파일러 플러그인을 구성할 수 있습니다:

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    unsafeDslChecks = true
}
```

### 사용 가능한 옵션

| 옵션 | 설명 | 기본값 |
|--------|-------------|---------|
| `compileSafety` | 컴파일 타임 의존성 검증 (A2/A3/A4) | `true` |
| `strictSafety` | 매 빌드마다 애그리게이터(aggregator)의 안전성 패스를 강제로 다시 실행 (Kotlin 증분 컴파일 우회) | 애그리게이터 모듈에서 자동 감지 |
| `skipDefaultValues` | Kotlin 기본값이 있는 파라미터에 대한 주입 건너뛰기 | `true` |
| `userLogs` | 컴포넌트 감지 및 DSL/어노테이션 처리에 대한 로그 활성화 | `false` |
| `debugLogs` | 내부 플러그인 처리에 대한 상세 디버그 로그 활성화 | `false` |
| `unsafeDslChecks` | 람다 내부의 `create()` 호출이 유일한 명령인지 검증 | `true` |

:::tip
개발 중에는 `userLogs = true`로 설정하여 플러그인에 의해 어떤 컴포넌트가 감지되고 처리되는지 확인하세요.
:::

## 컴파일 타임 안정성

Koin 컴파일러 플러그인은 **컴파일 타임 의존성 검증**을 제공합니다. 이는 런타임에 실패하는 대신 빌드 타임에 모든 의존성이 해결될 수 있는지 검증하는 기능입니다. 이 기능은 기본적으로 활성화되어 있습니다.

```kotlin
koinCompiler {
    compileSafety = true       // 기본적으로 활성화됨
    skipDefaultValues = true   // 기본적으로 활성화됨
}
```

플러그인은 세 가지 수준에서 그래프를 검증합니다: 모듈별(A2), `startKoin<T>()`에서의 전체 그래프(A3), 그리고 모든 호출 지점(A4). 자세한 내용은 [컴파일 타임 안정성(Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)을 참조하세요.

## 멀티 모듈 프로젝트

여러 Gradle 모듈이 있는 프로젝트의 경우:

### 라이브러리 모듈

```kotlin
// feature/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@ComponentScan("com.myapp.feature")
class FeatureModule
```

### 앱 모듈

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(project(":feature"))
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// app/src/main/kotlin/MyModule.kt
@Module
@Configuration
class MyModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp>()
    }
}
```

타입 기반 시작 API와 함께 메인 애플리케이션 클래스에 `@KoinApplication`을 사용하세요.

## Kotlin 멀티플랫폼 (KMP)

컴파일러 플러그인은 KMP 프로젝트에서도 작동합니다:

```kotlin
// shared/build.gradle.kts
plugins {
    id("org.jetbrains.kotlin.multiplatform")
    alias(libs.plugins.koin.compiler)
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.annotations)
        }
    }
}
```

## 문제 해결

### 플러그인을 찾을 수 없음

플러그인이 플러그인 저장소에 포함되어 있는지 확인하세요:

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### Kotlin 버전 불일치

컴파일러 플러그인은 Kotlin 2.3.20+ 버전을 요구합니다. Kotlin 버전을 확인하세요:

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20"  // 2.3.20+ 버전 필요
}
```

### 임포트 오류

올바른 패키지에서 임포트하고 있는지 확인하세요:

```kotlin
// 컴파일러 플러그인 DSL
import org.koin.plugin.module.dsl.*

// 클래식 DSL
import org.koin.dsl.*
```

### 증분 컴파일 및 캐시 문제

다른 Kotlin 컴파일러 플러그인(예: Compose 컴파일러, Metro)과 마찬가지로, Koin 컴파일러 플러그인은 IR 수준에서 작동합니다. Kotlin의 증분 컴파일(incremental compilation)은 때때로 특정 변경 사항 이후에 **오래되었거나 일관성 없는 결과**를 생성할 수 있습니다.

**증상:**
- 나타나지 않아야 할 컴파일 안정성 에러 (오탐, false positives)
- 정의를 제거한 후에도 컴파일 안정성 에러가 발생하지 않음 (미탐, false negatives)
- 리팩토링 후 런타임에 `NoSuchMethodError` 또는 `ClassNotFoundException` 발생

**주로 발생하는 경우:**
- 클래스의 어노테이션 변경 (`@Single` → `@Factory`, `@Named` 추가/제거)
- 패키지 간 클래스 이동 (`@ComponentScan` 감지에 영향)
- 모듈 `includes` 또는 `@Configuration` 레이블 변경
- 다른 모듈이 의존하는 라이브러리 모듈에서 정의 추가/제거

**해결 방법:** 클린 빌드를 실행하세요:

```bash
./gradlew clean build
```

또는 Android Studio에서: **Build → Clean Project** 실행 후, **Build → Rebuild Project**.

:::tip
리팩토링 후 예상치 못한 컴파일 안정성 에러가 발생하면 먼저 클린 빌드를 시도해 보세요. 이는 Koin만의 문제가 아니라 컴파일러 플러그인을 사용하는 증분 컴파일의 알려진 한계입니다.

그래프 수준의 변경(`module { }` 람다 내부의 DSL 정의, `@ComponentScan` 패키지에 추가된 클래스 등)의 경우, 플러그인의 `strictSafety` 옵션이 애그리게이터 모듈에서 자동으로 활성화되어 매 빌드마다 전체 그래프 안정성 패스가 다시 실행되도록 강제합니다. 자세한 내용은 [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety)를 참조하세요.
:::

### 멀티 모듈 프로젝트에서의 컴파일 안정성 오탐

라이브러리 모듈에 존재하는 의존성을 플러그인이 누락된 것으로 보고하는 경우 다음을 확인하세요:

1. **라이브러리 모듈에도 Koin 컴파일러 플러그인이 적용되어 있는지 확인** — 다운스트림 모듈이 읽는 힌트 함수를 생성합니다.
2. **라이브러리가 사용하는 모듈보다 먼저 빌드되는지 확인** — 일반적으로 Gradle이 `implementation(project(":lib"))`을 통해 이를 처리하지만, 태스크 의존성을 다시 확인해 보세요.
3. 라이브러리 모듈에 플러그인을 처음 추가한 후 **클린 빌드를 실행**하세요.

## 마이그레이션

### 클래식 DSL에서 마이그레이션

1. 컴파일러 플러그인을 추가합니다.
2. 임포트를 `org.koin.plugin.module.dsl.*`로 업데이트합니다.
3. `single { Class(get() ...) }` 또는 `singleOf(::Class)`를 `single<Class>()`로 교체합니다.

컴파일 타임에 안전한 구문은 위의 [DSL 스타일](#dsl-스타일) 레퍼런스를 참조하세요.

### KSP 프로세서(koin-ksp-compiler)에서 마이그레이션

1. KSP 플러그인 및 `koin-ksp-compiler` 의존성을 제거합니다.
2. Koin 컴파일러 플러그인을 추가합니다.
3. `startKoin { modules(...) }`를 `startKoin<MyApp>()`으로 업데이트합니다.
4. **기존 어노테이션은 그대로 유지됩니다!** `koin-annotations` 라이브러리는 그대로 사용하며 프로세서만 변경됩니다.

전체 가이드는 **[KSP에서 컴파일러 플러그인으로 마이그레이션하기](/docs/migration/from-ksp-to-compiler-plugin)**를 참조하세요.

## 다음 단계

- **[DSL 레퍼런스](/docs/reference/dsl-reference)** - 전체 DSL 문서
- **[어노테이션 레퍼런스](/docs/reference/annotations-reference)** - 전체 어노테이션 문서
- **[Koin 시작하기](/docs/reference/koin-core/starting-koin)** - 애플리케이션 구성하기