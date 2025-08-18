[//]: # (title: 可访问性)

Compose Multiplatform 提供了满足可访问性标准所必需的特性，例如语义属性、可访问性 API，以及对包括屏幕阅读器和键盘导航在内的辅助技术的支持。

该框架使得应用程序的设计能够符合 [欧洲可访问性法案](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) (EAA) 和 [Web 内容可访问性指南](https://www.w3.org/TR/WCAG21/) (WCAG) 的要求。

## 语义属性

为了给可访问性、自动填充和测试等服务提供上下文，你可以使用语义属性定义组件的含义和作用。

语义属性是语义树的构建块，语义树是 UI 的简化表示。当你在 composables 中定义语义属性时，它们会自动添加到语义树。辅助技术通过遍历语义树而不是整个 UI 树来与应用交互。

针对可访问性的关键语义属性：

*   `contentDescription` 为 [`IconButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-button.html) 和 [`FloatingActionButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-floating-action-button.html) 等非文本或模糊的 UI 元素提供描述。
    它是主要的可访问性 API，用于提供屏幕阅读器会播报的文本标签。

    ```kotlin
    Modifier.semantics { contentDescription = "Description of the image" }
    ```

*   `role` 告知可访问性服务 UI 组件的功能类型，例如按钮、复选框或图像。这有助于屏幕阅读器解释交互模型并正确播报该元素。

    ```kotlin
    Modifier.semantics { role = Role.Button }
    ```

*   `stateDescription` 描述了交互式 UI 元素的当前状态。

    ```kotlin
    Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
    ```

*   `testTag` 为 composable 元素分配一个唯一标识符，以便在 Android 上使用 Espresso 框架或在 iOS 上使用 XCUITest 进行 UI 测试。你也可以使用 `testTag` 进行调试或在需要组件标识符的特定自动化场景中使用。

    ```kotlin
    Modifier.testTag("my_unique_element_id")
    ```

关于语义属性的完整列表，请参见 [Jetpack Compose API 参考](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties) 中的 [`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties)。

## 遍历顺序

默认情况下，屏幕阅读器会以固定顺序遍历 UI 元素，按照从左到右、从上到下的布局顺序。然而，对于复杂布局，屏幕阅读器可能无法自动确定正确的阅读顺序。这对于包含容器视图（例如表格和嵌套视图）的布局至关重要，这些布局支持其中包含视图的滚动和缩放。

为了确保在复杂视图中滚动和轻扫时具有正确的阅读顺序，请定义遍历语义属性。这也确保了在使用向上或向下轻扫的可访问性手势时，在不同的遍历组之间进行正确的导航。

组件的遍历索引默认值为 `0f`。组件的遍历索引值越低，其内容描述被读取的顺序相对于其他组件而言就越靠前。

例如，如果你希望屏幕阅读器优先处理浮动操作按钮，可以将其遍历索引设置为 `-1f`：

```kotlin
@Composable
fun FloatingBox() {
    Box(
        modifier =
        Modifier.semantics {
            isTraversalGroup = true
            // 设置一个负索引，使其优先于默认索引的元素
            traversalIndex = -1f
        }
    ) {
        FloatingActionButton(onClick = {}) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Icon of floating action button"
            )
        }
    }
}
```

## 后续步骤

了解更多关于 iOS 可访问性特性的信息：

*   [高对比度主题](compose-ios-accessibility.md#high-contrast-theme)
*   [使用 XCTest framework 测试可访问性](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
*   [通过触控板和键盘控制](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
*   [将语义树与 iOS 可访问性树同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option) （适用于 Compose Multiplatform 1.7.3 及更早版本）

了解更多关于桌面平台可访问性特性的信息：

*   [在 Windows 上启用可访问性](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
*   [使用 macOS 和 Windows 工具测试你的应用](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

关于实现细节，请参见 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/accessibility)。