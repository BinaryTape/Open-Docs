# 佈局基礎

為有效地在 Compose Multiplatform 中建構使用者介面，了解佈局建構的關鍵概念至關重要，包括核心原則、佈局階段，以及用於組織 UI 的常用元件和工具。

## 可組合函數

您可以透過定義一組可組合函數來建構使用者介面。這些函數接收資料並發出 UI 元素。`@Composable` 註解會告知 Compose 編譯器該函數將資料轉換為 UI。

一個顯示文字的簡單可組合函數：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row 與 Box

為了組織您的佈局，您可以使用這些基本建構塊：

*   使用 `Column` 在螢幕上垂直放置項目。
*   使用 `Row` 在螢幕上水平放置項目。
*   使用 `Box` 將元素堆疊在一起。
*   使用 `Row` 和 `Column` 的 `FlowRow` 和 `FlowColumn` 版本來建構響應式佈局。當容器空間不足時，項目會自動流向下一行，建立多個列或欄：

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

## 修飾符

修飾符讓您能夠以宣告式方式裝飾或調整可組合項的行為。它們對於自訂佈局和互動至關重要，可控制尺寸、對齊方式、邊距、互動行為等。

例如，您可以為文字新增邊距和置中對齊：

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

了解更多資訊請參閱 [](compose-layout-modifiers.md)。

## 接下來

*   有關佈局的深入探討，請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/layouts)。
*   了解元件的 [生命週期](compose-lifecycle.md)。