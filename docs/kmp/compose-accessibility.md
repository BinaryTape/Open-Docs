[//]: # (title: 辅助功能)

Compose Multiplatform 提供了满足辅助功能标准所必需的功能，例如语义属性、辅助功能 API 以及对辅助技术（包括屏幕阅读器和键盘导航）的支持。

该框架支持设计符合 [欧洲辅助功能法案](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) (EAA) 和 [Web 内容无障碍指南](https://www.w3.org/TR/WCAG21/) (WCAG) 要求的应用程序。

## 语义属性

为了给辅助功能、自动填充和测试等服务提供上下文，您可以使用语义属性定义组件的含义和角色。

语义属性是语义树的构建块，语义树是 UI 的简化表示。当您在可组合项中定义语义属性时，它们会自动添加到语义树中。辅助技术通过遍历语义树（而非整个 UI 树）与应用进行交互。

辅助功能的关键语义属性：

* `contentDescription` 为非文本或含义模糊的 UI 元素（如 [`IconButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-button.html) 和 [`FloatingActionButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-floating-action-button.html)）提供描述。它是主要的辅助功能 API，用于提供屏幕阅读器播报的文本标签。

  ```kotlin
  Modifier.semantics { contentDescription = "Description of the image" }
  ```

* `role` 向辅助功能服务通知 UI 组件的功能类型，例如按钮、复选框或图像。这有助于屏幕阅读器解释交互模型并正确播报元素。

  ```kotlin
  Modifier.semantics { role = Role.Button }
  ```

* `stateDescription` 描述交互式 UI 元素的当前状态。

  ```kotlin
  Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
  ```

* `testTag` 为可组合元素分配唯一标识符，以便在 Android 上使用 Espresso 框架或在 iOS 上使用 XCUITest 进行 UI 测试。您还可以将 `testTag` 用于调试，或在需要组件标识符的特定自动化方案中使用。

  ```kotlin
  Modifier.testTag("my_unique_element_id")
  ```

有关语义属性的完整列表，请参阅 Jetpack Compose API 参考文档中的 [`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties)。

## 遍历顺序

默认情况下，屏幕阅读器按照固定的顺序导航 UI 元素，遵循其从左到右、从上到下的布局。然而，对于复杂的布局，屏幕阅读器可能无法自动确定正确的阅读顺序。这对于包含表格和嵌套视图等容器视图（支持对所含视图进行滚动和缩放）的布局至关重要。

为了确保在滚动和轻扫复杂视图时获得正确的阅读顺序，请定义遍历语义属性。这还能确保在使用向上或向下轻扫的辅助功能手势时，能在不同的遍历组之间正确导航。

组件遍历索引的默认值为 `0f`。组件的遍历索引值越低，其内容描述相对于其他组件被读到的时间就越早。

例如，如果您希望屏幕阅读器优先处理浮动操作按钮，可以将其遍历索引设置为 `-1f`：

```kotlin
@Composable
fun FloatingBox() {
    Box(
        modifier =
        Modifier.semantics {
            isTraversalGroup = true
            // 设置负索引以使其优先级高于具有默认索引的元素
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

## 下一步

详细了解 iOS 的辅助功能：

* [高对比度主题](compose-ios-accessibility.md#high-contrast-theme)
* [使用 XCTest 框架测试辅助功能](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
* [通过触控板和键盘控制](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
* [将语义树与 iOS 辅助功能树同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option)（适用于 Compose Multiplatform 1.7.3 及更早版本）

详细了解桌面端的辅助功能：

* [在 Windows 上启用辅助功能](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
* [使用 macOS 和 Windows 工具测试您的应用](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

有关实现细节，请参阅 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/accessibility)。