---
title: Jetpack Compose 및 Compose Multiplatform을 위한 Koin
---

이 페이지는 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 또는 [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) 앱에서 의존성(dependencies)을 주입하는 방법을 설명합니다.

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

2024년 중반부터 Compose 애플리케이션은 Koin 멀티플랫폼(Multiplatform) API를 사용하여 개발할 수 있게 되었습니다. Koin Jetpack Compose(`koin-androidx-compose`)와 Koin Compose Multiplatform(`koin-compose`) 사이의 모든 API는 동일합니다.

### Compose를 위한 Koin 패키지 선택

Android Jetpack Compose API만 사용하는 순수 Android 앱의 경우, 다음 패키지를 사용하세요:
- `koin-androidx-compose` - Compose 기본 API + Compose ViewModel API 활성화
- `koin-androidx-compose-navigation` - Navigation API가 통합된 Compose ViewModel API

Android/멀티플랫폼 앱의 경우, 다음 패키지를 사용하세요:
- `koin-compose` - Compose 기본 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Navigation API가 통합된 Compose ViewModel API

## 기존 Koin 컨텍스트에서 시작하기

Compose 애플리케이션 실행 전에 `startKoin` 함수를 사용하면, 애플리케이션에서 Koin 주입을 사용할 준비가 된 것입니다. Compose와 함께 Koin 컨텍스트를 설정하기 위해 추가로 요구되는 사항은 없습니다.

:::note
`KoinContext`와 `KoinAndroidContext`는 지원 중단(deprecated)되었습니다.
:::

## Compose 앱에서 Koin 시작하기 - KoinApplication
`startKoin` 함수를 실행할 수 있는 공간에 접근할 수 없는 경우, Compose와 Koin에 의존하여 Koin 설정을 시작할 수 있습니다.

컴포저블(Composable) 함수인 `KoinApplication`은 Koin 애플리케이션 인스턴스를 생성하는 데 도움을 줍니다:

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 여기에 스크린 구현 ...
        MyScreen()
    }
}
```

`KoinApplication` 함수는 Compose 컨텍스트의 주기에 따라 Koin 컨텍스트의 시작과 중단을 처리합니다. 이 함수는 새로운 Koin 애플리케이션 컨텍스트를 시작하고 종료합니다.

:::info
Android 애플리케이션에서 `KoinApplication`은 구성 변경(configuration changes)이나 액티비티(Activity) 종료와 관련된 Koin 컨텍스트의 중단/재시작 요구 사항을 처리합니다.
:::

:::note
(실험적 API)
`KoinMultiplatformApplication`을 사용하여 멀티플랫폼 진입점을 대체할 수 있습니다. 이는 `KoinApplication`과 동일하지만, `androidContext`와 `androidLogger`를 자동으로 주입해 줍니다.
:::

## KoinApplicationPreview를 사용한 Compose 미리보기

`KoinApplicationPreview` 컴포저블 함수는 컴포저블의 미리보기(Preview)를 위해 설계되었습니다:

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

컴포저블 함수를 작성하는 동안, Koin 컨테이너에서 인스턴스를 주입하기 위해 `koinInject()` API를 사용할 수 있습니다.

'MyService' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
val androidModule = module {
    single { MyService() }
    // 또는 생성자 DSL
    singleOf(::MyService)
}
```

다음과 같이 인스턴스를 가져올 수 있습니다:

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

Jetpack Compose의 함수형 특성에 맞게 유지하려면, 인스턴스를 함수 파라미터에 직접 주입하는 것이 가장 좋은 작성 방식입니다. 이 방식을 사용하면 Koin을 통한 기본 구현을 가질 수 있으면서도, 원하는 방식으로 인스턴스를 주입할 수 있도록 개방된 구조를 유지할 수 있습니다.

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 파라미터와 함께 @Composable에 주입하기

