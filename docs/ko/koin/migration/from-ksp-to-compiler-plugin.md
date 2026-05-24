---
title: KSP에서 컴파일러 플러그인으로 Koin Annotations 마이그레이션하기
---

# Koin Annotations 마이그레이션: KSP에서 컴파일러 플러그인으로

이 가이드는 KSP 기반 프로세싱에서 새로운 Koin 컴파일러 플러그인(Compiler Plugin)으로 Koin Annotations 프로젝트를 마이그레이션하는 방법을 안내합니다.

:::info 좋은 소식입니다!
**어노테이션은 정확히 동일하게 유지됩니다.** 빌드 설정과 Koin 시작 코드만 변경하면 됩니다.
:::

## 무엇이 달라지나요?

| 항목 | KSP 프로세싱 | 컴파일러 플러그인 |
|--------|----------------|-----------------|
| **프로세싱** | KSP (별도 단계) | K2 컴파일러 (통합됨) |
| **생성된 파일** | `build/generated/ksp`에서 확인 가능 | 없음 - 인라인 변환(inline transformations) |
| **빌드 속도** | 더 느림 | 더 빠름 |
| **KMP 설정** | 플랫폼별 KSP 설정 필요 | 단일 플러그인 적용 |
| **Koin 시작** | `modules(AppModule().module)` | `startKoin<MyApp>()` |
| **향후 지원** | 지원 중단(Deprecated) | 활발히 개발 중 |

## 요구 사항

- **Kotlin 2.3.20+** (K2 컴파일러 필수)
- **Gradle 8.x+**

## 마이그레이션 단계

### 1단계: Kotlin 버전 업데이트

컴파일러 플러그인은 Kotlin 2.3.20 이상이 필요합니다:

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20" // 최소 2.3.20 필요
}
```

### 2단계: Version Catalog 업데이트

**변경 전 (KSP):**
```toml
[versions]
koin = "4.0.0"
koin-ksp = "2.0.0"  # KSP 어노테이션용 별도 버전
ksp = "2.0.0-1.0.22"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-ksp" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-ksp" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

**변경 후 (컴파일러 플러그인):**
```toml
[versions]
koin = "4.2.0"
koin-plugin = "1.0.0"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

:::note
`koin-annotations`는 이제 메인 Koin 프로젝트의 일부이며 `koin-core`와 동일한 버전을 사용합니다.
:::

### 3단계: 빌드 설정 업데이트

**변경 전 (KSP):**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // KSP 버전 (별도 버전 관리)
    ksp(libs.koin.ksp.compiler)
}

ksp {
    arg("KOIN_CONFIG_CHECK", "true")
}
```

**변경 후 (컴파일러 플러그인):**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // koin-core와 동일한 버전
}

// 선택 사항 설정
koinCompiler {
    userLogs = true  // 컴포넌트 감지 로그 출력
}
```

### 4단계: Koin 시작 코드 업데이트

이것이 주요 코드 변경 사항입니다. KSP 방식은 생성된 `.module` 확장 함수를 사용하는 반면, 컴파일러 플러그인은 `@KoinApplication`과 함께 타입 기반(typed) API를 사용합니다.

**변경 전 (KSP):**
```kotlin
import org.koin.ksp.generated.*  // 생성된 확장 함수들

@Module
@ComponentScan("com.myapp")
class AppModule

fun main() {
    startKoin {
        modules(AppModule().module)  // 생성된 .module 확장 함수
    }
}
```

**변경 후 (컴파일러 플러그인):**

```kotlin
// 생성된 임포트가 필요 없음

@Module
@ComponentScan("com.myapp")
class AppModule

@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp>()  // 타입 기반 API
}
```

#### Android 예시

**변경 전 (KSP):**
```kotlin
import org.koin.ksp.generated.*

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            modules(AppModule().module)
        }
    }
}
```

**변경 후 (컴파일러 플러그인):**
```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp> {
            androidContext(this@MyApplication)
        }
    }
}
```

### 5단계: 정리

KSP로 생성된 파일들을 제거하고 다시 빌드합니다:

```bash
rm -rf build/generated/ksp
./gradlew clean build
```

## 어노테이션은 동일하게 유지됩니다

어노테이션이 추가된 모든 클래스는 변경되지 않고 그대로 유지됩니다:

```kotlin
// 변경이 필요 없습니다!
@Singleton
class UserRepository(private val database: Database)

@Factory
class GetUserUseCase(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val useCase: GetUserUseCase) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

모든 어노테이션은 동일하게 작동합니다. 전체 목록은 **[어노테이션 레퍼런스](/docs/reference/koin-annotations/definitions)**를 참조하세요.

### 임포트 변경: `@KoinViewModel`

`@KoinViewModel` 어노테이션의 패키지가 변경되었습니다:

```kotlin
// 변경 전 (KSP)
import org.koin.android.annotation.KoinViewModel

// 변경 후 (컴파일러 플러그인)
import org.koin.core.annotation.KoinViewModel
```

### 최상위 함수 정의 (신규)

컴파일러 플러그인은 `@ComponentScan`으로 탐색 가능한 최상위 함수(top-level functions)에 대한 어노테이션을 지원합니다:

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)

