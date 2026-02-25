# 使用 RTL 語言

Compose Multiplatform 支援從右到左 (Right-to-Left, RTL) 的語言，例如阿拉伯語、希伯來語和波斯語。
該架構會在使用 RTL 語言時，根據系統的區域設定 (locale) 自動處理大多數 RTL 需求，並調整配置 (layout)、對齊方式和文字輸入行為。

## 配置鏡像

當系統區域設定為 RTL 語言時，Compose Multiplatform 會自動鏡像大多數 UI 組建 (component)。
調整內容包括邊距 (padding)、邊界 (margin)、對齊方式和組建位置的變更：

* **邊距、邊界與對齊**  
   預設的邊距和對齊方式會反轉。例如，在 `Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)` 中，
   LTR 的 `start` 邊距對應左側，`end` 邊距對應右側；
   而在 RTL 語言中，`start` 對應右側，`end` 對應左側。

* **組建對齊**  
   對於文字、導覽項目和圖示等 UI 元素，預設的 `Start` 對齊在 RTL 模式下會變為 `End`。

* **水平捲動清單**  
   水平清單會反轉其項目對齊方式和捲動方向。

* **按鈕定位**  
   常見的 UI 模式（例如**取消**與**確認**按鈕的位置）會根據 RTL 的預期進行調整。

## 強制配置方向

無論配置方向為何，你可能需要保留某些 UI 元素（例如標誌 logo 或圖示）的原始方向。
你可以明確設定整個應用程式或單個組建的配置方向，從而覆寫系統預設基於區域設定的配置行為。

若要排除某個元素的自動鏡像並強制執行特定方向，可以使用 `LayoutDirection.Rtl` 或 `LayoutDirection.Ltr`。
要在某個作用域內指定配置方向，請使用 `CompositionLocalProvider()`，這可確保該配置方向套用於組合 (composition) 中的所有子組建：

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 此區塊中的組建將由左至右配置
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## 在 RTL 配置中處理文字輸入

Compose Multiplatform 支援 RTL 配置中的各種文字輸入情境，包括混合方向內容、特殊字元、數字和表情符號。

當你設計支援 RTL 配置的應用程式時，請考慮以下方面。測試這些內容可以協助你識別潛在的在地化問題。

### 游標行為

在 RTL 配置中，游標 (cursor) 的行為應符合直覺，並與字元的邏輯方向一致。例如：

* 輸入阿拉伯語時，游標向左移動，但插入 LTR 內容時則遵循從左到右的行為。
* 文字選取、刪除和插入等操作會遵循文字的自然方向流。

### 雙向文字 (BiDi)

Compose Multiplatform 使用 [Unicode 雙向演算法 (Unicode Bidirectional Algorithm)](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics) 來管理和渲染雙向 (BiDi) 文字，使標點符號和數字對齊。

文字應以預期的視覺順序顯示：標點符號和數字正確對齊，阿拉伯語腳本由右向左流動，而英語則由左向右流動。

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

// 「Hello World」的阿拉伯語文字
private val helloWorldArabic = "مرحبا بالعالم"

// 雙向文字
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

// BasicTextField() 的包裝函式，用以減少程式碼重複
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

Compose Multiplatform 還能確保在複雜的 BiDi 情況下（包括多行換行和 BiDi 內容的巢狀結構）具有正確的對齊和間距。

### 數字與表情符號

數字應根據周圍文字的方向一致地顯示。東阿拉伯數字在 RTL 文字中自然對齊，而西阿拉伯數字則遵循典型的 LTR 行為。

表情符號應適應 RTL 和 LTR 上下文，在文字中保持正確的對齊和間距。

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

// 帶有表情符號的「Hello World」阿拉伯語文字
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// 帶有數字和表情符號的雙向文字
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
                        TextField("Numbers: 12345")
                        TextField(bidiText)
                    }
                }
            }
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        TextField(helloWorldArabic)
                        TextField("الأرقام: ١٢٣٤٥")
                        TextField(bidiText)
                    }
                }
            }
        }
    }
}

// BasicTextField() 的包裝函式，用以減少程式碼重複
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

## Web 目標的字體

Web 目標缺少用於渲染某些區域（例如阿拉伯語和中文）字元的內建字體。
為了解決這個問題，你需要將自訂備援字體新增至資源中並預先載入它們，因為它們不會自動啟用。

若要預先載入備援字體，請使用 `FontFamily.Resolver.preload()` 方法。例如：

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

有關預先載入 Web 目標資源的詳細資訊，請參閱 [preload API](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api) 章節。

## RTL 配置中的無障礙功能

Compose Multiplatform 支援 RTL 配置的無障礙功能，包括為螢幕閱讀器提供正確的文字方向和順序，以及處理手勢。

### 螢幕閱讀器

螢幕閱讀器會自動適應 RTL 配置，為使用者保持邏輯閱讀順序：

* RTL 文字由右向左閱讀，混合方向文字則遵循標準 BiDi 規則。
* 標點符號和數字以正確的順序讀出。

在複雜的配置中，有必要定義遍歷語意 (traversal semantics) 以確保螢幕閱讀器具有正確的閱讀順序。

### 基於焦點的導覽

RTL 配置中的焦點導覽遵循配置的鏡像結構：

* 焦點由右向左、由上到下移動，遵循 RTL 內容的自然流。
* 滑動或點擊等手勢會自動調整為鏡像配置。

你還可以定義遍歷語意，以確保在使用向上或向下輕掃無障礙手勢時，不同遍歷群組之間能正確導覽。

有關如何定義遍歷語意和設定遍歷索引的詳細資訊，請參閱 [無障礙功能](compose-accessibility.md#traversal-order) 章節。

## 已知問題

我們持續改進對 RTL 語言的支援，並計劃解決以下已知問題：

* 修正在 RTL 配置中輸入非 RTL 字元時的插入號位置 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
* 修正阿拉伯數字的插入號位置 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
* 修正 `TextDirection.Content` ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))