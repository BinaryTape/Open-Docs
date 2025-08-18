# RTL(오른쪽에서 왼쪽) 언어 작업

Compose Multiplatform은 아랍어, 히브리어, 페르시아어와 같은 RTL(오른쪽에서 왼쪽) 언어를 지원합니다.
이 프레임워크는 대부분의 RTL 요구 사항을 자동으로 처리하며, RTL 언어가 사용될 때 시스템의 로케일 설정에 따라 레이아웃, 정렬 및 텍스트 입력 동작을 조정합니다.

## 레이아웃 미러링

시스템 로케일이 RTL 언어로 구성되면 Compose Multiplatform은 대부분의 UI 컴포넌트를 자동으로 미러링합니다.
조정에는 패딩, 정렬 및 컴포넌트 위치 변경이 포함됩니다.

*   **패딩, 마진 및 정렬**  
    기본 패딩과 정렬이 반전됩니다. 예를 들어, `Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)`에서
    LTR(왼쪽에서 오른쪽)은 `start` 패딩이 왼쪽, `end` 패딩이 오른쪽에 해당하지만;
    RTL 언어에서는 `start`가 오른쪽, `end`가 왼쪽에 해당합니다.

*   **컴포넌트 정렬**  
    텍스트, 내비게이션 항목, 아이콘과 같은 UI 요소의 경우, 기본 `Start` 정렬은 RTL 모드에서 `End`가 됩니다.

*   **수평 스크롤 가능 목록**  
    수평 목록은 항목 정렬과 스크롤 방향을 반전시킵니다.

*   **버튼 배치**  
    **취소** 및 **확인** 버튼의 위치와 같은 일반적인 UI 패턴은 RTL 기대치에 맞춰 조정됩니다.

## 레이아웃 방향 강제 설정

로고나 아이콘과 같은 일부 UI 요소의 원래 방향을 레이아웃 방향에 관계없이 유지해야 할 수 있습니다.
전체 앱 또는 개별 컴포넌트에 대해 레이아웃 방향을 명시적으로 설정하여
시스템의 기본 로케일 기반 레이아웃 동작을 재정의할 수 있습니다.

자동 미러링에서 요소를 제외하고 특정 방향을 강제하려면 `LayoutDirection.Rtl` 또는 `LayoutDirection.Ltr`을 사용할 수 있습니다.
범위 내에서 레이아웃 방향을 지정하려면 `CompositionLocalProvider()`를 사용합니다. 이는 레이아웃 방향이
컴포지션 내의 모든 자식 컴포넌트에 적용되도록 합니다.

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 이 블록의 컴포넌트는 왼쪽에서 오른쪽으로 배치됩니다.
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## RTL 레이아웃에서 텍스트 입력 처리

Compose Multiplatform은 혼합 방향 콘텐츠, 특수 문자, 숫자, 이모티콘을 포함하여
RTL 레이아웃에서 다양한 텍스트 입력 시나리오를 지원합니다.

RTL 레이아웃을 지원하는 애플리케이션을 설계할 때 다음 측면을 고려하십시오.
이들을 테스트하면 잠재적인 지역화 문제를 식별하는 데 도움이 될 수 있습니다.

### 커서 동작

커서는 RTL 레이아웃 내에서 문자의 논리적 방향과 일치하여 직관적으로 동작해야 합니다. 예를 들어:

*   아랍어를 입력할 때는 커서가 오른쪽에서 왼쪽으로 이동하지만, LTR 콘텐츠를 삽입할 때는 왼쪽에서 오른쪽으로 동작합니다.
*   텍스트 선택, 삭제, 삽입과 같은 작업은 텍스트의 자연스러운 방향 흐름을 따릅니다.

### 양방향(BiDi) 텍스트

Compose Multiplatform은 [유니코드 양방향 알고리즘](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics)을 사용하여
양방향(BiDi) 텍스트를 관리하고 렌더링하며, 구두점과 숫자를 정렬합니다.

텍스트는 예상되는 시각적 순서로 표시되어야 합니다. 구두점과 숫자는 올바르게 정렬되고,
아랍어 스크립트는 오른쪽에서 왼쪽으로 흐르며, 영어는 왼쪽에서 오른쪽으로 흐릅니다.

