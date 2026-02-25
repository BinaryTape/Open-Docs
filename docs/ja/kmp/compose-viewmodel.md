[//]: # (title: 共通 ViewModel)

Android の [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) を使用した UI 構築のアプローチは、Compose Multiplatform を使用して共通コードで実装できます。

## プロジェクトに共通 ViewModel を追加する

マルチプラットフォームの `ViewModel` 実装を使用するには、`commonMain` ソースセットに以下の依存関係を追加します：

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

Compose Multiplatform は共通の `ViewModelStoreOwner` インターフェースを実装しているため、共通コードでの `ViewModel` クラスの使用は、一般的に Android のベストプラクティスと大きな違いはありません。

[ナビゲーションの例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)を使用して説明します：

1. ViewModel クラスを宣言します：

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2. Composable 関数に ViewModel を追加します：

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> `ViewModel` 内でコルーチンを実行する場合、`ViewModel.viewModelScope` の値は `Dispatchers.Main.immediate` の値に紐付けられており、デスクトップ環境ではデフォルトで利用できない場合があることに注意してください。
> ViewModel のコルーチンを Compose Multiplatform で正しく動作させるには、プロジェクトに `kotlinx-coroutines-swing` 依存関係を追加してください。
> 詳細は [`Dispatchers.Main` のドキュメント](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)を参照してください。
> 
{style="tip"}

JVM 以外のプラットフォームでは、型のリフレクションを使用してオブジェクトをインスタンス化することはできません。
そのため、共通コードではパラメータなしで `viewModel()` 関数を呼び出すことはできません。`ViewModel` インスタンスを作成するたびに、引数として少なくとも初期化子（initializer）を指定する必要があります。

初期化子のみが提供された場合、ライブラリは内部でデフォルトのファクトリを作成します。
しかし、[Jetpack Compose の場合](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose)と同様に、独自のファクトリを実装して、より明示的なバージョンの共通 `viewModel(...)` 関数を呼び出すことも可能です。