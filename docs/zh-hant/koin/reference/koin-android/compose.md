---
title: "在 Jetpack Compose 中注入"
---
本頁介紹如何為你的 Jetpack Compose 應用程式注入依賴 - https://developer.android.com/jetpack/compose

## 注入到 @Composable

在編寫 composable 函式時，你可以使用以下 Koin API：

* `get()` - 從 Koin 容器取得實例
* `getKoin()` - 取得目前的 Koin 實例

對於宣告 'MyService' 元件的模組：

```kotlin
val androidModule = module {

    single { MyService() }
}
```

我們可以這樣取得你的實例：

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note 
為了與 Jetpack Compose 的函數式特性保持一致，最佳的編寫方式是將實例直接注入到函數屬性中。 這樣可以使用 Koin 進行預設實作，同時保持開放性，允許你以任何想要的方式注入實例。
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## ViewModel for @Composable

如同你可以使用經典的 single/factory 實例一樣，你也可以使用以下 Koin ViewModel API：

* `getViewModel()` 或 `koinViewModel()` - 取得實例

對於宣告 'MyViewModel' 元件的模組：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

我們可以這樣取得你的實例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我們可以從函數參數中取得你的實例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::warning
Jetpack Compose 1.1+ 的更新不支援 Lazy API
:::