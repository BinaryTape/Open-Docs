---
title: Koin DSL
---

Koin DSL에 대한 빠른 참조 가이드입니다. 자세한 가이드는 **[Core - 정의(Definitions)](/docs/reference/koin-core/definitions)** 및 **[Core - 모듈(Modules)](/docs/reference/koin-core/modules)**을 참조하세요.

## DSL 방식 (DSL Approaches)

| 방식 | 구문(Syntax) | 패키지 |
|----------|--------|---------|
| **클래식 DSL** | `single { Class(get()) }` | `org.koin.dsl` |
| **클래식 오토와이어** | `singleOf(::Class)` | `org.koin.dsl` |
| **컴파일러 플러그인** | `single<Class>()` | `org.koin.plugin.module.dsl` |

:::tip
**컴파일러 플러그인 DSL**은 자동 와이어링(auto-wiring)과 컴파일 타임 안전성을 제공합니다. [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 확인하세요.
:::

## Application DSL

`KoinApplication` 인스턴스는 설정된 Koin 컨테이너를 나타냅니다. 이를 통해 로깅 설정, 프로퍼티 로딩 및 모듈 등록을 할 수 있습니다.

### KoinApplication 생성하기

두 가지 방식 중 하나를 선택하세요:

* `koinApplication { }` - 독립적인 `KoinApplication` 인스턴스를 생성합니다.
* `startKoin { }` - `KoinApplication`을 생성하고 이를 `GlobalContext`에 등록합니다.

```kotlin
// 독립형 인스턴스 (테스트 또는 커스텀 컨텍스트에 유용)
val koinApp = koinApplication {
    modules(myModule)
}

// 글로벌 인스턴스 (애플리케이션을 위한 표준 방식)
startKoin {
    logger()
    modules(myModule)
}
```

### 설정 함수 (Configuration Functions)

`koinApplication` 또는 `startKoin` 내부에서 다음 함수들을 사용할 수 있습니다:

* `logger()` - 로그 레벨과 로거(Logger) 구현체를 설정합니다 (기본값: EmptyLogger).
* `modules()` - 컨테이너에 모듈을 로드합니다 (list 또는 vararg를 허용).
* `properties()` - HashMap 프로퍼티를 로드합니다.
* `fileProperties()` - 파일에서 프로퍼티를 로드합니다.
* `environmentProperties()` - OS 환경 변수에서 프로퍼티를 로드합니다.
* `createEagerInstances()` - `createdAtStart`로 표시된 모든 정의의 인스턴스를 생성합니다.
* `allowOverride(Boolean)` - 정의 오버라이딩 활성화/비활성화 여부를 설정합니다 (3.1.0 버전부터 기본값은 true).

### Global vs Local 컨텍스트

`koinApplication`과 `startKoin`의 핵심적인 차이점은 다음과 같습니다:

- **`startKoin`** - 컨테이너를 `GlobalContext`에 등록하여 `KoinComponent`, `by inject()` 및 기타 글로벌 API를 통해 접근할 수 있게 합니다.
- **`koinApplication`** - 직접 제어하는 격리된 인스턴스를 생성합니다.

```kotlin
// 글로벌 컨텍스트 - 표준 사용법
startKoin {
    logger()
    modules(appModule)
}

// 이후 애플리케이션 어디에서나:
class MyClass : KoinComponent {
    val service: Service by inject() // GlobalContext를 사용함
}
```

```kotlin
// 로컬 컨텍스트 - 고급 사용법 (테스트, 다중 컨텍스트 앱 등)
val customKoin = koinApplication {
    modules(testModule)
}.koin

val service = customKoin.get<Service>() // 특정 인스턴스를 사용함
```

### Koin 시작하기

전체적인 Koin 설정 예시입니다:

```kotlin
startKoin {
    // 로깅 설정
    logger(Level.INFO)

    // 프로퍼티 로드
    environmentProperties()

    // 모듈 선언
    modules(
        networkModule,
        databaseModule,
        repositoryModule,
        viewModelModule
    )

    // 즉시 초기화되는 싱글톤 생성
    createEagerInstances()
}
```

## Module DSL

모듈 및 정의에 대한 종합적인 문서는 다음을 참조하세요:
- **[정의(Definitions)](/docs/reference/koin-core/definitions)** - DSL 및 어노테이션을 사용한 모든 정의 타입
- **[모듈(Modules)](/docs/reference/koin-core/modules)** - 모듈 조직화 및 구성
- **[정의 참조(Definitions Reference)](/docs/reference/koin-core/definitions)** - 빠른 조회를 위한 테이블

### 빠른 참조 (Quick Reference)

| 정의 | 클래식 람다 | 클래식 오토와이어 | 컴파일러 플러그인 |
|------------|----------------|------------------|-----------------|
| 싱글톤 (Singleton) | `single { Class(get()) }` | `singleOf(::Class)` | `single<Class>()` |
| 팩토리 (Factory) | `factory { Class(get()) }` | `factoryOf(::Class)` | `factory<Class>()` |
| 스코프 (Scoped) | `scoped { Class(get()) }` | `scopedOf(::Class)` | `scoped<Class>()` |
| 뷰모델 (ViewModel) | `viewModel { VM(get()) }` | `viewModelOf(::VM)` | `viewModel<VM>()` |

### 기본 모듈

```kotlin
val myModule = module {
    single<Database>()
    single<UserRepository>()
    factory<UserPresenter>()
}
```

### 모듈 구성 (Module Composition)

```kotlin
val appModule = module {
    includes(networkModule, databaseModule)
    single<AppConfig>()
}

startKoin {
    modules(appModule)
}
```

자세한 내용은 **[Modules - includes()](/docs/reference/koin-core/modules#module-composition-with-includes)**를 참조하세요.