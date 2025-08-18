[//]: # (title: 無障礙功能)

Compose Multiplatform 提供符合無障礙標準所需的基本功能，例如語義屬性、無障礙 API，以及對輔助技術（包括螢幕閱讀器和鍵盤導航）的支援。

此框架使得設計的應用程式能夠符合 [歐洲無障礙法案](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) (EAA) 和 [網頁內容無障礙指南](https://www.w3.org/TR/WCAG21/) (WCAG) 的要求。

## 語義屬性

為了替無障礙、自動填寫和測試等服務提供上下文，您可以使用語義屬性來定義元件的意義和作用。

語義屬性是語義樹的構成要素，語義樹是 UI 的簡化表示。當您在 composables 中定義語義屬性時，它們會自動新增到語義樹中。輔助技術透過遍歷語義樹而不是整個 UI 樹來與應用程式互動。

重要的無障礙語義屬性：

*   `contentDescription` 提供非文本或模棱兩可的 UI 元素（例如 [`IconButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-button.html) 和 [`FloatingActionButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-floating-action-button.html)）的描述。它是主要的無障礙 API，用於提供螢幕閱讀器會宣告的文本標籤。

    ```kotlin
    Modifier.semantics { contentDescription = "Description of the image" }
    ```

*   `role` 告知無障礙服務關於 UI 元件的功能類型，例如按鈕、核取方塊或圖片。這有助於螢幕閱讀器解釋互動模型並正確宣告元素。

    ```kotlin
    Modifier.semantics { role = Role.Button }
    ```

*   `stateDescription` 描述互動式 UI 元素的當前狀態。

    ```kotlin
    Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
    ```

*   `testTag` 為可組合元素分配一個唯一的識別碼，用於在 Android 上使用 Espresso 框架或在 iOS 上使用 XCUITest 進行 UI 測試。您也可以將 `testTag` 用於偵錯或在需要元件識別碼的特定自動化場景中。

    ```kotlin
    Modifier.testTag("my_unique_element_id")
    ```

如需語義屬性的完整列表，請參閱 Jetpack Compose API 參考資料中的 [`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties)。

## 遍歷順序

預設情況下，螢幕閱讀器按照從左到右、從上到下的佈局順序遍歷 UI 元素。然而，對於複雜的佈局，螢幕閱讀器可能無法自動確定正確的閱讀順序。這對於包含容器視圖（例如表格和巢狀視圖）的佈局至關重要，這些視圖支援包含視圖的捲動和縮放。

為確保在捲動和滑動複雜視圖時有正確的閱讀順序，請定義遍歷語義屬性。這也確保了使用向上滑動或向下滑動的無障礙手勢在不同遍歷組之間進行正確導航。

元件的遍歷索引預設值為 `0f`。元件的遍歷索引值越低，其內容描述相對於其他元件將被越早讀取。

例如，如果您希望螢幕閱讀器優先處理一個浮動動作按鈕，您可以將其遍歷索引設定為 `-1f`：

```kotlin
@Composable
fun FloatingBox() {
    Box(
        modifier =
        Modifier.semantics {
            isTraversalGroup = true
            // Sets a negative index to prioritize over elements with the default index
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

## 後續步驟

進一步了解 iOS 的無障礙功能：

*   [高對比度主題](compose-ios-accessibility.md#high-contrast-theme)
*   [使用 XCTest 框架測試無障礙功能](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
*   [透過觸控板和鍵盤控制](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
*   [將語義樹與 iOS 無障礙樹同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option) （適用於 Compose Multiplatform 1.7.3 及更早版本）

進一步了解桌上型電腦的無障礙功能：

*   [在 Windows 上啟用無障礙功能](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
*   [使用 macOS 和 Windows 工具測試您的應用程式](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

有關實作細節，請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/accessibility)。