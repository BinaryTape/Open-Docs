---
title: Jetpack Composeでのインジェクション
---

このページでは、Jetpack Composeアプリ向けに依存関係を注入する方法について説明します - https://developer.android.com/jetpack/compose

## @Composableへのインジェクション

コンポーザブル関数を記述する際に、以下のKoin APIにアクセスできます。

* `get()` - Koinコンテナからインスタンスを取得します
* `getKoin()` - 現在のKoinインスタンスを取得します

「MyService」コンポーネントを宣言するモジュールの場合：

```kotlin
val androidModule = module {

    single { MyService() }
}
```

そのインスタンスは次のように取得できます：

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note 
Jetpack Composeの関数型側面と整合性を保つため、インスタンスを関数のプロパティに直接注入するのが最善の記述アプローチです。この方法により、Koinでデフォルトの実装を持つことができますが、インスタンスを好きなように注入する余地を残します。
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## @ComposableのためのViewModel

従来のsingle/factoryインスタンスにアクセスするのと同じように、以下のKoin ViewModel APIにアクセスできます。

* `getViewModel()` or `koinViewModel()` - インスタンスを取得します

「MyViewModel」コンポーネントを宣言するモジュールの場合：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

そのインスタンスは次のように取得できます：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

関数パラメータでインスタンスを取得できます：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::warning
Jetpack Compose 1.1以降のアップデートでは、Lazy APIはサポートされていません。
:::