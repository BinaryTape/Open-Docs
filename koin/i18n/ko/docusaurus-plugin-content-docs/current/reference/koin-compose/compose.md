---
title: "Jetpack Compose 및 Compose Multiplatform용 Koin"
---
이 페이지에서는 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 또는 [Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/) 앱에 대한 의존성을 주입하는 방법을 설명합니다.

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

2024년 중반부터 Compose 애플리케이션은 Koin Multiplatform API로 만들 수 있습니다. 모든 API는 Koin Jetpack Compose (koin-androidx-compose)와 Koin Compose Multiplatform (koin-compose) 간에 동일합니다.

### Compose용 Koin 패키지?

Android Jetpack Compose API만 사용하는 순수 Android 앱의 경우 다음 패키지를 사용하십시오.
- `koin-androidx-compose` - Compose 기본 API + Compose ViewModel API를 잠금 해제합니다.
- `koin-androidx-compose-navigation` - Navigation API 통합을 통한 Compose ViewModel API

Android/Multiplatform 앱의 경우 다음 패키지를 사용하십시오.
- `koin-compose` - Compose 기본 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Navigation API 통합을 통한 Compose ViewModel API

## 기존 Koin 컨텍스트에서 시작하기 (Koin이 이미 시작됨)

애플리케이션에서 `startKoin` 함수가 이미 사용 중인 경우가 있습니다 (Android 기본 앱 클래스, Application 클래스와 같이). 이 경우 `KoinContext` 또는 `KoinAndroidContext`를 사용하여 현재 Koin 컨텍스트를 Compose 애플리케이션에 알려야 합니다. 이러한 함수는 현재 Koin 컨텍스트를 재사용하고 Compose 애플리케이션에 바인딩합니다.

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
Composable에서 `ClosedScopeException`이 발생하는 경우 Composable에서 `KoinContext`를 사용하거나 적절한 Koin 시작 구성이 있는지 확인하십시오 ([Android 컨텍스트 사용](/reference/koin-android/start.md)).
:::

## Compose 앱으로 Koin 시작하기 - KoinApplication

`KoinApplication` 함수는 Composable로 Koin 애플리케이션 인스턴스를 만드는 데 도움이 됩니다.

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 화면들 ...
        MyScreen()
    }
}
```

`KoinApplication` 함수는 Compose 컨텍스트의 주기에 따라 Koin 컨텍스트의 시작 및 중지를 처리합니다. 이 함수는 새 Koin 애플리케이션 컨텍스트를 시작하고 중지합니다.

:::info
Android 애플리케이션에서 `KoinApplication`은 구성 변경 또는 Activities 삭제와 관련된 Koin 컨텍스트 중지/재시작에 대한 모든 필요를 처리합니다.
:::

:::note
이것은 기존의 `startKoin` 애플리케이션 함수를 대체합니다.
:::

### Koin을 사용한 Compose Preview

`KoinApplication` 함수는 미리보기를 위해 전용 컨텍스트를 시작하는 데 유용합니다. 이것은 Compose 미리보기에 도움이 되도록 사용할 수도 있습니다.

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // 미리보기 구성
        modules(previewModule)
    }) {
        // Koin을 사용한 Compose 미리보기
    }
}
```

## @Composable에 주입하기

composable 함수를 작성하는 동안 Koin 컨테이너에서 인스턴스를 주입하기 위해 다음 Koin API `koinInject()`에 액세스할 수 있습니다.

'MyService' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
val androidModule = module {
    single { MyService() }
    // or constructor DSL
    singleOf(::MyService)
}
```

다음과 같이 인스턴스를 가져올 수 있습니다.

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

Jetpack Compose의 기능적 측면에 맞춰 최상의 작성 방법은 인스턴스를 함수 매개변수에 직접 주입하는 것입니다. 이렇게 하면 Koin으로 기본 구현을 사용할 수 있지만 인스턴스를 원하는 방식으로 주입할 수 있도록 열어 둘 수 있습니다.

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 매개변수를 사용하여 @Composable에 주입하기

Koin에서 새 의존성을 요청하는 동안 매개변수를 주입해야 할 수 있습니다. 이를 위해 `koinInject` 함수의 `parameters` 매개변수를 `parametersOf()` 함수와 함께 다음과 같이 사용할 수 있습니다.

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
`koinInject<MyService>{ parametersOf("a_string") }`와 같이 람다 주입으로 매개변수를 사용할 수 있지만 재구성을 많이 하는 경우 성능에 영향을 줄 수 있습니다. 람다를 사용하는 이 버전은 매개변수를 잊지 않도록 호출 시 매개변수를 래핑 해제해야 합니다.

Koin 버전 4.0.2부터 가장 효율적인 방식으로 매개변수를 사용할 수 있도록 koinInject(Qualifier,Scope,ParametersHolder)가 도입되었습니다.
:::

## @Composable용 ViewModel

클래식 single/factory 인스턴스에 액세스하는 것과 같은 방식으로 다음 Koin ViewModel API에 액세스할 수 있습니다.

* `koinViewModel()` - ViewModel 인스턴스 주입
* `koinNavViewModel()` - ViewModel 인스턴스 + Navigation 인수 데이터 주입 (Navigation API를 사용하는 경우)

'MyViewModel' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

다음과 같이 인스턴스를 가져올 수 있습니다.

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
Lazy API는 jetpack Compose 업데이트에서 지원되지 않습니다.
:::

### @Composable용 ViewModel 및 SavedStateHandle

`SavedStateHandle` 생성자 매개변수를 가질 수 있으며 Compose 환경(Navigation BackStack 또는 ViewModel)에 따라 주입됩니다.
ViewModel `CreationExtras` 또는 Navigation `BackStackEntry`를 통해 주입됩니다.

```kotlin
// Navhost에서 objectId 인수 설정
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

// ViewModel에서 주입된 인수
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

## Composable에 연결된 모듈 로드 및 언로드

Koin은 주어진 Composable 함수에 대한 특정 모듈을 로드하는 방법을 제공합니다. `rememberKoinModules` 함수는 Koin 모듈을 로드하고 현재 Composable에 대해 기억합니다.

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 이 컴포넌트의 첫 번째 호출 시 모듈 로드
    rememberKoinModules(myModule)
}
```

두 가지 측면에서 모듈을 언로드하기 위해 abandon 함수 중 하나를 사용할 수 있습니다.
- onForgotten - 구성이 삭제된 후
- onAbandoned - 구성에 실패한 경우

이를 위해 `rememberKoinModules`에 대해 `unloadOnForgotten` 또는 `unloadOnAbandoned` 인수를 사용하십시오.

## Composable로 Koin Scope 만들기

composable 함수 `rememberKoinScope` 및 `KoinScope`를 사용하면 Composable에서 Koin Scope를 처리하고 Composable이 종료되면 현재 범위를 따라 닫을 수 있습니다.

:::info
이 API는 아직 불안정합니다.
:::