[//]: # (title: 共通ViewModel)

UIを構築するためのAndroidの[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)アプローチは、Compose Multiplatform を使用して共通コードで実装できます。

## 共通ViewModel をプロジェクトに追加する

マルチプラットフォームの `ViewModel` 実装を使用するには、次の依存関係を `commonMain` ソースセットに追加します。

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

## 共通コードでの ViewModel の使用

Compose Multiplatform は共通の `ViewModelStoreOwner` インターフェースを実装しているため、一般的に共通コードで `ViewModel` クラスを使用することは、Android のベストプラクティスと大きく異なりません。

[ナビゲーションの例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)を使用する場合：

1. ViewModel クラスを宣言する：

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2. ViewModel をコンポーザブル関数に追加する：

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> `ViewModel` でコルーチンを実行する際、`ViewModel.viewModelScope` の値が `Dispatchers.Main.immediate` の値に紐付けられており、これがデスクトップ環境ではデフォルトで利用できない場合があることに注意してください。
> Compose Multiplatform で ViewModel のコルーチンを正しく動作させるには、`kotlinx-coroutines-swing` 依存関係をプロジェクトに追加してください。
> 詳細は [`Dispatchers.Main` ドキュメント](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)を参照してください。
> 
{style="tip"}

非JVMプラットフォームでは、型リフレクションを使用してオブジェクトをインスタンス化することはできません。
したがって、共通コードではパラメータなしで `viewModel()` 関数を呼び出すことはできません。`ViewModel` インスタンスが作成されるたびに、少なくともイニシャライザを引数として提供する必要があります。

イニシャライザのみが提供された場合、ライブラリは内部でデフォルトのファクトリを作成します。
ただし、独自のファクトリを実装し、[Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose) と同様に、共通の `viewModel(...)` 関数のより明示的なバージョンを呼び出すことができます。