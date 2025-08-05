[//]: # (title: Kotlin/Native 作为 Apple 框架 – 教程)

# 处理 RTL 语言

Compose Multiplatform 提供对从右到左（RTL）语言的支持，例如阿拉伯语、希伯来语和波斯语。当使用 RTL 语言时，该框架会自动处理大多数 RTL 需求，并根据系统的区域设置调整布局、对齐方式和文本输入行为。

## 布局镜像

当系统区域设置配置为 RTL 语言时，Compose Multiplatform 会自动镜像大多数 UI 组件。调整包括内边距、对齐方式和组件位置的更改：

*   **内边距、外边距和对齐方式**  
    默认内边距和对齐方式会被反转。例如，在 `Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)` 中，从左到右 (LTR) 的 `start` 内边距对应于左侧，`end` 内边距对应于右侧；而在 RTL 语言中，`start` 对应于右侧，`end` 对应于左侧。

*   **组件对齐**  
    对于诸如文本、导航项和图标等 UI 元素，默认的 `Start` 对齐方式在 RTL 模式下变为 `End`。

*   **水平可滚动列表**  
    水平列表会反转它们的项对齐方式和滚动方向。

*   **按钮定位**  
    常见的 UI 模式，例如**取消**和**确认**按钮的位置，会适应 RTL 预期。

## 强制布局方向

您可能需要保持某些 UI 元素（例如徽标或图标）的原始方向，无论布局方向如何。您可以显式地为整个应用或单个组件设置布局方向，从而覆盖系统默认的基于区域设置的布局行为。

要将元素从自动镜像中排除并强制使用特定方向，可以使用 `LayoutDirection.Rtl` 或 `LayoutDirection.Ltr`。要在某个作用域内指定布局方向，请使用 `CompositionLocalProvider()`，这可确保布局方向应用于组合中的所有子组件：

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // Components in this block will be laid out left-to-right
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## 处理 RTL 布局中的文本输入

Compose Multiplatform 提供对 RTL 布局中各种文本输入场景的支持，包括混合方向内容、特殊字符、数字和表情符号。

在设计支持 RTL 布局的应用程序时，请考虑以下方面。对它们进行测试可以帮助您识别潜在的本地化问题。

### 光标行为

光标在 RTL 布局中应直观地表现，与字符的逻辑方向对齐。例如：

*   输入阿拉伯语时，光标从右向左移动，但插入 LTR 内容时遵循从左向右的行为。
*   诸如文本选择、删除和插入等操作会遵循文本的自然方向流。

### 双向文本

Compose Multiplatform 使用 [Unicode 双向算法](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics) 来管理和渲染双向（BiDi）文本，同时对齐标点符号和数字。

文本应以预期的视觉顺序显示：标点符号和数字正确对齐，阿拉伯语文字从右向左流动，英语从左向右流动。

以下测试示例包括拉丁字母和阿拉伯字母，以及它们的双向组合：

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

// Arabic text for "Hello World"
private val helloWorldArabic = "مرحبا بالعالم"

// Bidirectional text
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

// Wrap function for BasicTextField() to reduce code duplication
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

<img src="compose-rtl-bidi.png" alt="BiDi text" width="600"/>

Compose Multiplatform 还确保在复杂的双向文本情况下有正确的对齐和间距，包括多行换行和双向内容的嵌套。

### 数字和表情符号

数字应根据周围文本的方向一致显示。东阿拉伯数字在 RTL 文本中自然对齐，而西阿拉伯数字遵循典型的 LTR 行为。

表情符号应适应 RTL 和 LTR 环境，在文本中保持正确的对齐和间距。

以下测试示例包括表情符号、东阿拉伯数字和西阿拉伯数字，以及双向文本：

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

// Arabic text for "Hello World" with emojis
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// Bidirectional text with numbers and emojis
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

// Wrap function for BasicTextField() to reduce code duplication
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

<img src="compose-rtl-emoji.png" alt="Numbers and emojis" width="600"/>

## Web 目标平台的字体

Web 目标平台缺少用于渲染某些区域设置（例如阿拉伯语和中文）字符的内置字体。为此，您需要将自定义备用字体添加到资源中并预加载它们，因为它们不会自动启用。

要预加载备用字体，请使用 `FontFamily.Resolver.preload()` 方法。例如：

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

有关预加载 Web 目标平台资源的详细信息，请参考关于 [preload API](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api) 的部分。

## RTL 布局中的辅助功能

Compose Multiplatform 支持 RTL 布局的辅助功能特性，包括屏幕阅读器正确的文本方向和顺序以及手势处理。

### 屏幕阅读器

屏幕阅读器会自动适应 RTL 布局，为用户保持逻辑阅读顺序：

*   RTL 文本从右向左阅读，混合方向文本遵循标准的双向文本规则。
*   标点符号和数字以正确的顺序播报。

在复杂的布局中，需要定义遍历语义，以确保屏幕阅读器的正确阅读顺序。

### 基于焦点的导航

RTL 布局中的焦点导航遵循布局的镜像结构：

*   焦点从右到左、从上到下移动，遵循 RTL 内容的自然流。
*   诸如轻扫或点击等手势会自动调整以适应镜像布局。

您还可以定义遍历语义，以确保通过向上或向下轻扫的辅助功能手势，在不同遍历组之间进行正确导航。

有关如何定义遍历语义和设置遍历索引的详细信息，请参考 [辅助功能](compose-accessibility.md#traversal-order) 部分。

## 已知问题

我们正在不断改进对 RTL 语言的支持，并计划解决以下已知问题：

*   修复在 RTL 布局中输入非 RTL 字符时插入符的位置 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
*   修复阿拉伯数字的插入符位置 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
*   修复 `TextDirection.Content` ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))