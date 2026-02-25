---
title: 릴리스 및 API 업그레이드 가이드
custom_edit_url: null
---

:::info
이 페이지는 Koin의 각 주요 릴리스에 대한 종합적인 개요를 제공하며, 프레임워크의 발전 과정을 상세히 설명하여 업그레이드 계획을 세우고 호환성을 유지하는 데 도움을 줍니다.
:::

각 버전에 대해 문서는 다음과 같은 섹션으로 구성됩니다:

- `Kotlin`: 언어 호환성을 명확히 하고 최신 Kotlin 기능을 활용할 수 있도록 릴리스에 사용된 Kotlin 버전을 지정합니다.
- `New`: 기능과 개발자 경험을 향상시키는 새롭게 도입된 기능 및 개선 사항을 강조합니다.
- `Experimental`: 실험 단계로 표시된 API 및 기능을 나열합니다. 이들은 활발히 개발 중이며 커뮤니티 피드백에 따라 변경될 수 있습니다.
- `Deprecated`: 지원 중단 예정으로 표시된 API 및 기능과 권장되는 대안을 식별하여, 향후 삭제에 대비할 수 있도록 돕습니다.
- `Breaking`: 하위 호환성을 깨뜨릴 수 있는 변경 사항을 상세히 설명하여 마이그레이션 중 필요한 조정을 인지할 수 있도록 합니다.

이러한 구조화된 접근 방식은 각 릴리스의 점진적인 변화를 명확히 할 뿐만 아니라, Koin 프로젝트의 투명성, 안정성 및 지속적인 개선에 대한 우리의 약속을 강화합니다.

자세한 내용은 [API 안정성 계약(Api Stability Contract)](api-stability.md)을 참조하세요.

## 4.1.1

:::note
Kotlin `2.1.21` 사용
:::

### 새로운 기능 🎉

`koin-compose-viewmodel-navigation`
- Compose Navigation 지원 개선을 위해 선택적 `navGraphRoute` 파라미터가 포함된 `sharedKoinViewModel` 강화

`koin-core`
- 코어 리졸버(resolver) 성능 최적화 - 단일 스코프 해결 시 불필요한 플래트닝(flattening) 방지
- 연결된 스코프 ID 표시로 스코프 디버깅 강화

### 라이브러리 업데이트 📚

- **Kotlin** 2.1.21 (2.1.20에서 업데이트)
- **Ktor** 3.2.3 (3.1.3에서 업데이트) 
- **Jetbrains Compose** 1.8.2 (1.8.0에서 업데이트)
- **AndroidX**: Fragment 1.8.9, WorkManager 2.10.3, Lifecycle 2.9.3, Navigation 2.9.3
- **Testing**: Robolectric 4.15.1, Benchmark 0.4.14
- **Build**: Binary Validator 0.18.1, NMCP 1.1.0

### 버그 수정 🐛

`koin-core`
- 호환성 오류를 일으키던 로거(logger) 제약 조건 복구
- `LocalKoinApplication`/`LocalKoinScope` 컨텍스트 처리 개선을 통한 Compose 스코프 해결(resolution) 수정

`koin-build`
- Maven Central 배포 문제 수정

## 4.1.0

:::note
Kotlin `2.1.20` 사용
:::

### 새로운 기능 🎉

`koin-core`
- Configuration - 구성을 감싸는 데 도움을 주는 `KoinConfiguration` API
- Scope - 특정 스코프 카테고리를 위한 전용 Scope Type 한정자(qualifier)인 새로운 *Scope Archetype* 도입. 이제 스코프 카테고리(일명 Archetype)에 대해 인스턴스 해결 가능
- Feature Option - Koin 내부의 새로운 기능 동작을 기능 플래그(feature flag)로 지정하는 "Feature Option". Koin 구성의 `options` 블록에서 옵션 활성화 가능:
```kotlin
startKoin {
    options(
        // 새로운 기능 활성화
        viewModelScopeFactory()
    )
}
```
- Core - 외부 시스템이나 리소스에서 Koin이 해결할 수 있도록 돕는 `ResolutionExtension`을 허용하는 새로운 `CoreResolver` 도입 (Ktor DI 연결에 사용됨)