Koin에서 새로운 의존성을 요청할 때 파라미터를 주입해야 할 수도 있습니다. 이를 위해 `koinInject` 함수의 `parameters` 파라미터와 `parametersOf()` 함수를 다음과 같이 사용할 수 있습니다:

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
`koinInject<MyService>{ parametersOf("a_string") }`와 같이 람다 주입을 사용하여 파라미터를 사용할 수도 있지만, 주변에서 리컴포지션(recomposition)이 많이 발생하는 경우 성능에 영향을 줄 수 있습니다. 이 람다 버전은 파라미터를 기억(remember)하지 않도록 돕기 위해 호출 시 파라미터의 래핑을 해제해야 합니다.

Koin 버전 4.0.2부터는 가장 효율적인 방식으로 파라미터를 사용할 수 있도록 `koinInject(Qualifier, Scope, ParametersHolder)`가 도입되었습니다.
:::

## @Composable을 위한 ViewModel

일반적인 single/factory 인스턴스에 접근하는 것과 동일한 방식으로, 다음과 같은 Koin ViewModel API를 사용할 수 있습니다:

* `koinViewModel()` - ViewModel 인스턴스 주입
* `koinNavViewModel()` - ViewModel 인스턴스 + 네비게이션 인자(Navigation arguments) 데이터 주입 (`Navigation` API를 사용하는 경우)

'MyViewModel' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
module {
    viewModel { MyViewModel() }
    // 또는 생성자 DSL
    viewModelOf(::MyViewModel)
}
```

다음과 같이 인스턴스를 가져올 수 있습니다:

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

함수 파라미터에서 인스턴스를 가져올 수도 있습니다:

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose의 업데이트에 따라 Lazy API는 지원되지 않습니다.
:::

### 공유 액티비티 ViewModel (4.1 - Android)

이제 `koinActivityViewModel()`을 사용하여 동일한 ViewModel 호스트인 Activity로부터 ViewModel을 주입받을 수 있습니다.

```kotlin
@Composable
fun App() {
    // Activity 레벨에서 ViewModel 인스턴스 유지
    val vm = koinActivityViewModel<MyViewModel>()
}
```

### @Composable을 위한 ViewModel 및 SavedStateHandle

Compose 환경(Navigation BackStack 또는 ViewModel)에 따라 주입될 `SavedStateHandle` 생성자 파라미터를 가질 수 있습니다.
이는 ViewModel `CreationExtras`를 통해 주입되거나 Navigation `BackStackEntry`를 통해 주입됩니다:

```kotlin
// Navhost에서 objectId 인자 설정
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
SavedStateHandle 주입 차이에 대한 자세한 내용: https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

### 공유 ViewModel 및 네비게이션 (실험적)

Koin Compose Navigation에는 이제 현재 `NavBackEntry`에 이미 저장된 ViewModel을 검색할 수 있는 `NavBackEntry.sharedKoinViewModel()` 함수가 있습니다. 네비게이션 부분 내부에서 `sharedKoinViewModel`을 사용하기만 하면 됩니다:

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // 여기서 SharedViewModel 사용 ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

## 컴포저블에 연결된 모듈 로드 및 언로드

Koin은 주어진 컴포저블 함수에 대해 특정 모듈을 로드하는 방법을 제공합니다. `rememberKoinModules` 함수는 Koin 모듈을 로드하고 현재 컴포저블에서 이를 기억합니다:

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 이 컴포넌트의 첫 번째 호출 시 모듈 로드
    rememberKoinModules(myModule)
}
```

두 가지 측면에서 모듈을 언로드하기 위해 abandon 함수 중 하나를 사용할 수 있습니다:
- onForgotten - 컴포지션이 삭제된 후
- onAbandoned - 컴포지션이 실패한 경우

이를 위해 `rememberKoinModules`의 `unloadOnForgotten` 또는 `unloadOnAbandoned` 인자를 사용하세요.

## 컴포저블로 Koin 스코프 생성하기

컴포저블 함수 `rememberKoinScope`와 `KoinScope`를 사용하면 컴포저블 내에서 Koin 스코프(Scope)를 처리할 수 있으며, 컴포저블이 종료되면 스코프를 닫도록 후속 처리를 지원합니다.

:::info
이 API는 현재 아직 불안정한(unstable) 상태입니다.
:::