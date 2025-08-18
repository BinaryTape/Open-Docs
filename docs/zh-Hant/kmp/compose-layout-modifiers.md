# 使用修飾符

修飾符 (Modifiers) 允許您裝飾或增強可組合項 (composable)。使用修飾符，您可以：

*   改變可組合項的大小、佈局、行為和外觀。
*   添加資訊，例如輔助使用標籤 (accessibility labels)。
*   處理使用者輸入。
*   添加高階互動，例如使元素可點擊、可滾動、可拖曳或可縮放。

## 鏈式修飾符

修飾符可以鏈接在一起以應用多種效果：

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 鏈式 Modifier 函數：
        modifier = Modifier
            // Modifier.padding(24.dp) 在欄位周圍添加邊距
            .padding(24.dp)
            // Modifier.fillMaxWidth() 使欄位擴展以填滿可用寬度
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

修飾符函數在鏈中的順序**非常重要**。每個函數都會對前一個函數返回的 `Modifier` 進行修改，因此呼叫的順序直接影響可組合項的最終行為和外觀。

## 內建修飾符

Compose Multiplatform 提供內建修飾符，例如 `size`、`padding` 和 `offset`，用於處理常見的佈局和定位任務。

### 尺寸修飾符

要設定固定尺寸，請使用 `size` 修飾符。當需要覆寫限制時，請使用 `requiredSize` 修飾符：

```kotlin
@Composable
fun Card() {
    // 將列的尺寸設定為 400x100 dp
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 將所需的尺寸設定為 150x150 dp，並覆寫父級 100 dp 的限制
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 內容佔用列內剩餘的空間
        }
    }
}
```

### 邊距修飾符

使用 `padding` 修飾符在元素周圍添加邊距。您還可以使用 `paddingFromBaseline` 根據基線動態應用邊距：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 應用邊距以調整相對於基線的位置
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // 沒有指定邊距，因此遵循預設排列
            Text(text = "Subtitle")
        }
    }
}
```

### 位移修飾符

若要調整佈局相對於其原始位置的定位，請使用 `offset` 修飾符。請指定 X 和 Y 軸上的位移：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 正常定位文字，不應用任何位移
            Text(text = "Title")
            
            // 將文字沿著 X 軸向右輕微移動 4.dp，
            // 同時保持原始的垂直位置
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 作用域修飾符

作用域修飾符 (Scoped modifiers)，也稱為父資料修飾符 (parent data modifiers)，用於通知父佈局其子項的特定要求。例如，若要匹配父 `Box` 的尺寸，請使用 `matchParentSize` 修飾符：

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 取得其父級 Box 的尺寸
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最大的子項，決定 Box 的尺寸
        Card()
    }
}
```

作用域修飾符的另一個範例是 `weight`，它可在 `RowScope` 或 `ColumnScope` 內使用。它決定了可組合項相對於其同級元素應佔用的空間量：

```kotlin
@Composable
fun Card() {
    Row(
        // 佔用其父級的全部寬度
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 載入圖片的佔位符 */,
            // 分配 1f 的權重，以佔用可用空間的單一分數 
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 分配 2f 的權重，其寬度是 Image 的兩倍
            modifier = Modifier.weight(2f)
        ) {
            // 欄位內的內容
        }
    }
}
```

## 提取與重用修飾符

當您將修飾符鏈接在一起時，您可以將該鏈提取為變數或函數以供重用。這提高了程式碼可讀性，並可透過重用修飾符實例來提升效能。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 應用帶有邊距和背景顏色的可重用修飾符
    Text("Reusable modifier", modifier = commonModifier)

    // 為 Button 重用相同的修飾符
    Button(
        onClick = { /* Do something */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 自訂修飾符

雖然 Compose Multiplatform 開箱即用提供了許多內建修飾符用於常見的使用案例，您也可以建立自己的自訂修飾符。

建立自訂修飾符有幾種方法：

*   [鏈結現有修飾符](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [使用可組合的修飾符工廠](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [使用較低層級的 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 下一步

在 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/modifiers)中了解更多關於修飾符的資訊。