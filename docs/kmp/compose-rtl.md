# 使用 RTL 语言

Compose Multiplatform 支持从右到左 (RTL) 的语言，例如阿拉伯语、希伯来语和波斯语。该框架会自动处理大多数 RTL 需求，并在使用 RTL 语言时根据系统的区域设置调整布局、对齐方式和文本输入行为。

## 布局镜像

当系统区域设置为 RTL 语言时，Compose Multiplatform 会自动镜像大多数 UI 组件。调整包括对内边距 (padding)、对齐方式和组件位置的更改：

*   **内边距、外边距和对齐方式**  
    默认的内边距和对齐方式会被反转。例如，在 `Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)` 中，LTR 的 `start` 内边距对应左侧，`end` 内边距对应右侧；而在 RTL 语言中，`start` 对应右侧，`end` 对应左侧。

*   **组件对齐**  
    对于文本、导航项和图标等 UI 元素，默认的 `Start` 对齐在 RTL 模式下变为 `End`。

*   **水平滚动列表**  
    水平列表会反转其项目对齐方式和滚动方向。

*   **按钮定位**  
    常见的 UI 模式（例如 **Cancel**（取消）和 **Confirm**（确认）按钮的位置）会根据 RTL 的习惯进行调整。

## 强制布局方向

您可能需要保持某些 UI 元素（如 logo 或图标）的原始方向，而不受布局方向的影响。您可以为整个应用或单个组件显式设置布局方向，从而覆盖系统基于区域设置的默认布局行为。

要使某个元素不进行自动镜像并强制执行特定方向，可以使用 `LayoutDirection.Rtl` 或 `LayoutDirection.Ltr`。要在某个作用域内指定布局方向，请使用 `CompositionLocalProvider()`，这可确保布局方向适用于组合中的所有子组件：

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 此块中的组件将从左到右布局
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## 在 RTL 布局中处理文本输入

Compose Multiplatform 支持 RTL 布局中的各种文本输入场景，包括混合方向内容、特殊字符、数字和表情符号。

当您设计支持 RTL 布局的应用时，请考虑以下方面。测试这些方面可以帮助您识别潜在的本地化问题。

### 光标行为

光标在 RTL 布局中的行为应符合直觉，并与字符的逻辑方向对齐。例如：

*   在输入阿拉伯语时，光标从右向左移动，但插入 LTR 内容时则遵循从左到右的行为。
*   文本选择、删除和插入等操作遵循文本的自然方向流。

### 双向文本 (BiDi)

Compose Multiplatform 使用 [Unicode 双向算法](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics)来管理和渲染双向 (BiDi) 文本，使标点符号和数字对齐。

文本应以预期的视觉顺序显示：标点符号和数字正确对齐，阿拉伯语脚本从右向左流动，英语从左到右流动。

以下测试示例包含带有拉丁字母和阿拉伯字母的文本及其双向组合：

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.ui.tooling.preview.Preview

// 阿拉伯语文本 "Hello World"
private val helloWorldArabic = "مرحبا بالعالم"

// 双向文本
private val bidiText = "Hello $helloWorldArabic world"

@Composable
@Preview
fun App() {
    MaterialTheme {
        LazyColumn(
            Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Latin and BiDi in LTR")
                        TextField("Hello world")
                        TextField(bidiText)
                    }
                }
            }
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Arabic and BiDi in RTL")
                        TextField(helloWorldArabic)
                        TextField(bidiText)
                    }
                }
            }
        }
    }
}