@Module
@ComponentScan("com.myapp")
class AppModule
```

함수의 반환 타입에 따라 바인딩 타입이 결정됩니다. 함수의 파라미터는 의존성으로 주입됩니다.

## DSL 구문 변경 사항

어노테이션과 함께 Koin DSL 모듈을 사용하는 경우, 컴파일러 플러그인은 더 깔끔한 구문을 제공합니다:

| KSP / 클래식 스타일 | 컴파일러 플러그인 스타일 |
|---------------------|----------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyScoped)` | `scoped<MyScoped>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |
| `single { fn(get()) }` | `single { create(::fn) }` |

```kotlin
// 변경 전
val myModule = module {
    singleOf(::MyService)
    factoryOf(::MyRepository)
    viewModelOf(::MyViewModel)
}

// 변경 후
import org.koin.plugin.module.dsl.*

val myModule = module {
    single<MyService>()
    factory<MyRepository>()
    viewModel<MyViewModel>()
}

// 함수 빌더 — 외부 라이브러리용 (Room, Retrofit 등)
fun createDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "db").build()

val dbModule = module {
    single { create(::createDatabase) }
}
```

:::note
컴파일러 플러그인 DSL은 **`org.koin.plugin.module.dsl`** 패키지에 있습니다. 클래식 DSL은 기존처럼 `org.koin.dsl`에 유지됩니다.
:::

## 모듈 간 탐색 (Cross-Module Discovery)

Gradle 모듈 전체에서 자동 모듈 탐색을 위해 `@Configuration`을 사용하세요:

```kotlin
// feature 모듈 내
@Module
@ComponentScan
@Configuration
class FeatureModule

// app 모듈 내 - FeatureModule이 자동으로 탐색됨
@KoinApplication
object MyApp

startKoin<MyApp>()  // FeatureModule이 자동으로 포함됨
```

## KMP 마이그레이션

컴파일러 플러그인은 KMP 설정을 크게 단순화합니다.

**변경 전 (KSP) - 플랫폼별 설정:**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.insert-koin:koin-core:$koin_version")
            implementation("io.insert-koin:koin-annotations:$koin_ksp_version")  // 별도 버전
        }
    }
}

dependencies {
    // 각 플랫폼마다 KSP 컴파일러가 필요함
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

**변경 후 (컴파일러 플러그인) - 단일 플러그인:**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
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

## 타입 기반 시작 API (Typed Startup APIs)

컴파일러 플러그인은 `startKoin<T>()`, `koinApplication<T>()`, `koinConfiguration<T>()`와 같은 타입 기반 API를 제공합니다.

자세한 내용은 **[Annotations로 시작하기](/docs/reference/koin-annotations/start)**를 참조하세요.

## 설정 레이블 (신규)

컴파일러 플러그인에는 조건부 모듈 로딩을 위한 설정 레이블(configuration labels)이 추가되었습니다.

자세한 내용은 **[모듈 - 설정](/docs/reference/koin-annotations/modules)**을 참조하세요.

## 컴파일러 플러그인 옵션

모든 설정 옵션은 **[컴파일러 플러그인 옵션](/docs/reference/koin-annotations/options)**을 참조하세요.

## 문제 해결

### KSP 제거 후 빌드 실패

1. `./gradlew clean` 실행
2. `rm -rf build/generated/ksp` 실행
3. IDE 캐시 무효화 (Invalidate IDE caches)
4. 다시 빌드

### 어노테이션이 감지되지 않음

로깅을 활성화하세요:
```kotlin
koinCompiler {
    userLogs = true
}
```

### 런타임 시 의존성 누락

1. `@ComponentScan` 패키지를 확인하세요.
2. `@KoinApplication(modules = [...])`에 모듈이 포함되었는지 확인하세요.
3. 외부 의존성에는 `@Provided`를 사용하세요.

## 마이그레이션 체크리스트

- [ ] Kotlin을 2.3.20 이상으로 업데이트
- [ ] Koin을 4.2.0 이상으로 업데이트
- [ ] KSP 플러그인 제거
- [ ] `koin-ksp-compiler` 의존성 제거
- [ ] `koin-annotations`를 메인 Koin 버전으로 업데이트 (`io.insert-koin:koin-annotations:$koin_version`)
- [ ] Koin 컴파일러 플러그인 추가 (`io.insert-koin.compiler.plugin`)
- [ ] `@KoinViewModel` 임포트를 `org.koin.core.annotation`으로 업데이트
- [ ] `@KoinApplication` 클래스를 생성하고 `modules(X().module)`를 `startKoin<MyApp>()`으로 교체
- [ ] DSL 모듈을 사용하는 경우 DSL 임포트를 `org.koin.plugin.module.dsl.*`로 업데이트
- [ ] DSL 구문 업데이트: `singleOf(::X)` → `single<X>()`
- [ ] `import org.koin.ksp.generated.*` 제거
- [ ] Clean 및 다시 빌드 (`rm -rf build/generated/ksp && ./gradlew clean build`)

## 참고 항목

- **[컴파일러 플러그인 설정](/docs/setup/compiler-plugin)** - 전체 설정 가이드
- **[어노테이션 레퍼런스](/docs/reference/koin-annotations/start)** - 모든 어노테이션 정보
- **[KSP 프로세서 설정 (지원 중단)](/docs/setup/annotations-ksp)** — 기존 `koin-ksp-compiler` 레퍼런스