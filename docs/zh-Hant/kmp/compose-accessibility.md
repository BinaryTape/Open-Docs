[//]: # (title: 無障礙)

Compose Multiplatform 提供了符合無障礙標準所需的核心功能，例如語義屬性、輔助功能 API，以及對螢幕閱讀器和鍵盤導覽等輔助技術的支援。

此架構讓開發者能設計出符合 [歐洲無障礙法案](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) (EAA) 與 [網頁內容無障礙指標](https://www.w3.org/TR/WCAG21/) (WCAG) 要求的應用程式。

## 語義屬性

為了給輔助功能、自動填寫和測試等服務提供上下文，您可以使用語義屬性來定義組件的意義與角色。

語義屬性是語義樹的建置區塊，語義樹是 UI 的簡化表示。當您在 composable 中定義語義屬性時，它們會自動被加入到語義樹中。輔助技術透過遍歷語義樹（而非整個 UI 樹）來與應用程式進行互動。

無障礙功能的關鍵語義屬性：

* `contentDescription` 為 `IconButton` 和 `FloatingActionButton` 等非文字或含義不明的 UI 元素提供說明。它是主要的輔助功能 API，用於提供螢幕閱讀器播報的文字標籤。

  ```kotlin
  Modifier.semantics { contentDescription = "Description of the image" }
  ```

* `role` 向輔助功能服務告知 UI 組件的功能類型，例如按鈕、核取方塊或圖片。這有助於螢幕閱讀器解讀互動模型並正確地播報該元素。

  ```kotlin
  Modifier.semantics { role = Role.Button }
  ```

* `stateDescription` 描述互動式 UI 元素的當前狀態。

  ```kotlin
  Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
  ```

* `testTag` 為 composable 元素分配唯一識別碼，以便在 Android 上使用 Espresso 架構或在 iOS 上使用 XCUITest 進行 UI 測試。您也可以在偵錯或需要組件識別碼的特定自動化場景中使用 `testTag`。

  ```kotlin
  Modifier.testTag("my_unique_element_id")
  ```

若要查看語義屬性的完整列表，請參閱 Jetpack Compose API 參考文件中的 [`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties)。

## 遍歷順序

預設情況下，螢幕閱讀器會按照固定的順序瀏覽 UI 元素，遵循其佈局由左至右、由上至下進行。然而，對於複雜的佈局，螢幕閱讀器可能無法自動判斷正確的閱讀順序。這對於包含容器視圖（例如支援捲動和縮放其內含視圖的表格和巢狀視圖）的佈局至關重要。

若要確保在捲動和滑動瀏覽複雜視圖時具有正確的閱讀順序，請定義遍歷語義屬性。這也能確保在使用向上或向下滑動的輔助功能手勢時，能在不同的遍歷群組之間正確導覽。

組件遍歷索引的預設值為 `0f`。組件的遍歷索引值越低，其內容說明相對於其他組件會越早被讀取。

例如，如果您希望螢幕閱讀器優先處理懸浮動作按鈕，可以將其遍歷索引設置為 `-1f`：

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

## 下一步

進一步了解 iOS 的無障礙功能：

* [高對比佈景主題](compose-ios-accessibility.md#high-contrast-theme)
* [使用 XCTest 架構測試無障礙功能](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
* [透過追蹤板和鍵盤進行控制](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
* [將語義樹與 iOS 無障礙樹同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option)（適用於 Compose Multiplatform 1.7.3 及更早版本）

進一步了解桌面端的無障礙功能：

* [在 Windows 上啟用無障礙功能](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
* [使用 macOS 和 Windows 工具測試您的應用程式](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

關於實作細節，請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/accessibility)。