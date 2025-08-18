# 布局基础

要在 Compose Multiplatform 中有效地构建用户界面，了解布局构建的关键概念至关重要，这些概念包括核心原则、布局阶段以及用于组织 UI 的常用组件和工具。

## 可组合函数

你可以通过定义一组可组合函数来构建用户界面。这些函数接收数据并发出 UI 元素。`@Composable` 注解会告知 Compose 编译器，该函数会将数据转换为 UI。

一个简单的可组合函数，用于显示文本：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row 和 Box

要组织你的布局，你可以使用这些基本构建块：

*   使用 `Column` 在屏幕上垂直放置项。
*   使用 `Row` 在屏幕上水平放置项。
*   使用 `Box` 将元素堆叠在一起。
*   使用 `Row` 和 `Column` 的 `FlowRow` 和 `FlowColumn` 版本来构建反应式布局。当容器空间不足时，项会自动流向下一行，从而创建多行或多列：

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

修饰符允许你以声明式方式装饰或调整可组合项的行为。
它们对于定制布局和交互至关重要，可提供对尺寸、对齐方式、填充、交互行为等的控制。

例如，你可以为文本添加填充和居中对齐：

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

关于更多信息，请参见 [](compose-layout-modifiers.md)。

## 下一步

*   有关布局的深入了解，请参阅 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/layouts)。
*   了解组件的[生命周期](compose-lifecycle.md)。