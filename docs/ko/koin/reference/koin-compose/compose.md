---
title: Jetpack Compose 및 Compose Multiplatform용 Koin
---

이 페이지에서는 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 또는 [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) 앱에 의존성을 주입하는 방법을 설명합니다.

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

2024년 중반부터 Compose 애플리케이션은 Koin Multiplatform API를 사용하여 개발할 수 있습니다. 모든 API는 Koin Jetpack Compose (`koin-androidx-compose`)와 Koin Compose Multiplatform (`koin-compose`) 간에 동일합니다.

### Compose용 Koin 패키지는 무엇인가요?

Android Jetpack Compose API만 사용하는 순수 Android 앱의 경우 다음 패키지를 사용하세요.
- `koin-androidx-compose` - Compose 기본 API + Compose ViewModel API를 제공합니다.
- `koin-androidx-compose-navigation` - Navigation API 통합을 포함한 Compose ViewModel API를 제공합니다.

Android/Multiplatform 앱의 경우 다음 패키지를 사용하세요.
- `koin-compose` - Compose 기본 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Navigation API 통합을 포함한 Compose ViewModel API

## 기존 Koin 컨텍스트에서 시작하기 (Koin이 이미 시작된 경우)

때로는 애플리케이션에서 Koin을 시작하기 위해 (예: Android 메인 앱 클래스인 `Application` 클래스에서) `startKoin` 함수가 이미 사용되는 경우가 있습니다. 이 경우 `KoinContext` 또는 `KoinAndroidContext`를 사용하여 현재 Koin 컨텍스트를 Compose 애플리케이션에 알려야 합니다. 이 함수들은 현재 Koin 컨텍스트를 재사용하여 Compose 애플리케이션에 바인딩합니다.

```kotlin
@Composable
fun App() {
    // 현재 Koin 인스턴스를 Compose 컨텍스트에 설정
    KoinContext() {

        MyScreen()
    }
}
```

:::info
`KoinAndroidContext`와 `KoinContext`의 차이점:
- `KoinAndroidContext`는 현재 Android 앱 컨텍스트에서 Koin 인스턴스를 찾습니다.
- `KoinContext`는 현재 GlobalContext에서 Koin 인스턴스를 찾습니다.
:::

:::note
Composable에서 `ClosedScopeException`이 발생한다면, 해당 Composable에서 `KoinContext`를 사용하거나 [Android 컨텍스트를 사용한 Koin 시작 구성](/docs/reference/koin-android/start.md#from-your-application-class)이 올바르게 설정되었는지 확인하세요.
:::

## Compose 앱으로 Koin 시작하기 - KoinApplication

`KoinApplication` 함수는 Composable로서 Koin 애플리케이션 인스턴스를 생성하는 데 도움을 줍니다.

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 여기에 화면들을 추가...
        MyScreen()
    }
}
```

`KoinApplication` 함수는 Compose 컨텍스트의 주기에 따라 Koin 컨텍스트의 시작 및 중지를 처리합니다. 이 함수는 새로운 Koin 애플리케이션 컨텍스트를 시작하고 중지합니다.

:::info
Android 애플리케이션에서 `KoinApplication`은 구성 변경 또는 Activity 제거에 따른 Koin 컨텍스트 중지/재시작의 모든 필요성을 처리합니다.
:::

:::note
이는 기존 `startKoin` 애플리케이션 함수의 사용을 대체합니다.
:::

### Koin을 사용한 Compose 미리보기

`KoinApplication` 함수는 미리보기를 위한 전용 컨텍스트를 시작하는 데 유용합니다. 이는 Compose 미리보기를 돕는 데도 사용될 수 있습니다.

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // 여기에 미리보기 구성
        modules(previewModule)
    }) {
        // Koin을 사용하여 미리보기할 Compose
    }
}
```

## @Composable에 주입하기

Composable 함수를 작성하는 동안 Koin 컨테이너에서 인스턴스를 주입하는 Koin API인 `koinInject()`에 접근할 수 있습니다.

