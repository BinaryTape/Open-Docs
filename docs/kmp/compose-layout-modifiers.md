# 使用修饰符

修饰符允许您装饰或增强可组合项。使用修饰符，您可以：

*   更改可组合项的大小、布局、行为和外观。
*   添加信息，例如无障碍标签。
*   处理用户输入。
*   添加高级交互，例如使元素可点击、可滚动、可拖动或可缩放。

## 链式修饰符

修饰符可以链式连接在一起以应用多个效果：

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 链式 `Modifier` 函数:
        modifier = Modifier
            // `Modifier.padding(24.dp)` 为 `Column` 添加内边距
            .padding(24.dp)
            // `Modifier.fillMaxWidth()` 使 `Column` 扩展以填充可用宽度
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**修饰符函数在链中的顺序至关重要**。每个函数都会对前一个函数返回的 `Modifier` 进行更改，因此调用序列直接影响可组合项的最终行为和外观。

## 内置修饰符

Compose Multiplatform 提供内置修饰符，例如 `size`、`padding` 和 `offset`，用于处理常见的布局和定位任务。

### 大小修饰符

要设置固定大小，请使用 `size` 修饰符。当需要覆盖约束时，请使用 `requiredSize` 修饰符：

```kotlin
@Composable
fun Card() {
    // 将 `Row` 的大小设置为 400x100 dp
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 将所需大小设置为 150x150 dp 并覆盖父级 100 dp 的限制
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 内容占据 `Row` 内的剩余空间
        }
    }
}
```

### 内边距修饰符

使用 `padding` 修饰符为元素添加内边距。您还可以使用 `paddingFromBaseline` 根据基线动态应用内边距：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 应用内边距以调整相对于基线的位置
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // 由于未指定内边距，因此遵循默认排列
            Text(text = "Subtitle")
        }
    }
}
```

### 偏移修饰符

要调整布局相对于其原始位置的位置，请使用 `offset` 修饰符。指定 X 轴和 Y 轴上的偏移量：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 正常定位文本，不应用任何偏移
            Text(text = "Title")
            
            // 沿 X 轴向右轻微移动文本 4.dp，
            // 同时保持原始垂直位置
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 作用域修饰符

作用域修饰符，也称为父数据修饰符，会通知父布局子级的特定要求。例如，要匹配父级 `Box` 的大小，请使用 `matchParentSize` 修饰符：

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 获取其父级 `Box` 的大小
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最大的子级，决定 `Box` 的大小
        Card()
    }
}
```

作用域修饰符的另一个例子是 `weight`，它在 `RowScope` 或 `ColumnScope` 中可用。它决定可组合项应相对于其同级元素占据多少空间：

```kotlin
@Composable
fun Card() {
    Row(
        // 占据其父级的全部宽度
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 用于加载图像的占位符 */,
            // 分配 1f 的权重以占据可用空间的一部分
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 分配 2f 的权重，占据 `Image` 两倍的宽度
            modifier = Modifier.weight(2f)
        ) {
            // `Column` 内部的内容
        }
    }
}
```

## 提取和重用修饰符

当您将修饰符链式连接在一起时，您可以将该链提取到变量或函数中以进行重用。这可以提高代码可读性，并通过重用修饰符实例来提升性能。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 应用带有内边距和背景色的可重用修饰符
    Text("Reusable modifier", modifier = commonModifier)

    // 为 `Button` 重用相同的修饰符
    Button(
        onClick = { /* Do something */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 自定义修饰符

虽然 Compose Multiplatform 开箱即用提供了许多用于常见用例的内置修饰符，但您也可以创建自己的自定义修饰符。

有几种创建自定义修饰符的方法：

*   [链式连接现有修饰符](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [使用可组合修饰符工厂](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [使用更低级的 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 接下来

在 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/modifiers) 中了解更多关于修饰符的信息。