---
title: Jetpack Compose 및 Compose Multiplatform용 Koin
---

이 페이지에서는 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 또는 [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) 앱에 의존성을 주입하는 방법을 설명합니다.

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

2024년 중반부터 Compose 애플리케이션은 Koin Multiplatform API를 사용하여 개발할 수 있습니다. 모든 API는 Koin Jetpack Compose (`koin-androidx-compose`)와 Koin Compose Multiplatform (`koin-compose`) 간에 동일합니다.

### Compose용 Koin 패키지는 무엇인가요?

Android Jetpack Compose API만 사용하는 순수 Android 앱의 경우 다음 패키지를 사용하세요.
- `koin-androidx-compose` - Compose 기본 API + Compose ViewModel API를 잠금 해제합니다.
- `koin-androidx-compose-navigation` - Navigation API 통합을 포함한 Compose ViewModel API

Android/Multiplatform 앱의 경우 다음 패키지를 사용하세요.
- `koin-compose` - Compose 기본 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Navigation API 통합을 포함한 Compose ViewModel API

## 기존 Koin 컨텍스트에서 시작하기

Compose 애플리케이션 이전에 `startKoin` 함수를 사용하면 애플리케이션은 Koin 주입을 받아들일 준비가 됩니다. Compose로 Koin 컨텍스트를 설정하기 위해 더 이상 필요한 것은 없습니다.

:::note
`KoinContext` 및 `KoinAndroidContext`는 더 이상 사용되지 않습니다.
:::

## Compose 앱으로 Koin 시작하기 - KoinApplication
`startKoin` 함수를 실행할 수 있는 공간에 접근할 수 없는 경우, Compose와 Koin에 의존하여 Koin 설정을 시작할 수 있습니다.

`KoinApplication` Compose 함수는 Composable로서 Koin 애플리케이션 인스턴스를 생성하는 데 도움을 줍니다.

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
(실험적 API)
`KoinMultiplatformApplication`을 사용하여 멀티플랫폼 진입점을 대체할 수 있습니다. 이는 `KoinApplication`과 동일하지만, 자동으로 `androidContext`와 `androidLogger`를 주입합니다.
:::

## KoinApplicationPreview를 사용한 Compose 미리보기

`KoinApplicationPreview` Compose 함수는 Composable을 미리보기하는 데 전용됩니다.

```kotlin
@Preview(name = "1 - Pixel 2 XL", device = Devices.PIXEL_2_XL, locale = "en")
@Preview(name = "2 - Pixel 5", device = Devices.PIXEL_5, locale = "en", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Preview(name = "3 - Pixel 7 ", device = Devices.PIXEL_7, locale = "ru", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun previewVMComposable(){
    KoinApplicationPreview(application = { modules(appModule) }) {
        ViewModelComposable()
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

클래식한 single/factory 인스턴스에 접근하는 것과 마찬가지로, 다음 Koin ViewModel API에 접근할 수 있습니다.

*   `koinViewModel()` - ViewModel 인스턴스 주입
*   `koinNavViewModel()` - ViewModel 인스턴스 + Navigation 인자 데이터 주입 (`Navigation` API를 사용하는 경우)

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
Jetpack Compose 업데이트와 함께 Lazy API는 지원되지 않습니다.
:::

### 공유 Activity ViewModel (4.1 - Android)

이제 `koinActivityViewModel()`을 사용하여 동일한 ViewModel 호스트인 Activity에서 ViewModel을 주입할 수 있습니다.

```kotlin
@Composable
fun App() {
    // Activity 수준에서 ViewModel 인스턴스를 유지
    val vm = koinActivityViewModel<MyViewModel>()
}
```

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

### 공유 ViewModel 및 Navigation (실험적)

Koin Compose Navigation은 이제 현재 `NavBackEntry`에 이미 저장된 ViewModel을 검색할 수 있도록 `NavBackEntry.sharedKoinViewModel()` 함수를 제공합니다. 내비게이션 부분에서 `sharedKoinViewModel`을 사용하기만 하면 됩니다.

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // 여기에 SharedViewModel 사용 ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

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

`rememberKoinScope` 및 `KoinScope` Composable 함수는 Composable 내에서 Koin Scope를 처리하고, Composable이 종료되면 현재 스코프를 추적하여 닫을 수 있도록 합니다.

:::info
이 API는 아직 불안정합니다.
:::