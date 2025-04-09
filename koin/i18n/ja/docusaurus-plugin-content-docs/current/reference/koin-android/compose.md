---
title: "Jetpack Compose での注入 (Injecting)"
---
このページでは、Jetpack Composeアプリに依存関係を注入する方法について説明します - https://developer.android.com/jetpack/compose

## @Composable への注入

Composable関数を記述する際に、以下のKoin APIにアクセスできます。

* `get()` - Koinコンテナからインスタンスを取得
* `getKoin()` - 現在のKoinインスタンスを取得

'MyService'コンポーネントを宣言するモジュールの場合：

```kotlin
val androidModule = module {

    single { MyService() }
}
```

インスタンスは次のように取得できます。

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note 
Jetpack Composeの関数型の側面に合わせるために、インスタンスを関数プロパティに直接注入するのが最適な記述方法です。これにより、Koinによるデフォルトの実装が可能になりますが、インスタンスを自由に注入できるように開放されます。
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## @Composable 用の ViewModel

従来のsingle/factoryインスタンスと同様に、以下のKoin ViewModel APIにアクセスできます。

* `getViewModel()` または `koinViewModel()` - インスタンスを取得

'MyViewModel'コンポーネントを宣言するモジュールの場合：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

インスタンスは次のように取得できます。

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

関数パラメータでインスタンスを取得できます。

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::warning
Jetpack Compose 1.1以降のアップデートでは、Lazy APIはサポートされていません。
:::