# 使用修飾符

修飾符 (Modifier) 可讓您裝飾或增強可組合項 (composable)。使用修飾符，您可以：

* 變更可組合項的大小、佈局、行為與外觀。
* 新增資訊，例如無障礙標籤。
* 處理使用者輸入。
* 新增高階互動，例如使元素可點擊、可滾動、可拖動或可縮放。

## 鏈結修飾符

修飾符可以鏈結在一起以套用多種效果：

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 鏈結的 Modifier 函式：
        modifier = Modifier
            // Modifier.padding(24.dp) 在 Column 周圍新增間距
            .padding(24.dp)
            // Modifier.fillMaxWidth() 使 Column 擴展以填滿可用寬度
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**鏈結中修飾符函式的順序非常重要**。每個函式都會對上一個函式傳回的 `Modifier` 進行更改，因此呼叫順序會直接影響可組合項最終的行為與外觀。

## 內建修飾符

Compose Multiplatform 提供了內建修飾符，例如 `size`、`padding` 與 `offset`，用於處理常見的佈局與定位任務。

### 大小修飾符

若要設定固定大小，請使用 `size` 修飾符。當需要覆寫約束時，請使用 `requiredSize` 修飾符：

```kotlin
@Composable
fun Card() {
    // 將 Row 的大小設定為 400x100 dp
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 設定要求的尺寸為 150x150 dp，並覆寫父項的 100 dp 限制
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 內容佔用 Row 內的剩餘空間
        }
    }
}
```

### 間距修飾符

使用 `padding` 修飾符在元素周圍新增間距。您也可以使用 `paddingFromBaseline` 根據基線 (baseline) 動態套用間距：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 套用間距以調整相對於基線的位置
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // 由於未指定間距，因此遵循預設排列
            Text(text = "Subtitle")
        }
    }
}
```

### 偏移修飾符

若要從佈局的原始位置調整其位置，請使用 `offset` 修飾符。在 X 軸與 Y 軸上指定偏移量：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 正常定位文字，不套用任何偏移量
            Text(text = "Title")
            
            // 沿著 X 軸移動文字 4 dp 的偏移量使其稍微向右，
            // 同時保持原始垂直位置
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 作用域修飾符

作用域修飾符（Scoped modifiers，也稱為父項資料修飾符）會通知父佈局有關子項的特定需求。例如，若要配合父項 `Box` 的大小，請使用 `matchParentSize` 修飾符：

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 取得其父項 Box 的大小
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最大的子項，決定了 Box 的大小
        Card()
    }
}
```

另一個作用域修飾符的範例是 `weight`，可在 `RowScope` 或 `ColumnScope` 中使用。它決定了可組合項相對於其同級項 (siblings) 應佔用的空間大小：

```kotlin
@Composable
fun Card() {
    Row(
        // 佔用其父項的完整寬度
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 用於載入圖片的預留位置 */,
            // 指派 1f 的權重以佔用可用空間的一個比例
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 指派 2f 的權重，佔用兩倍於 Image 的寬度
            modifier = Modifier.weight(2f)
        ) {
            // Column 內部的內容
        }
    }
}
```

## 提取與重用修飾符

當您將多個修飾符鏈結在一起時，可以將該鏈結提取到變數或函式中以便重用。這能提高程式碼的可讀性，並可能透過重用修飾符執行個體 (instance) 來提升效能。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 套用具備間距與背景顏色的可重用修飾符
    Text("Reusable modifier", modifier = commonModifier)

    // 為 Button 重用相同的修飾符
    Button(
        onClick = { /* 執行某些操作 */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 自訂修飾符

雖然 Compose Multiplatform 開箱即用提供了許多適用於常見使用案例的內建修飾符，但您也可以建立自己的自訂修飾符。

建立自訂修飾符有幾種方法：

* [鏈結現有的修飾符](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
* [使用可組合項修飾符工廠](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
* [更低階的 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 下一步

在 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/modifiers)中進一步了解修飾符。