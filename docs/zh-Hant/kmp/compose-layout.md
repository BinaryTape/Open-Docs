# 佈局基礎

若要在 Compose Multiplatform 中有效地構建使用者介面，瞭解佈局建構的核心概念至關重要，包括核心原則、佈局階段，以及用於組織 UI 的常用元件與工具。

## 可組合函式

您可以透過定義一組可組合函式來構建使用者介面。這些函式接收資料並發佈 UI 元件。`@Composable` 註解會告知 Compose 編譯器該函式會將資料轉換為 UI。

一個顯示文字的簡單可組合函式：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column、Row 與 Box

若要組織您的佈局，可以使用以下基本建構區塊：

* 使用 `Column` 在螢幕上垂直放置項目。
* 使用 `Row` 在螢幕上水平放置項目。
* 使用 `Box` 將元素相互堆疊。 
* 使用 `Row` 和 `Column` 的 `FlowRow` 和 `FlowColumn` 版本來構建回應式佈局。 
  當容器空間不足時，項目會自動流動到下一行，從而建立多行或多列：
 
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

修飾符允許您以宣告方式裝飾或調整可組合項目的行為。
透過控制尺寸、對齊、內距、互動行為等，修飾符對於自訂佈局和互動至關重要。

例如，您可以為文字添加內距和置中對齊：

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

在 [](compose-layout-modifiers.md) 中了解更多資訊。

## 下一步

* 若要深入了解佈局，請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/layouts)。
* 瞭解元件的 [生命週期](compose-lifecycle.md)。