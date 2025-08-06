# 布局基础

要在 Compose Multiplatform 中高效构建用户界面，了解布局构建的关键概念非常重要，包括核心原则、布局阶段以及可用于构建 UI 的常用组件和工具。

## Composable 函数

你可以通过定义一组 Composable 函数来构建用户界面。这些函数接收数据并渲染 UI 元素。`@Composable` 注解会通知 Compose 编译器该函数将数据转换为 UI。

一个显示文本的简单 Composable 函数：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row 和 Box

为了构建你的布局，你可以使用这些基本构建块：

*   使用 `Column` 在屏幕上垂直放置项。
*   使用 `Row` 在屏幕上水平放置项。
*   使用 `Box` 将元素互相堆叠。
*   使用 `Row` 和 `Column` 的 `FlowRow` 和 `FlowColumn` 版本来构建响应式布局。当容器空间不足时，项会自动流向下一行，从而创建多行或多列：

    ```kotlin
    @Composable
    fun ResponsiveLayout() {
        FlowRow {
            Text(text = "Item 1")
            Text(text = "Item 2")
            Text(text = "Item 3")
        }
    }
    ```

## 修饰符

修饰符允许你以声明式地方式装饰或调整 composable 的行为。它们对于通过控制尺寸、对齐、内边距、交互行为等来定制布局和交互至关重要。

例如，你可以为文本添加内边距和居中对齐：

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

关于更多信息，请参阅 [](compose-layout-modifiers.md)。

## 接下来

*   关于布局的深入探究，请参见 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/layouts)。
*   了解组件的[生命周期](compose-lifecycle.md)。