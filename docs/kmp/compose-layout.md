# 布局基础

为了在 Compose Multiplatform 中有效地构建用户界面，了解布局构建的关键概念非常重要，包括核心原则、布局阶段以及用于构建 UI 的常用组件和工具。

## 可组合函数

您可以通过定义一组可组合函数来构建用户界面。这些函数接收数据并发出 UI 元素。`@Composable` 注解告知 Compose 编译器该函数将数据转换为 UI。

一个显示文本的简单可组合函数：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row 与 Box

要构建布局，您可以使用以下基本构建块：

* 使用 `Column` 在屏幕上垂直放置项目。
* 使用 `Row` 在屏幕上水平放置项目。
* 使用 `Box` 将元素相互堆叠。 
* 使用 `Row` 和 `Column` 的 `FlowRow` 和 `FlowColumn` 版本来构建响应式布局。当容器空间不足时，项目会自动流向下一行，从而创建多行或多列：
 
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

修饰符允许您以声明式方式装饰或调整可组合项的行为。通过提供对尺寸、对齐、内边距、交互行为等内容的控制，它们对于自定义布局和交互至关重要。

例如，您可以为文本添加内边距和居中对齐：

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

详细了解请参阅 [](compose-layout-modifiers.md)。

## 下一步

* 如需深入了解布局，请参阅 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/layouts)。
* 了解组件的[生命周期](compose-lifecycle.md)。