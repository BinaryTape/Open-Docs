---
title: "Jetpack Compose에서 주입하기"
---
이 페이지에서는 Jetpack Compose 앱에 대한 종속성을 주입하는 방법을 설명합니다 - https://developer.android.com/jetpack/compose

## @Composable에 주입하기

composable 함수를 작성하는 동안 다음과 같은 Koin API에 액세스할 수 있습니다.

* `get()` - Koin 컨테이너에서 인스턴스 가져오기
* `getKoin()` - 현재 Koin 인스턴스 가져오기

'MyService' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
val androidModule = module {

    single { MyService() }
}
```

인스턴스를 다음과 같이 가져올 수 있습니다.

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note 
Jetpack Compose의 함수형 측면을 유지하기 위해 가장 좋은 작성 방법은 인스턴스를 함수 속성에 직접 주입하는 것입니다. 이렇게 하면 Koin으로 기본 구현을 사용할 수 있지만 원하는 방식으로 인스턴스를 주입할 수 있습니다.
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## @Composable을 위한 ViewModel

클래식 single/factory 인스턴스에 액세스하는 것과 같은 방식으로 다음 Koin ViewModel API에 액세스할 수 있습니다.

* `getViewModel()` 또는 `koinViewModel()` - 인스턴스 가져오기

'MyViewModel' 컴포넌트를 선언하는 모듈의 경우:

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
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

:::warning
Lazy API는 Jetpack Compose 1.1+ 업데이트에서 지원되지 않습니다.
:::