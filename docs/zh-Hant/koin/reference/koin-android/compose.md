---
title: 在 Jetpack Compose 中注入
---

此頁面說明了如何在您的 Jetpack Compose 應用程式中注入依賴項 - https://developer.android.com/jetpack/compose

## 注入到 @Composable

編寫您的 composable 函數時，您可以存取以下 Koin API：

* `get()` - 從 Koin 容器中取得實例
* `getKoin()` - 取得當前的 Koin 實例

對於宣告了「MyService」元件的模組：

```kotlin
val androidModule = module {

    single { MyService() }
}
```

我們可以像這樣取得您的實例：

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note
為符合 Jetpack Compose 的函數式 (functional) 特性，最佳的寫法是將實例直接注入到函數的屬性中。這樣可以透過 Koin 提供預設實作，同時保留您希望如何注入實例的彈性。
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## 適用於 @Composable 的 ViewModel

同樣地，您可以存取傳統的單例 (single)/工廠 (factory) 實例，您也可以存取以下 Koin ViewModel API：

* `getViewModel()` 或 `koinViewModel()` - 取得實例

對於宣告了「MyViewModel」元件的模組：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

我們可以像這樣取得您的實例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我們可以在函數參數中取得您的實例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::warning
Lazy API 不支援 Jetpack Compose 1.1+ 的更新版本。
:::