`koin-android`
- 업그레이드된 라이브러리(`androidx.appcompat:appcompat:1.7.0`, `androidx.activity:activity-ktx:1.10.1`)로 인해 최소 SDK 레벨이 14에서 21로 상향됨
- DSL - Activity/Fragment 내에서 스코프를 선언하기 위한 새로운 Koin 모듈 DSL 확장 함수 `activityScope`, `activityRetainedScope`, `fragmentScope` 추가
- 스코프 함수 - `activityScope()`, `activityRetainedScope()`, `fragmentScope()` API 함수가 이제 Scope Archetype을 트리거함

`koin-androidx-compose`
- Koin Compose Multiplatform 및 모든 Compose 1.8 & Lifecycle 2.9와 정렬됨

`koin-compose`
- Compose 1.8 & Lifecycle 2.9와 정렬됨
- 새로운 함수 - Android Studio 및 IntelliJ에서 병렬 프리뷰 렌더링을 돕는 `KoinApplicationPreview`

`koin-compose-viewmodel`
- 부모 Activity를 호스트로 설정할 수 있도록 `koinActivityViewModel` 추가

`koin-ktor`
- 멀티플랫폼 - 이제 모듈이 Kotlin KMP 형식으로 컴파일됨. 멀티플랫폼 프로젝트에서 `koin-ktor`를 대상으로 지정 가능
- 병합 - 이전의 koin-ktor3 모듈이 koin-ktor로 병합됨
- 확장 - Ktor 모듈에 직접 결합된 Koin 모듈을 선언할 수 있도록 `Application.koinModule { }` 및 `Application.koinModules()` 도입
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- 스코프 - `Module.requestScope` - Ktor 요청 스코프 내에서 정의(definition) 선언 가능 (`scope<RequestScope>`를 수동으로 선언하지 않아도 됨). 주입된 스코프는 생성자에서 `ApplicationCall`을 주입하는 것도 허용함

`koin-core-coroutines`
- 모듈 DSL - 모듈 구성을 하나의 구조로 모아 나중에 더 잘 검증할 수 있도록 돕는 새로운 `ModuleConfiguration` 도입
```kotlin
val m1 = module {
    single { Simple.ComponentA() }
}
val lm1 = lazyModule {
    single { Simple.ComponentB(get()) }
}
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}
```
- Configuration DSL - 이제 Koin 구성에서 `ModuleConfiguration`을 사용하여 모듈을 로드 가능:
```kotlin
startKoin {
    moduleConfiguration {
        modules(m1)
        lazyModules(lm1)
    }
}

// 또는 다음과 같이 사용 가능
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

startKoin {
    moduleConfiguration(conf)
}
```

`koin-test-coroutines`
- 새로운 코루틴 관련 테스트 API를 도입하기 위해 새로운 `koin-test-coroutines` Koin 모듈 추가
- 확장 - `moduleConfiguration`으로 Koin 구성을 확인하고, 모듈/Lazy 모듈 혼합 구성을 검증할 수 있도록 Verify API 확장:
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// Android 타입이 필요한 경우 (koin-android-test)
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- 애노테이션 - 속성을 주입된 파라미터 또는 동적으로 제공되는 것으로 간주하도록 태그하는 `@InjectedParam` 또는 `@Provided`. 현재 `Verify` API에서 사용되지만, 나중에 더 가벼운 DSL 선언을 돕는 데 사용될 수 있음

### 실험 단계 🚧

`koin-core`
- Wasm - Kotlin 2.1.20 UUID 생성 사용

`koin-core-viewmodel`
- DSL - ViewModel 스코프 아키타입에 컴포넌트를 할당하기 위한 모듈 DSL 확장 함수 `viewModelScope` 추가
- 스코프 함수 - ViewModel을 위한 스코프를 생성하는 `viewModelScope()` 함수 추가 (ViewModel 클래스에 고정됨). 이 API는 이제 `AutoCloseable` API를 사용하여 스코프를 선언하고 닫는 `ViewModelScopeAutoCloseable`을 사용함. 더 이상 ViewModel 스코프를 수동으로 닫을 필요가 없음
- 클래스 - 즉시 사용 가능한 ViewModel 스코프 클래스(스코프 생성 및 종료 처리)를 지원하도록 `ScopeViewModel` 클래스 업데이트
- Feature Option - ViewModel의 스코프를 사용한 생성자 ViewModel 주입은 Koin 옵션 `viewModelScopeFactory` 활성화가 필요함:
```kotlin
startKoin {
    options(
        // 새로운 ViewModel 스코프 생성 활성화
        viewModelScopeFactory()
    )
}

// MyScopeViewModel의 스코프에서 Session을 주입함
class MyScopeViewModel(val session: Session) : ViewModel()

module {
    viewModelOf(::MyScopeViewModel)
    viewModelScope {
        scopedOf(::Session)
    }
}
```

