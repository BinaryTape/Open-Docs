[//]: # (title: 共通のViewModel)

Androidの[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)を用いたUI構築アプローチは、Compose Multiplatformを使用して共通コードで実装できます。

## プロジェクトへの共通ViewModelの追加

マルチプラットフォーム`ViewModel`の実装を使用するには、`commonMain`ソースセットに以下の依存関係を追加します。

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:%org.jetbrains.androidx.lifecycle%"}

## 共通コードでのViewModelの使用

Compose Multiplatformは共通の`ViewModelStoreOwner`インターフェースを実装しているため、共通コードで`ViewModel`クラスを使用することは、一般的にAndroidのベストプラクティスと大きくは変わりません。

[ナビゲーションの例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)を使用します。

1. ViewModelクラスを宣言します。

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2. ViewModelをコンポーザブル関数に追加します。

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> `ViewModel`でコルーチンを実行する場合、`ViewModel.viewModelScope`の値が`Dispatchers.Main.immediate`の値に結びつけられており、これはデフォルトではデスクトップで利用できない場合があることに注意してください。
> Compose MultiplatformでViewModelのコルーチンを正しく動作させるには、`kotlinx-coroutines-swing`依存関係をプロジェクトに追加してください。
> 詳細については、[`Dispatchers.Main`のドキュメント](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)を参照してください。
> 
{style="tip"}

JVM以外のプラットフォームでは、型リフレクションを使用してオブジェクトをインスタンス化することはできません。
そのため、共通コードでは引数なしで`viewModel()`関数を呼び出すことはできません。`ViewModel`インスタンスが作成されるたびに、少なくとも初期化子を引数として提供する必要があります。

初期化子のみが提供された場合、ライブラリは内部でデフォルトファクトリを作成します。
しかし、[Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose)と同様に、独自のファクトリを実装し、共通の`viewModel(...)`関数のより明示的なバージョンを呼び出すことができます。