다음 테스트 샘플에는 라틴어 및 아랍어 문자와 이들의 양방향 조합이 포함됩니다.

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

// "Hello World"의 아랍어 텍스트
private val helloWorldArabic = "مرحبا بالعالم"

// 양방향 텍스트
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

// BasicTextField()의 코드 중복을 줄이기 위한 래퍼 함수
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

Compose Multiplatform은 또한 다중 줄 줄 바꿈 및 BiDi 콘텐츠 중첩을 포함한 복잡한 BiDi 사례에서
올바른 정렬 및 간격을 보장합니다.

### 숫자 및 이모티콘

숫자는 주변 텍스트의 방향에 따라 일관되게 표시되어야 합니다.
동방 아라비아 숫자는 RTL 텍스트에서 자연스럽게 정렬되고, 서방 아라비아 숫자는 일반적인 LTR 동작을 따릅니다.

이모티콘은 RTL 및 LTR 컨텍스트 모두에 적응하여 텍스트 내에서 적절한 정렬 및 간격을 유지해야 합니다.

다음 테스트 샘플에는 이모티콘, 동방 및 서방 아라비아 숫자, 그리고 양방향 텍스트가 포함됩니다.

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

// 이모티콘이 포함된 "Hello World"의 아랍어 텍스트
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// 숫자와 이모티콘이 포함된 양방향 텍스트
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

// BasicTextField()의 코드 중복을 줄이기 위한 래퍼 함수
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

## 웹 대상용 글꼴

웹 대상은 아랍어 및 중국어와 같은 특정 로케일의 문자를 렌더링하기 위한 내장 글꼴이 부족합니다.
이를 해결하려면 사용자 정의 대체 글꼴을 리소스에 추가하고 미리 로드해야 합니다. 자동으로 활성화되지 않기 때문입니다.

대체 글꼴을 미리 로드하려면 `FontFamily.Resolver.preload()` 메서드를 사용하십시오. 예를 들면 다음과 같습니다.

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

웹 대상용 리소스 사전 로드에 대한 자세한 내용은
[preload API](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api) 섹션을 참조하십시오.

## RTL 레이아웃의 접근성

Compose Multiplatform은 화면 판독기를 위한 적절한 텍스트 방향 및 순서와 제스처 처리를 포함하여
RTL 레이아웃에 대한 접근성 기능을 지원합니다.

### 화면 판독기

화면 판독기는 사용자에게 논리적 읽기 순서를 유지하면서 RTL 레이아웃에 자동으로 적응합니다.

*   RTL 텍스트는 오른쪽에서 왼쪽으로 읽히고, 혼합 방향 텍스트는 표준 BiDi 규칙을 따릅니다.
*   구두점과 숫자는 올바른 순서로 안내됩니다.

복잡한 레이아웃에서는 화면 판독기를 위한 올바른 읽기 순서를 보장하기 위해
순회 시맨틱스를 정의해야 합니다.

### 포커스 기반 탐색

RTL 레이아웃의 포커스 탐색은 레이아웃의 미러링된 구조를 따릅니다.

*   포커스는 RTL 콘텐츠의 자연스러운 흐름에 따라 오른쪽에서 왼쪽, 위에서 아래로 이동합니다.
*   스와이프 또는 탭과 같은 제스처는 미러링된 레이아웃에 자동으로 조정됩니다.

또한 스와이프 업 또는 스와이프 다운 접근성 제스처를 사용하여
서로 다른 순회 그룹 간에 올바른 탐색을 보장하도록 순회 시맨틱스를 정의할 수 있습니다.

순회 시맨틱스를 정의하고 순회 인덱스를 설정하는 방법에 대한 자세한 내용은
[접근성](compose-accessibility.md#traversal-order) 섹션을 참조하십시오.

## 알려진 문제

저희는 RTL 언어 지원을 계속 개선하고 있으며 다음 알려진 문제를 해결할 계획입니다.

*   RTL 레이아웃에서 비RTL 문자 입력 시 캐럿 위치 수정 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
*   아랍어 숫자에 대한 캐럿 위치 수정 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
*   `TextDirection.Content` 수정 ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))