`koin-compose`
- Compose 함수 - 멀티플랫폼 Compose 진입점을 제안하기 위한 새로운 `KoinMultiplatformApplication` 함수 추가

`koin-core-viewmodel-navigation`
- 내비게이션 확장 - 내비게이션의 NavbackEntry에서 ViewModel 인스턴스를 재사용하기 위한 `sharedViewModel` 추가

`koin-test`
- 애노테이션 - Koin 구성 검증 API인 `Verify`가 이제 nullable, lazy, list 파라미터를 확인할 수 있도록 도움. 속성을 주입된 파라미터 또는 동적으로 제공되는 것으로 간주하도록 `@InjectedParam` 또는 `@Provided`를 사용하기만 하면 됨. 이를 통해 Verify API의 복잡한 선언을 피할 수 있음.
```kotlin
// 이제 Verify에서 감지됨
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### 지원 중단 예정 ⚠️

`koin-android`
- `ScopeViewModel`은 이제 지원 중단되었으며, 대신 `koin-core-viewmodel`의 `ScopeViewModel` 클래스를 사용해야 함

`koin-compose`
- Koin 컨텍스트가 현재 기본 컨텍스트에서 적절히 준비되므로 더 이상 Compose 컨텍스트 API가 필요하지 않음. 다음은 지원 중단되었으며 삭제 가능: `KoinContext`

`koin-androidx-compose`
- Koin 컨텍스트가 현재 기본 컨텍스트에서 적절히 준비되므로 더 이상 Jetpack compose 컨텍스트 API가 필요하지 않음. 다음은 지원 중단되었으며 삭제 가능: `KoinAndroidContext`

`koin-androidx-compose-navigation`
- lifecycle 라이브러리 업데이트로 인해 `koinNavViewModel` 함수가 필요하지 않으며, `koinViewModel`로 대체 가능

`koin-core-viewmodel-navigation`
- lifecycle 라이브러리 업데이트로 인해 `koinNavViewModel` 함수가 필요하지 않으며, `koinViewModel`로 대체 가능

`koin-ktor`
- 확장 - `Application.koin`은 이제 `Application.koinModules` 및 `Application.koinModule`을 권장하며 지원 중단됨

### 호환성을 깨뜨리는 변경 사항 💥

`koin-android`
- 모든 이전 상태(state) ViewModel API가 삭제됨:
    - `stateViewModel()`, `getStateViewModel()`, 대신 `viewModel()` 사용
    - `getSharedStateViewModel()`, `sharedStateViewModel()`, 공유 인스턴스의 경우 대신 `viewModel()` 또는 `activityViewModel()` 사용

`koin-compose`
- 이전 compose API 함수가 삭제됨:
    - `inject()` 함수가 `koinInject()`를 권장하며 삭제됨
    - `getViewModel()` 함수가 `koinViewModel()`을 권장하며 삭제됨
    - `rememberKoinInject()` 함수가 `koinInject()`로 이동됨
- `rememberKoinApplication` 함수가 `@KoinInternalAPI`로 표시됨

## 4.0.4

:::note
Kotlin `2.0.21` 사용
:::

사용된 모든 라이브러리 버전은 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml)에 위치합니다.

### 새로운 기능 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 이번 새로운 Kotlin 버전에서 새로운 `kotlin.uuid.uuid` API의 이점을 얻게 됨. Koin의 `KoinPlatformTools.generateId()` 함수는 이제 이 새로운 API를 사용하여 플랫폼 전반에서 실제 UUID를 생성함

`koin-viewmodel`
- Koin 4.0은 Google/Jetbrains KMP API를 통합하는 ViewModel DSL 및 API를 도입함. 코드베이스 전반의 중복을 피하기 위해 ViewModel API는 이제 `koin-core-viewmodel` 및 `koin-core-viewmodel-navigation` 프로젝트에 위치함
- ViewModel DSL 임포트 경로는 `org.koin.core.module.dsl.*`임

해당 프로젝트의 다음 API들이 이제 안정화됨.

`koin-core-coroutines` - 모든 API가 안정화됨
- 모든 `lazyModules`
- `awaitAllStartJobs`, `onKoinStarted`, `isAllStartedJobsDone`
- `waitAllStartJobs`, `runOnKoinStarted`
- `KoinApplication.coroutinesEngine`
- `Module.includes(lazy)`
- `lazyModule()`
- `KoinPlatformCoroutinesTools`

### 실험 단계 🚧

`koin-test`
- `ParameterTypeInjection` - `Verify` API를 위한 동적 파라미터 주입 설계를 돕는 새로운 API

`koin-androidx-startup`
- `koin-androidx-startup` - `androidx.startup.Initializer` API를 사용하여 `AndroidX Startup`으로 Koin을 시작하는 새로운 기능. `koin-androidx-startup` 내부의 모든 API는 실험 단계임

`koin-compose`
- `rememberKoinModules` - @Composable 컴포넌트에 따라 Koin 모듈을 로드/언로드함
- `rememberKoinScope` - @Composable 컴포넌트에 따라 Koin 스코프를 로드/언로드함
- `KoinScope` - 모든 하위 Composable 자식들을 위해 Koin 스코프를 로드함

### 지원 중단 예정 ⚠️

다음 API들은 지원 중단되었으며 더 이상 사용해서는 안 됨:

- `koin-test`
    - `checkModules`와 관련된 모든 API. `Verify` API로 마이그레이션할 것.

- `koin-android`
    - koin-core의 새로운 중앙 집중식 DSL을 권장하며 ViewModel DSL 지원 중단
    - 모든 상태(state) ViewModel API가 오류 레벨로 지원 중단됨:
        - `stateViewModel()`, `getStateViewModel()`, 대신 `viewModel()` 사용
        - `getSharedStateViewModel()`, `sharedStateViewModel()`, 공유 인스턴스의 경우 대신 `viewModel()` 또는 `activityViewModel()` 사용

`koin-compose`
- 이전 compose API 함수가 오류 레벨로 지원 중단됨:
    - `inject()` 함수는 `koinInject()`를 권장하며 지원 중단됨(오류 레벨)
    - `getViewModel()` 함수는 `koinViewModel()`을 권장하며 지원 중단됨(오류 레벨)
    - `rememberKoinInject()` 함수는 `koinInject()`를 권장하며 지원 중단됨(오류 레벨)

- `koin-compose-viewmodel`
    - koin-core의 새로운 중앙 집중식 DSL을 권장하며 ViewModel DSL 지원 중단
    - `koinNavViewModel` 함수는 이제 `koinViewModel`을 권장하며 지원 중단됨

### 호환성을 깨뜨리는 변경 사항 💥

지난 마일스톤에서의 지원 중단으로 인해 다음 API들이 삭제됨:

:::note
`@KoinReflectAPI` 주석이 달린 모든 API가 삭제됨
:::

`koin-core`
- `ApplicationAlreadyStartedException`의 이름이 `KoinApplicationAlreadyStartedException`으로 변경됨
- 내부적으로 더 이상 사용되지 않는 `KoinScopeComponent.closeScope()` 삭제
- `InstanceContext`를 대체하기 위해 내부 `ResolutionContext` 이동
- Kotlin Time API를 사용하기 위해 `KoinPlatformTimeTools`, `Timer`, `measureDuration` 삭제
- `GlobalContext`를 권장하며 `KoinContextHandler` 삭제

`koin-android`
- `fun Fragment.createScope()` 함수 삭제
- ViewModel 팩토리 관련 모든 API(주로 내부용)가 새로운 내부 구조를 위해 재작업됨

`koin-compose`
- 내부에서 더 이상 사용되지 않는 `StableParametersDefinition` 삭제
- 모든 Lazy ViewModel API(`old viewModel()`) 삭제
- 내부에서 더 이상 사용되지 않는 `rememberStableParametersDefinition()` 삭제

## 3.5.6

:::note
Kotlin `1.9.22` 사용
:::

사용된 모든 라이브러리 버전은 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml)에 위치합니다.

### 새로운 기능 🎉

`koin-core`
- `KoinContext`에 다음이 추가됨:
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
- `koinApplication()` 함수가 이제 여러 형식을 사용함:
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
- 개방형 선언 스타일을 돕는 `KoinAppDeclaration`
- JS용 API Time을 사용하기 위한 `KoinPlatformTimeTools`
- iOS - Touchlab Lockable API를 사용하기 위한 `synchronized` API

`koin-androidx-compose`
- Android 환경의 현재 Koin 컨텍스트에 바인딩하기 위한 새로운 `KoinAndroidContext`

`koin-compose`
- 현재 기본 컨텍스트를 사용하는 새로운 `KoinContext` 컨텍스트 스타터

`koin-ktor`
- 이제 Ktor 인스턴스에 대해 격리된 컨텍스트를 사용함 (기본 컨텍스트 대신 `Application.getKoin()` 사용)
- Koin 플러그인에 새로운 모니터링 도입
- Ktor 요청에 인스턴스 스코프를 지정할 수 있는 `RequestScope`

### 실험 단계 🚧

`koin-android`
- `ViewModelScope` - ViewModel 스코프를 위한 실험적 API 도입

`koin-core-coroutines` - 백그라운드에서 모듈을 로드하는 새로운 API 도입

### 지원 중단 예정 ⚠️

`koin-android`
- `getLazyViewModelForClass()` API는 매우 복잡하며 기본 전역 컨텍스트를 호출함. 대신 Android/Fragment API를 사용하는 것을 권장
- `resolveViewModelCompat()`은 `resolveViewModel()`을 권장하며 지원 중단됨

`koin-compose`
- `get()` 및 `inject()` 함수는 Lazy 함수 사용을 피하기 위해 `koinInject()`를 권장하며 지원 중단됨
- `getViewModel()` 함수는 `koinViewModel()`을 권장하며 지원 중단됨
- `rememberKoinInject()` 함수는 `koinInject()`를 권장하며 지원 중단됨

### 호환성을 깨뜨리는 변경 사항 💥

`koin-core`
- `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)`가 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`를 대체함
- `KoinExtension.koin` 속성을 `KoinExtension.onRegister()` 함수로 이동
- iOS - `MutableGlobalContext`를 사용하기 위한 `internal fun globalContextByMemoryModel(): KoinContext`

