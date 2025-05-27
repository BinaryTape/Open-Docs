---
title: 릴리스 및 API 호환성 가이드
custom_edit_url: null
---

:::info
이 페이지는 Koin의 모든 주요 릴리스에 대한 포괄적인 개요를 제공하며, 프레임워크의 진화를 자세히 설명하여 업그레이드를 계획하고 호환성을 유지하는 데 도움을 줍니다.
:::

각 버전에 대해 문서는 다음 섹션으로 구성됩니다.

- `Kotlin`: 릴리스에 사용된 Kotlin 버전을 명시하여 언어 호환성을 명확히 하고 최신 Kotlin 기능을 활용할 수 있도록 합니다.
- `New`: 기능성과 개발자 경험을 향상시키는 새롭게 도입된 기능과 개선 사항을 강조합니다.
- `Experimental`: 실험적(experimental)으로 표시된 API 및 기능을 나열합니다. 이들은 활발히 개발 중이며 커뮤니티 피드백에 따라 변경될 수 있습니다.
- `Deprecated`: 더 이상 사용되지 않음(deprecated)으로 표시된 API 및 기능을 식별하며, 권장 대안에 대한 지침을 제공하여 향후 제거에 대비할 수 있도록 돕습니다.
- `Breaking`: 하위 호환성(backward compatibility)을 깨뜨릴 수 있는 변경 사항을 상세히 설명하여 마이그레이션 중 필요한 조정 사항을 인지하도록 합니다.

이러한 구조화된 접근 방식은 각 릴리스의 점진적인 변경 사항을 명확히 할 뿐만 아니라 Koin 프로젝트의 투명성, 안정성, 지속적인 개선에 대한 우리의 약속을 강화합니다.

## 4.0.3

:::note
Kotlin 버전 사용: `2.0.21`
:::

사용된 모든 라이브러리 버전은 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml)에서 확인할 수 있습니다.

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 새로운 Kotlin 버전과 함께, 새로운 `kotlin.uuid.uuid` API의 이점을 얻게 됩니다. `KoinPlatformTools.generateId()` Koin 함수는 이제 이 새로운 API를 사용하여 모든 플랫폼에서 실제 UUID를 생성합니다.

`koin-viewmodel`
 - Koin 4.0은 Google/Jetbrains KMP API를 통합하는 새로운 ViewModel DSL 및 API를 도입합니다. 코드베이스 전반의 중복을 피하기 위해, ViewModel API는 이제 `koin-core-viewmodel` 및 `koin-core-viewmodel-navigation` 프로젝트에 위치합니다.
 - ViewModel DSL을 위한 임포트(import)는 `org.koin.core.module.dsl.*`입니다.

주어진 프로젝트의 다음 API들은 이제 안정화되었습니다.

