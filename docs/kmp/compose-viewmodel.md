[//]: # (title: 共享 ViewModel)

Android [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 的 UI 构建方法可以使用 Compose Multiplatform 在共享代码中实现。

## 将共享 ViewModel 添加到你的项目

要使用多平台 `ViewModel` 实现，请将以下依赖项添加到你的 `commonMain` 源代码集：

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

## 在共享代码中使用 ViewModel

Compose Multiplatform 实现了共享的 `ViewModelStoreOwner` 接口，因此在共享代码中使用 `ViewModel` 类与 Android 最佳实践并无太大区别。

参考 [导航示例](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)：

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

2. 将 ViewModel 添加到你的可组合函数：

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> 在 `ViewModel` 中运行协程时，请记住 `ViewModel.viewModelScope` 值绑定到 `Dispatchers.Main.immediate` 值，该值在桌面端默认可能不可用。
> 为使 ViewModel 协程在 Compose Multiplatform 中正常工作，请将 `kotlinx-coroutines-swing` 依赖项添加到你的项目。
> 有关详细信息，请参见 [`Dispatchers.Main` 文档](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。
> 
{style="tip"}

在非 JVM 平台，无法使用类型反射实例化对象。
因此在共享代码中，你不能调用不带参数的 `viewModel()` 函数：每次创建 `ViewModel` 实例时，你都需要至少提供一个初始化器作为实参。

如果只提供一个初始化器，库会在底层创建一个默认工厂。
但你可以实现自己的工厂，并调用共享 `viewModel(...)` 函数的更显式版本，就像 [使用 Jetpack Compose](https://developer.com/topic/libraries/architecture/viewmodel#jetpack-compose) 一样。