`koin-compose`
- `KoinContext` 및 `KoinAndroidContext`를 권장하며 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 함수 삭제

## 3.4.3

:::note
Kotlin `1.8.21` 사용
:::

### 새로운 기능 🎉

`koin-core`
- Koin용 확장 엔진 작성을 돕는 새로운 ExtensionManager API - `ExtensionManager` + `KoinExtension`
- `parameterArrayOf` 및 `parameterSetOf`를 통한 파라미터 API 업데이트

`koin-test`
- `Verification` API - 모듈에서 `verify`를 실행할 수 있게 도움

`koin-android`
- ViewModel 주입을 위한 내부 구조 개선
- `AndroidScopeComponent.onCloseScope()` 함수 콜백 추가

`koin-android-test`
- `Verification` API - 모듈에서 `androidVerify()`를 실행할 수 있게 도움

`koin-androidx-compose`
- 새로운 `get()`
- 새로운 `getViewModel()`
- 새로운 스코프 `KoinActivityScope`, `KoinFragmentScope`

`koin-androidx-compose-navigation` - 내비게이션을 위한 새로운 모듈
- 새로운 `koinNavViewModel()`

`koin-compose` - Compose를 위한 새로운 멀티플랫폼 API
- `koinInject`, `rememberKoinInject`
- `KoinApplication`

### 실험 단계 🚧

`koin-compose` - Compose를 위한 새로운 실험적 멀티플랫폼 API
- `rememberKoinModules`
- `KoinScope`, `rememberKoinScope`

### 지원 중단 예정 ⚠️

`koin-compose`
- Lazy 함수를 피하기 위해 `inject()` 사용을 대체하는 `get()` 함수
- Lazy 함수를 피하기 위해 `viewModel()` 함수 사용을 대체하는 `getViewModel()` 함수

### 호환성을 깨뜨리는 변경 사항 💥

`koin-android`
- `LifecycleScopeDelegate` 삭제

`koin-androidx-compose`
- `koinViewModel`을 권장하며 `getStateViewModel` 삭제