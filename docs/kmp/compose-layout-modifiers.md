# 使用修饰符

修饰符允许你修饰或增强一个可组合项。使用修饰符，你可以：

*   改变可组合项的大小、布局、行为和外观。
*   添加信息，例如无障碍标签。
*   处理用户输入。
*   添加高层级交互，例如使元素可点击、可滚动、可拖动或可缩放。

## 链式修饰符

修饰符可以链式组合在一起以应用多种效果：

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 链式 Modifier 函数：
        modifier = Modifier
            // Modifier.padding(24.dp) 为 Column 添加内边距
            .padding(24.dp)
            // Modifier.fillMaxWidth() 使 Column 扩展以填充可用宽度
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**链中修饰符函数的顺序至关重要**。每个函数都会修改上一个函数返回的 `Modifier`，因此调用序列直接影响可组合项的最终行为和外观。

## 内置修饰符

Compose Multiplatform 提供了内置修饰符，例如 `size`、`padding` 和 `offset`，用于处理常见的布局和定位任务。

### 尺寸修饰符

要设置固定尺寸，请使用 `size` 修饰符。当需要覆盖约束时，请使用 `requiredSize` 修饰符：

```kotlin
@Composable
fun Card() {
    // 将 Row 的尺寸设置为 400x100 dp
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 将所需尺寸设置为 150x150 dp 并覆盖父项的 100 dp 限制
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 内容占据 Row 中剩余的空间
        }
    }
}
```

### 内边距修饰符

使用 `padding` 修饰符为元素添加内边距。你还可以使用 `paddingFromBaseline` 根据基线动态应用内边距：

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

要调整布局的原始位置，请使用 `offset` 修饰符。指定 X 轴和 Y 轴上的偏移量：

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 正常定位文本，不应用任何偏移
            Text(text = "Title")
            
            // 将文本沿 X 轴向右稍微移动 4.dp，同时保持原始垂直位置
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 作用域修饰符

作用域修饰符，也称为父级数据修饰符，通知父级布局子项的特定要求。例如，要匹配父级 `Box` 的尺寸，请使用 `matchParentSize` 修饰符：

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 继承其父级 Box 的尺寸
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 最大的子项，决定 Box 的尺寸
        Card()
    }
}
```

作用域修饰符的另一个例子是 `weight`，它可在 `RowScope` 或 `ColumnScope` 中使用。它决定了可组合项应占据多少空间，相对于其同级项：

```kotlin
@Composable
fun Card() {
    Row(
        // 占据其父级的全部宽度
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 用于加载图像的占位符 */,
            // 分配 1f 的 weight 以占据可用空间的一个分数
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 分配 2f 的 weight，占据 Image 两倍的宽度
            modifier = Modifier.weight(2f)
        ) {
            // Column 内部的内容
        }
    }
}
```

## 提取和复用修饰符

当你链式组合修饰符时，可以将该链提取到变量或函数中以供复用。这可以提高代码可读性，并可能通过复用修饰符实例来提升性能。

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 应用具有内边距和背景色的可复用修饰符
    Text("Reusable modifier", modifier = commonModifier)

    // 为 Button 复用相同的修饰符
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

虽然 Compose Multiplatform 开箱即用，为常见用例提供了许多内置修饰符，但你也可以创建自己的自定义修饰符。

有几种方法可以创建自定义修饰符：

*   [链式组合现有修饰符](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [使用可组合修饰符工厂](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [使用低层级 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 下一步

在 [Jetpack Compose 文档](https://developer.android.com/develop/ui/compose/modifiers) 中了解有关修饰符的更多信息。