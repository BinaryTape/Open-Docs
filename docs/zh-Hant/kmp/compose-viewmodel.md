[//]: # (title: 通用 ViewModel)

使用 Compose Multiplatform，可以在通用程式碼中實作 Android 的 [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) UI 構建方式。

## 將通用 ViewModel 新增至您的專案

若要使用多平台 `ViewModel` 實作，請將以下相依性新增至您的 `commonMain` 原始碼集：

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

## 在通用程式碼中使用 ViewModel

Compose Multiplatform 實作了通用的 `ViewModelStoreOwner` 介面，因此一般來說，在通用程式碼中使用 `ViewModel` 類別與 Android 的最佳實務並無太大差異。

使用[導覽範例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)：

1. 宣告 ViewModel 類別：

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2. 將 ViewModel 新增至您的可組合函式：

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> 在 `ViewModel` 中執行協同程式時，請記住 `ViewModel.viewModelScope` 的值與 `Dispatchers.Main.immediate` 值綁定，而後者在預設情況下可能無法在桌面平台（desktop）上使用。
> 為使 ViewModel 協同程式能在 Compose Multiplatform 中正常運作，請將 `kotlinx-coroutines-swing` 相依性新增至您的專案。
> 詳情請參閱 [`Dispatchers.Main` 文件](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。
> 
{style="tip"}

在非 JVM 平台上，無法使用型別反射來具現化物件。
因此在通用程式碼中，您不能呼叫不含參數的 `viewModel()` 函式：每次建立 `ViewModel` 執行個體時，您至少需要提供一個初始設定式作為引數。

如果僅提供初始設定式，該程式庫會在底層建立預設工廠（類）。
但您可以實作自己的工廠（類），並呼叫更明確版本的通用 `viewModel(...)` 函式，就像[使用 Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose) 一樣。