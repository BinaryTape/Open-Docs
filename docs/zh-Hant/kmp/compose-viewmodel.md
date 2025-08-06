[//]: # (title: 共通 ViewModel)

Android 的 [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 建構使用者介面方法，可以使用 Compose Multiplatform 在共通程式碼中實作。

## 將共通 ViewModel 新增至您的專案

若要使用多平台 `ViewModel` 實作，請將以下依賴項新增至您的 `commonMain` 原始碼集：

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

## 在共通程式碼中使用 ViewModel

Compose Multiplatform 實作了共通的 `ViewModelStoreOwner` 介面，因此通常在共通程式碼中使用 `ViewModel` 類別與 Android 最佳實踐沒有太大區別。

使用 [導覽範例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)：

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

> 當在 `ViewModel` 中執行協程時，請記住 `ViewModel.viewModelScope` 值是綁定到 `Dispatchers.Main.immediate` 值的，而此值在桌面平台預設情況下可能不可用。
> 為了使 ViewModel 協程與 Compose Multiplatform 正常運作，請將 `kotlinx-coroutines-swing` 依賴項新增至您的專案。
> 詳情請參閱 [`Dispatchers.Main` 文件](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。
> 
{style="tip"}

在非 JVM 平台，物件無法使用類型反射來實例化。
因此在共通程式碼中，您無法呼叫不帶參數的 `viewModel()` 函式：每次建立 `ViewModel` 實例時，您需要至少提供一個初始化器作為引數。

如果只提供初始化器，函式庫會在底層建立一個預設工廠。
但是您可以實作您自己的工廠，並呼叫共通 `viewModel(...)` 函式更明確的版本，就像 [使用 Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose) 一樣。