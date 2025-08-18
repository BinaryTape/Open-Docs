[//]: # (title: 公共 ViewModel)

Android [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 的 UI 构建方法可使用 Compose Multiplatform 在公共代码中实现。

## 将公共 ViewModel 添加到你的项目

若要使用多平台 `ViewModel` 实现，请将以下依赖项添加到你的 `commonMain` 源代码集：

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

Compose Multiplatform 实现了公共的 `ViewModelStoreOwner` 接口，因此在公共代码中使用 `ViewModel` 类与 Android 最佳实践并无太大区别。

以 [navigation example](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake) 为例：

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

> 在 `ViewModel` 中运行协程时，请记住 `ViewModel.viewModelScope` 值与 `Dispatchers.Main.immediate` 值绑定，而该值在桌面端默认可能不可用。
> 为了使 `ViewModel` 协程与 Compose Multiplatform 正常工作，请将 `kotlinx-coroutines-swing` 依赖项添加到你的项目。
> 关于详细信息，请参见 [`Dispatchers.Main` 文档](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。
> 
{style="tip"}

在非 JVM 平台上，对象无法使用类型反射进行实例化。
因此在公共代码中，你不能无参调用 `viewModel()` 函数：每次创建 `ViewModel` 实例时，都需要至少提供一个初始化器作为实参。

如果仅提供初始化器，库会在底层创建一个默认工厂。
但你可以实现自己的工厂，并调用公共 `viewModel(...)` 函数的更显式版本，就像使用 [Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose) 一样。