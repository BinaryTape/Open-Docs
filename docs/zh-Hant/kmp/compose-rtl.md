# 使用 RTL 語言

Compose Multiplatform 提供對從右至左 (RTL) 語言的支援，例如阿拉伯語、希伯來語和波斯語。當使用 RTL 語言時，該框架會根據系統的地區設定自動處理大多數 RTL 要求，並調整佈局、對齊方式和文字輸入行為。

## 佈局鏡像

當系統地區設定配置為 RTL 語言時，Compose Multiplatform 會自動鏡像大多數 UI 元件。調整內容包括內邊距、對齊方式和元件位置的變更：

*   **內邊距、外邊距和對齊方式**  
    預設的內邊距和對齊方式會被反轉。例如，在 `Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)` 中，LTR 的 `start` 內邊距對應左側，`end` 內邊距對應右側；而在 RTL 語言中，`start` 對應右側，`end` 對應左側。

*   **元件對齊**  
    對於文字、導覽項目和圖示等 UI 元素，在 RTL 模式下，預設的 `Start` 對齊方式會變為 `End`。

*   **水平可捲動列表**  
    水平列表會反轉其項目對齊方式和捲動方向。

*   **按鈕定位**  
    常見的 UI 模式，例如 **取消** 和 **確認** 按鈕的位置，會調整以符合 RTL 的預期。

## 強制佈局方向

您可能需要保持某些 UI 元素（例如標誌或圖示）的原始方向，而無論佈局方向為何。您可以明確設定整個應用程式或單個元件的佈局方向，覆寫系統預設基於地區的佈局行為。

若要將元素排除在自動鏡像之外並強制執行特定方向，您可以使用 `LayoutDirection.Rtl` 或 `LayoutDirection.Ltr`。要在特定範圍內指定佈局方向，請使用 `CompositionLocalProvider()`，這可確保佈局方向套用於組合中的所有子元件：

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

## 處理 RTL 佈局中的文字輸入

Compose Multiplatform 支援 RTL 佈局中各種文字輸入情境，包括混合方向內容、特殊字元、數字和表情符號。

當您設計支援 RTL 佈局的應用程式時，請考慮以下方面。測試這些方面有助於您識別潛在的本地化問題。

### 游標行為

游標在 RTL 佈局中應直觀地運作，與字元的邏輯方向保持一致。例如：

*   當輸入阿拉伯語時，游標從右向左移動，但插入 LTR 內容時則遵循從左向右的行為。
*   文字選取、刪除和插入等操作均遵守文字的自然方向流。

### 雙向文字

Compose Multiplatform 使用 [Unicode 雙向演算法](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics) 來管理和渲染雙向 (BiDi) 文字，對齊標點符號和數字。

文字應以預期的視覺順序顯示：標點符號和數字正確對齊，阿拉伯文字從右向左流動，而英文文字則從左向右流動。

以下測試範例包含拉丁字母和阿拉伯字母的文字，以及它們的雙向組合：

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

Compose Multiplatform 還能確保複雜雙向情境下的正確對齊和間距，包括多行換行和雙向內容的巢狀結構。

### 數字和表情符號

數字應根據周圍文字的方向一致顯示。東阿拉伯數字在 RTL 文字中自然對齊，而西阿拉伯數字則遵循典型的 LTR 行為。

表情符號應適應 RTL 和 LTR 環境，在文字中保持正確的對齊和間距。

以下測試範例包含表情符號、東阿拉伯數字和西阿拉伯數字，以及雙向文字：

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

## 網頁目標字型

網頁目標缺乏用於渲染某些地區（例如阿拉伯語和中文）字元的內建字型。為了解決這個問題，您需要將自訂備用字型新增到資源中並預載入它們，因為它們不會自動啟用。

若要預載入備用字型，請使用 `FontFamily.Resolver.preload()` 方法。例如：

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

有關網頁目標資源預載入的詳細資訊，請參閱 [preload API](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api) 相關章節。

## RTL 佈局中的輔助功能

Compose Multiplatform 支援 RTL 佈局的輔助功能，包括螢幕閱讀器的正確文字方向和順序以及手勢處理。

### 螢幕閱讀器

螢幕閱讀器會自動適應 RTL 佈局，為使用者保持邏輯閱讀順序：

*   RTL 文字從右向左閱讀，混合方向文字則遵循標準的雙向 (BiDi) 規則。
*   標點符號和數字會按正確的順序宣告。

在複雜的佈局中，需要定義遍歷語意，以確保螢幕閱讀器的正確閱讀順序。

### 基於焦點的導覽

RTL 佈局中的焦點導覽遵循佈局的鏡像結構：

*   焦點從右向左、從上到下移動，遵循 RTL 內容的自然流向。
*   輕掃或輕觸等手勢會自動調整以適應鏡像佈局。

您還可以定義遍歷語意，以確保使用向上或向下輕掃輔助功能手勢時，不同遍歷組之間的正確導覽。

有關如何定義遍歷語意和設定遍歷索引的詳細資訊，請參閱 [輔助功能](compose-accessibility.md#traversal-order) 章節。

## 已知問題

我們正在持續改進對 RTL 語言的支援，並計畫解決以下已知問題：

*   修正在 RTL 佈局中輸入非 RTL 字元時游標位置的問題 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
*   修正阿拉伯數字的游標位置問題 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
*   修正 `TextDirection.Content` 的問題 ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))