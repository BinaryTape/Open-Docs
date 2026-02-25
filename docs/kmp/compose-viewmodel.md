[//]: # (title: 公共 ViewModel)

Android 构建 UI 的 [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 方式可以使用 Compose Multiplatform 在公共代码中实现。

## 将公共 ViewModel 添加到您的项目

要使用多平台 `ViewModel` 实现，请将以下依赖项添加到您的 `commonMain` 源集：

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

## 在公共代码中使用 ViewModel

Compose Multiplatform 实现了公共 `ViewModelStoreOwner` 接口，因此通常在公共代码中使用 `ViewModel` 类与 Android 最佳做法并无太大差异。

以[导航示例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)为例：

1. 声明 ViewModel 类：

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2. 将 ViewModel 添加到您的可组合函数：

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> 在 `ViewModel` 中运行协程时，请记住 `ViewModel.viewModelScope` 的值绑定到 `Dispatchers.Main.immediate` 的值，而该值在桌面端默认可能不可用。
> 为了让 ViewModel 协程在 Compose Multiplatform 中正常工作，请将 `kotlinx-coroutines-swing` 依赖项添加到您的项目中。
> 详情请参阅 [`Dispatchers.Main` 文档](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。
> 
{style="tip"}

在非 JVM 平台上，无法使用类型反射实例化对象。
因此在公共代码中，您不能调用不带形参的 `viewModel()` 函数：每次创建 `ViewModel` 实例时，您至少需要提供一个初始值设定项作为实参。

如果只提供了初始值设定项，库会在底层创建一个默认工厂。
但您可以实现自己的工厂并调用更显式的公共 `viewModel(...)` 函数版本，就像[使用 Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose) 一样。