'MyService' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
val androidModule = module {
    single { MyService() }
    // 또는 생성자 DSL
    singleOf(::MyService)
}
```

인스턴스를 다음과 같이 가져올 수 있습니다.

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

Jetpack Compose의 함수형 측면에 맞춰, 가장 좋은 작성 방식은 인스턴스를 함수의 매개변수에 직접 주입하는 것입니다. 이 방식은 Koin을 사용한 기본 구현을 허용하면서도 원하는 방식으로 인스턴스를 주입할 수 있도록 개방합니다.

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 매개변수를 사용하여 @Composable에 주입하기

Koin에서 새로운 의존성을 요청할 때 매개변수를 주입해야 할 수도 있습니다. 이를 위해서는 `koinInject` 함수의 `parameters` 매개변수를 `parametersOf()` 함수와 함께 다음과 같이 사용할 수 있습니다.

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
`koinInject<MyService>{ parametersOf("a_string") }`와 같이 람다 주입과 함께 매개변수를 사용할 수 있지만, 리컴포징이 많이 일어나는 경우 성능에 영향을 미칠 수 있습니다. 이 람다 버전은 호출 시 매개변수를 언랩해야 매개변수를 기억하지 않도록 돕습니다.

Koin 버전 4.0.2부터 `koinInject(Qualifier,Scope,ParametersHolder)`가 도입되어 가장 효율적인 방식으로 매개변수를 사용할 수 있습니다.
:::

## @Composable용 ViewModel

클래식한 single/factory 인스턴스에 접근하는 것과 마찬가지로, 다음과 같은 Koin ViewModel API에 접근할 수 있습니다.

*   `koinViewModel()` - ViewModel 인스턴스 주입
*   `koinNavViewModel()` - ViewModel 인스턴스 + Navigation 인자 데이터 주입 (Navigation API를 사용하는 경우)

'MyViewModel' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
module {
    viewModel { MyViewModel() }
    // 또는 생성자 DSL
    viewModelOf(::MyViewModel)
}
```

인스턴스를 다음과 같이 가져올 수 있습니다.

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

함수 매개변수에서 인스턴스를 가져올 수 있습니다.

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Lazy API는 Jetpack Compose 업데이트와 함께 지원되지 않습니다.
:::

### @Composable용 ViewModel 및 SavedStateHandle

`SavedStateHandle` 생성자 매개변수를 가질 수 있으며, 이는 Compose 환경(Navigation BackStack 또는 ViewModel)에 따라 주입됩니다.
이는 ViewModel `CreationExtras`를 통해 주입되거나 Navigation `BackStackEntry`를 통해 주입됩니다.

```kotlin
// NavHost에 objectId 인자 설정
NavHost(
    navController,
    startDestination = "list"
) {
    composable("list") { backStackEntry ->
        //...
    }
    composable("detail/{objectId}") { backStackEntry ->
        val objectId = backStackEntry.arguments?.getString("objectId")?.toInt()
        DetailScreen(navController, objectId!!)
    }
}

// ViewModel에 주입된 인자
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
SavedStateHandle 주입 차이에 대한 자세한 내용은 다음을 참조하세요: https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

## Composable에 연결된 모듈 로드 및 언로드

Koin은 주어진 Composable 함수에 대해 특정 모듈을 로드하는 방법을 제공합니다. `rememberKoinModules` 함수는 Koin 모듈을 로드하고 현재 Composable에서 유지합니다.

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 이 컴포넌트의 첫 호출 시 모듈 로드
    rememberKoinModules(myModule)
}
```

두 가지 측면에서 모듈을 언로드하는 `abandon` 함수 중 하나를 사용할 수 있습니다.
- `onForgotten` - 컴포지션이 제거된 후
- `onAbandoned` - 컴포지션이 실패한 경우

이를 위해 `rememberKoinModules`의 `unloadOnForgotten` 또는 `unloadOnAbandoned` 인자를 사용하세요.

## Composable을 사용하여 Koin Scope 생성

Composable 함수 `rememberKoinScope`와 `KoinScope`는 Composable 내에서 Koin Scope를 처리하고, Composable이 종료되면 현재 스코프를 추적하여 닫을 수 있도록 합니다.

:::info
이 API는 아직 불안정합니다.
:::