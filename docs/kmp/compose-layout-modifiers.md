# 使用 modifier

modifier 允许你装饰或增强可组合项。使用 modifier，你可以：

*   修改可组合项的尺寸、布局、行为和外观。
*   添加信息，例如无障碍标签。
*   处理用户输入。
*   添加高级交互，例如使元素可点击、可滚动、可拖动或可缩放。

## 链式调用 modifier 

modifier 可以链式调用以应用多种效果：

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 链式调用的 Modifier 函数：
        modifier = Modifier
            // Modifier.padding(24.dp) 在 column 周围添加 padding
            .padding(24.dp)
            // Modifier.fillMaxWidth() 使 column 扩展以填充可用宽度
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**链式调用中 modifier 函数的顺序非常重要**。每个函数都会对前一个函数返回的 `Modifier` 进行更改，因此调用序列会直接影响可组合项的最终行为和外观。

## 内置 modifier

Compose Multiplatform 提供了内置 modifier，例如 `size`、`padding` 和 `offset`，用于处理常见的布局和定位任务。

### 尺寸 modifier

要设置固定尺寸，请使用 `size` modifier。当需要覆盖约束时，请使用 `requiredSize` modifier：

```kotlin
@Composable
fun Card() {
    // 将 row 尺寸设置为 400x100 dp
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 设置所需的尺寸为 150x150 dp，并覆盖父项的 100 dp 限制
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 内容占据 row 中的剩余空间
        }
    }
}
```

### Padding modifier

使用 `padding` modifier 在元素周围添加内边距。你还可以使用 `paddingFromBaseline` 相对于基线动态应用内边距：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 应用 padding 以调整相对于基线的位置
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // 由于未指定 padding，因此遵循默认排列
            Text(text = "Subtitle")
        }
    }
}
```

### Offset modifier

要调整布局相对于其原始位置的位置，请使用 `offset` modifier。在 X 轴和 Y 轴上指定偏移量：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 正常放置文本，不应用偏移量
            Text(text = "Title")
            
            // 通过沿 X 轴偏移 4 dp 将文本略微向右移动，
            // 同时保持原始垂直位置
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 作用域 modifier

作用域 modifier（也称为父数据 modifier）用于通知父布局有关子项的特定要求。
例如，要匹配父 `Box` 的尺寸，请使用 `matchParentSize` modifier：

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 占据其父 Box 的尺寸
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最大的子项，决定了 Box 的尺寸
        Card()
    }
}
```

作用域 modifier 的另一个例子是 `weight`，它在 `RowScope` 或 `ColumnScope` 中可用。它决定了可组合项相对于其同级项应占据的空间量：

```kotlin
@Composable
fun Card() {
    Row(
        // 占据其父项的全部宽度
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 用于加载图像的占位符 */,
            // 分配 1f 的权重以占据可用空间的一个比例部分
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 分配 2f 的权重，占据比 Image 宽两倍的宽度
            modifier = Modifier.weight(2f)
        ) {
            // column 内部的内容
        }
    }
}
```

## 提取和复用 modifier 

当你链式调用 modifier 时，可以将该链提取到变量或函数中以便复用。这可以提高代码可读性，并可能通过复用 modifier 实例来提升性能。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 应用具有 padding 和背景颜色的可复用 modifier
    Text("Reusable modifier", modifier = commonModifier)

    // 为 Button 复用相同的 modifier
    Button(
        onClick = { /* 执行某些操作 */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 自定义 modifier

虽然 Compose Multiplatform 开箱即用地提供了许多用于常见用例的内置 modifier，但你也可以创建自己的自定义 modifier。

创建自定义 modifier 有几种方法：

*   [链式调用现有 modifier](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [使用可组合 modifier 工厂](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [底层的 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 下一步

在 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/modifiers)中详细了解 modifier。