// BasicTextField() 的包装函数，用于减少代码重复
@Composable
internal fun TextField(
    text: String = ""
) {
    val state = rememberSaveable { mutableStateOf(text) }

    BasicTextField(
        modifier = Modifier
            .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
            .padding(8.dp),
        value = state.value,
        singleLine = false,
        onValueChange = { state.value = it },
    )
}
```
{default-state="collapsed" collapsible="true" collapsed-title="item { CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {"}

<img src="compose-rtl-bidi.png" alt="BiDi 文本" width="600"/>

Compose Multiplatform 还确保了复杂 BiDi 案例中的正确对齐和间距，包括多行换行和 BiDi 内容的嵌套。

### 数字和表情符号

数字应根据周围文本的方向一致地显示。东阿拉伯数字在 RTL 文本中自然对齐，西阿拉伯数字遵循典型的 LTR 行为。

表情符号应适应 RTL 和 LTR 上下文，在文本中保持正确的对齐和间距。

以下测试示例包含表情符号、东阿拉伯数字和西阿拉伯数字以及双向文本：

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.ui.tooling.preview.Preview

// 带有表情符号的阿拉伯语文本 "Hello World"
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// 带有数字和表情符号的双向文本
private val bidiText = "67890 Hello $helloWorldArabic 🎉"

@Composable
@Preview
fun App() {
    MaterialTheme {
        LazyColumn(
            Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        TextField("Hello world 👋🌎")
                        TextField("Numbers: 🔢12345")
                        TextField(bidiText)
                    }
                }
            }
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        TextField(helloWorldArabic)
                        TextField("الأرقام: 🔢١٢٣٤٥")
                        TextField(bidiText)
                    }
                }
            }
        }
    }
}

// BasicTextField() 的包装函数，用于减少代码重复
@Composable
internal fun TextField(
    text: String = ""
) {
    val state = rememberSaveable { mutableStateOf(text) }

    BasicTextField(
        modifier = Modifier
            .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
            .padding(8.dp),
        value = state.value,
        singleLine = false,
        onValueChange = { state.value = it },
    )
}
```
{default-state="collapsed" collapsible="true" collapsed-title="item { CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {"}

<img src="compose-rtl-emoji.png" alt="数字和表情符号" width="600"/>

## Web 目标的字体

Web 目标缺少用于渲染某些区域设置（如阿拉伯语和中文）字符的内置字体。为了解决这个问题，您需要将自定义回退字体添加到资源并预加载它们，因为它们不会自动启用。

要预加载回退字体，请使用 `FontFamily.Resolver.preload()` 方法。例如：

```kotlin
val fontFamilyResolver = LocalFontFamilyResolver.current
val fontsLoaded = remember { mutableStateOf(false) }

if (fontsLoaded.value) {
   app.Content()
}

LaunchedEffect(Unit) {
   val notoEmojisBytes = loadEmojisFontAsBytes()
   val fontFamily = FontFamily(listOf(Font("NotoColorEmoji", notoEmojisBytes)))
   fontFamilyResolver.preload(fontFamily)
   fontsLoaded.value = true
}
```

有关预加载 Web 目标资源的详细信息，请参阅关于 [preload API](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api) 的章节。

## RTL 布局中的无障碍

Compose Multiplatform 支持 RTL 布局的无障碍功能，包括为屏幕阅读器提供正确的文本方向和顺序，以及处理手势。

### 屏幕阅读器

屏幕阅读器会自动适应 RTL 布局，为用户保持逻辑阅读顺序：

*   RTL 文本从右向左阅读，混合方向文本遵循标准 BiDi 规则。
*   标点符号和数字按正确的顺序播报。

在复杂的布局中，有必要定义遍历语义，以确保屏幕阅读器具有正确的阅读顺序。

### 基于焦点的导航

RTL 布局中的焦点导航遵循布局的镜像结构：

*   焦点从右向左、从上到下移动，遵循 RTL 内容的自然流向。
*   滑动或点击等手势会自动调整到镜像布局。

您还可以定义遍历语义，以确保通过向上滑动或向下滑动无障碍手势在不同的遍历组之间正确导航。

有关如何定义遍历语义和设置遍历索引的详细信息，请参阅[无障碍](compose-accessibility.md#traversal-order)章节。

## 已知问题

我们一直在改进对 RTL 语言的支持，并计划解决以下已知问题：

*   修复在 RTL 布局中输入非 RTL 字符时的文本光标位置 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
*   修复阿拉伯数字的文本光标位置 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
*   修复 `TextDirection.Content` ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))