`koin-core-coroutines` - 모든 API는 이제 안정화되었습니다.
  - 모든 `lazyModules`
  - `awaitAllStartJobs`, `onKoinStarted`, `isAllStartedJobsDone`
  - `waitAllStartJobs`, `runOnKoinStarted`
  - `KoinApplication.coroutinesEngine`
  - `Module.includes(lazy)`
  - `lazyModule()`
  - `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - `Verify` API를 위한 동적 매개변수 주입 설계를 돕는 새로운 API

`koin-androidx-startup`
- `koin-androidx-startup` - `androidx.startup.Initializer` API를 사용하여 `AndroidX Startup`으로 Koin을 시작하는 새로운 기능. `koin-androidx-startup` 내의 모든 API는 실험적(Experimental)입니다.

`koin-compose`
- `rememberKoinModules` - @Composable 컴포넌트에 따라 Koin 모듈 로드/언로드
- `rememberKoinScope` - @Composable 컴포넌트에 따라 Koin 스코프 로드/언로드
- `KoinScope` - 모든 하위 Composable 자식들을 위해 Koin 스코프 로드

### Deprecation ⚠️

다음 API는 더 이상 사용되지 않음(deprecated)으로 지정되었으며, 더 이상 사용해서는 안 됩니다.

- `koin-test`
  - `checkModules`의 모든 API. `Verify` API로 마이그레이션하세요.

- `koin-android` 
  - `koin-core`의 새로운 중앙 집중식 DSL을 선호하여 ViewModel DSL

- `koin-compose-viewmodel` 
  - `koin-core`의 새로운 중앙 집중식 DSL을 선호하여 ViewModel DSL
  - 함수 `koinNavViewModel`은 이제 `koinViewModel`을 선호하여 더 이상 사용되지 않습니다.

### Breaking 💥

다음 API는 지난 마일스톤에서의 더 이상 사용되지 않음(deprecation)으로 인해 제거되었습니다.

:::note
`@KoinReflectAPI`로 주석 처리된 모든 API가 제거되었습니다.
:::

`koin-core`
  - `ApplicationAlreadyStartedException`이 `KoinApplicationAlreadyStartedException`으로 이름이 변경되었습니다.
  - `KoinScopeComponent.closeScope()`가 내부적으로 더 이상 사용되지 않으므로 제거되었습니다.
  - 내부 `ResolutionContext`를 `InstanceContext`를 대체하도록 이동했습니다.
  - `KoinPlatformTimeTools`, `Timer`, `measureDuration`이 제거되었으며, 대신 Kotlin Time API를 사용합니다.
  - `KoinContextHandler`가 `GlobalContext`를 선호하여 제거되었습니다.

`koin-android` 
  - 모든 상태 ViewModel API는 오류 수준에서 더 이상 사용되지 않습니다: 
    - `stateViewModel()`, `getStateViewModel()` 대신 `viewModel()`을 사용하세요.
    - `getSharedStateViewModel()`, `sharedStateViewModel()` 대신 공유 인스턴스를 위해 `viewModel()` 또는 `activityViewModel()`을 사용하세요.
  - 함수 `fun Fragment.createScope()`가 제거되었습니다.
  - ViewModel 팩토리(주로 내부)와 관련된 모든 API가 새로운 내부 구조를 위해 재작업되었습니다.

`koin-compose`
  - 오래된 Compose API 함수는 오류 수준에서 더 이상 사용되지 않습니다:
    - 함수 `inject()`는 `koinInject()`를 선호하여 제거되었습니다.
    - 함수 `getViewModel()`은 `koinViewModel()`을 선호하여 제거되었습니다.
    - 함수 `rememberKoinInject()`는 `koinInject()`로 이동되었습니다.
  - 내부에서 더 이상 사용되지 않으므로 `StableParametersDefinition`이 제거되었습니다.
  - 모든 Lazy ViewModel API(오래된 `viewModel()`)가 제거되었습니다.
  - 내부적으로 더 이상 사용되지 않으므로 `rememberStableParametersDefinition()`이 제거되었습니다.

## 3.5.6

:::note
Kotlin 버전 사용: `1.9.22`
:::

사용된 모든 라이브러리 버전은 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml)에서 확인할 수 있습니다.

### New 🎉

`koin-core`
  - `KoinContext`는 이제 다음을 포함합니다:
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
  - `koinApplication()` 함수는 이제 여러 형식을 사용합니다:
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
  - `KoinAppDeclaration` - 선언 스타일을 여는 데 도움이 됩니다.
  - `KoinPlatformTimeTools` - JS를 위해 API Time을 사용합니다.
  - iOS - `synchronized` API - Touchlab Lockable API를 사용합니다.

`koin-androidx-compose`
  - 새로운 `KoinAndroidContext` - Android 환경에서 현재 Koin 컨텍스트에 바인딩합니다.

`koin-compose`
  - 새로운 `KoinContext` - 현재 기본 컨텍스트로 컨텍스트를 시작합니다.

`koin-ktor`
  - 이제 Ktor 인스턴스를 위해 격리된 컨텍스트를 사용합니다 (기본 컨텍스트 대신 `Application.getKoin()` 사용).
  - Koin 플러그인은 새로운 모니터링 기능을 도입합니다.
  - `RequestScope` - Ktor 요청에 스코프 인스턴스를 허용합니다.

### Experimental 🚧

`koin-android`
  - `ViewModelScope` - ViewModel 스코프를 위한 실험적 API를 도입합니다.

`koin-core-coroutines` - 백그라운드에서 모듈을 로드하는 새로운 API 도입

### Deprecation ⚠️

`koin-android`
  - `getLazyViewModelForClass()` API는 매우 복잡하며, 기본 전역 컨텍스트를 호출합니다. Android/Fragment API를 고수하는 것을 선호합니다.
  - `resolveViewModelCompat()`은 `resolveViewModel()`을 선호하여 더 이상 사용되지 않습니다.

`koin-compose`
  - 함수 `get()`과 `inject()`는 `koinInject()`를 선호하여 더 이상 사용되지 않습니다.
  - 함수 `getViewModel()`은 `koinViewModel()`을 선호하여 더 이상 사용되지 않습니다.
  - 함수 `rememberKoinInject()`는 `koinInject()`를 선호하여 더 이상 사용되지 않습니다.

### Breaking 💥

`koin-core`
  - `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)`가 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`를 대체합니다.
  - 속성 `KoinExtension.koin`이 함수 `KoinExtension.onRegister()`로 이동되었습니다. 
  - iOS - `MutableGlobalContext`를 사용하기 위한 `internal fun globalContextByMemoryModel(): KoinContext`

`koin-compose`
  - 함수 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)`는 `KoinContext` 및 `KoinAndroidContext`를 선호하여 제거되었습니다.

## 3.4.3

:::note
Kotlin 버전 사용: `1.8.21`
:::

### New 🎉

`koin-core`
  - Koin을 위한 확장 엔진 작성을 돕는 새로운 ExtensionManager API - `ExtensionManager` + `KoinExtension`
  - `parameterArrayOf` 및 `parameterSetOf`로 매개변수 API 업데이트

`koin-test`
  - `Verification` API - 모듈에서 `verify`를 실행하는 데 도움이 됩니다.

`koin-android`
  - ViewModel 주입을 위한 내부 요소
  - `AndroidScopeComponent.onCloseScope()` 함수 콜백 추가

`koin-android-test`
  - `Verification` API - 모듈에서 `androidVerify()`를 실행하는 데 도움이 됩니다.

`koin-androidx-compose`
  - 새로운 `get()`
  - 새로운 `getViewModel()`
  - 새로운 스코프 `KoinActivityScope`, `KoinFragmentScope`

`koin-androidx-compose-navigation` - 내비게이션을 위한 새로운 모듈
  - 새로운 `koinNavViewModel()`

`koin-compose` - Compose를 위한 새로운 멀티플랫폼 API
  - `koinInject`, `rememberKoinInject`
  - `KoinApplication`

### Experimental 🚧

`koin-compose` - Compose를 위한 새로운 실험적 멀티플랫폼 API
  - `rememberKoinModules`
  - `KoinScope`, `rememberKoinScope`

### Deprecation ⚠️

`koin-compose`
- 지연(Lazy) 함수 사용을 피하면서 `inject()` 사용을 대체하는 함수 `get()`
- 지연(Lazy) 함수 사용을 피하면서 `viewModel()` 함수를 대체하는 함수 `getViewModel()`

### Breaking 💥

`koin-android`
  - `LifecycleScopeDelegate`는 이제 제거되었습니다.

`koin-androidx-compose`
  - `koinViewModel`을 선호하여 `getStateViewModel` 제거