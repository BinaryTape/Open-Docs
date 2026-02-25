# RTL 언어 작업하기

Compose Multiplatform은 아랍어, 히브리어, 페르시아어와 같은 RTL(Right-to-Left, 오른쪽에서 왼쪽으로 읽는) 언어를 지원합니다.
프레임워크는 대부분의 RTL 요구 사항을 자동으로 처리하며, RTL 언어가 사용될 때 시스템의 로캘(locale) 설정에 따라 레이아웃, 정렬 및 텍스트 입력 동작을 조정합니다.

## 레이아웃 미러링

시스템 로캘이 RTL 언어로 설정된 경우, Compose Multiplatform은 대부분의 UI 컴포넌트를 자동으로 미러링(mirroring)합니다.
조정되는 항목에는 패딩, 정렬 및 컴포넌트 위치의 변경이 포함됩니다:

* **패딩(Padding), 마진(Margin) 및 정렬(Alignment)**  
   기본 패딩과 정렬이 반전됩니다. 예를 들어, `Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)`에서
   LTR 방식의 `start` 패딩은 왼쪽, `end` 패딩은 오른쪽에 해당하지만, 
   RTL 언어에서는 `start`가 오른쪽, `end`가 왼쪽에 해당합니다.

* **컴포넌트 정렬**  
   텍스트, 탐색 항목 및 아이콘과 같은 UI 요소의 경우, 기본 `Start` 정렬이 RTL 모드에서는 `End`가 됩니다.

* **가로 스크롤 가능 리스트**  
   가로 리스트는 아이템 정렬과 스크롤 방향이 반전됩니다.

* **버튼 위치**  
   **취소(Cancel)** 및 **확인(Confirm)** 버튼의 위치와 같은 일반적인 UI 패턴이 RTL 기대치에 맞춰 조정됩니다.

## 레이아웃 방향 강제 지정

레이아웃 방향에 관계없이 로고나 아이콘과 같은 일부 UI 요소의 원래 방향을 유지해야 할 수도 있습니다.
시스템의 기본 로캘 기반 레이아웃 동작을 무시하고 전체 앱 또는 개별 컴포넌트에 대해 레이아웃 방향을 명시적으로 설정할 수 있습니다.

자동 미러링에서 특정 요소를 제외하고 특정 방향을 강제하려면 `LayoutDirection.Rtl` 또는 `LayoutDirection.Ltr`을 사용할 수 있습니다.
특정 범위 내에서 레이아웃 방향을 지정하려면 `CompositionLocalProvider()`를 사용하세요. 이는 해당 컴포지션 내의 모든 자식 컴포넌트에 레이아웃 방향이 적용되도록 보장합니다.

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 이 블록 안의 컴포넌트들은 왼쪽에서 오른쪽(LTR)으로 배치됩니다.
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## RTL 레이아웃에서 텍스트 입력 처리

Compose Multiplatform은 혼합 방향 콘텐츠, 특수 문자, 숫자 및 이모지를 포함하여 RTL 레이아웃의 다양한 텍스트 입력 시나리오에 대한 지원을 제공합니다.

RTL 레이아웃을 지원하는 애플리케이션을 설계할 때는 다음 측면을 고려하세요.
이를 테스트하면 잠재적인 지역화(localization) 문제를 식별하는 데 도움이 됩니다.

### 커서 동작

커서는 RTL 레이아웃 내에서 문자의 논리적 방향에 맞춰 직관적으로 동작해야 합니다. 예를 들어:

* 아랍어를 입력할 때 커서는 오른쪽에서 왼쪽으로 이동하지만, LTR 콘텐츠를 삽입할 때는 왼쪽에서 오른쪽으로 움직이는 동작을 따릅니다.
* 텍스트 선택, 삭제 및 삽입과 같은 작업은 텍스트의 자연스러운 방향 흐름을 존중합니다.

### 양방향(BiDi) 텍스트

Compose Multiplatform은 [유니코드 양방향 알고리즘(Unicode Bidirectional Algorithm)](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics)을 사용하여 문장 부호와 숫자를 정렬하고 양방향(BiDi) 텍스트를 관리 및 렌더링합니다.

텍스트는 기대되는 시각적 순서로 표시되어야 합니다. 문장 부호와 숫자가 올바르게 정렬되고, 아랍어 스크립트는 오른쪽에서 왼쪽으로 흐르며, 영어는 왼쪽에서 오른쪽으로 흐릅니다.

다음 테스트 샘플에는 라틴 문자와 아랍어 문자, 그리고 이들의 양방향 조합이 포함된 텍스트가 포함되어 있습니다.

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

// 양방향(Bidirectional) 텍스트
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

// 코드 중복을 줄이기 위한 BasicTextField() 래퍼 함수
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

Compose Multiplatform은 다중 행 줄바꿈 및 BiDi 콘텐츠의 중첩을 포함하여 복잡한 BiDi 사례에서도 적절한 정렬과 간격을 보장합니다.

### 숫자와 이모지

숫자는 주변 텍스트의 방향에 따라 일관되게 표시되어야 합니다.
동아랍 숫자는 RTL 텍스트에서 자연스럽게 정렬되며, 서아랍 숫자는 일반적인 LTR 동작을 따릅니다.

이모지는 RTL과 LTR 컨텍스트 모두에 적응해야 하며, 텍스트 내에서 적절한 정렬과 간격을 유지해야 합니다.

다음 테스트 샘플에는 이모지, 동아랍 및 서아랍 숫자, 그리고 양방향 텍스트가 포함되어 있습니다.

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

// 이모지가 포함된 "Hello World" 아랍어 텍스트
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// 숫자와 이모지가 포함된 양방향 텍스트
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

// 코드 중복을 줄이기 위한 BasicTextField() 래퍼 함수
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

## 웹 타겟을 위한 폰트

웹 타겟에는 아랍어나 중국어와 같은 특정 로캘의 문자를 렌더링하기 위한 내장 폰트가 부족한 경우가 있습니다.
이를 해결하려면 커스텀 폴백(fallback) 폰트를 리소스에 추가하고 프리로드(preload)해야 합니다. 이러한 폰트는 자동으로 활성화되지 않기 때문입니다.

폴백 폰트를 프리로드하려면 `FontFamily.Resolver.preload()` 메서드를 사용하세요. 예를 들어:

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

웹 타겟의 리소스 프리로드에 대한 자세한 내용은 [preload API](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api) 섹션을 참조하세요.

## RTL 레이아웃의 접근성

Compose Multiplatform은 스크린 리더를 위한 적절한 텍스트 방향 및 순서와 제스처 처리를 포함하여 RTL 레이아웃을 위한 접근성 기능을 지원합니다.

### 스크린 리더

스크린 리더는 자동으로 RTL 레이아웃에 적응하여 사용자를 위한 논리적 읽기 순서를 유지합니다:

* RTL 텍스트는 오른쪽에서 왼쪽으로 읽히며, 혼합 방향 텍스트는 표준 BiDi 규칙을 따릅니다.
* 문장 부호와 숫자는 올바른 순서로 안내됩니다.

복잡한 레이아웃에서는 스크린 리더가 올바른 읽기 순서를 가질 수 있도록 순회 시맨틱(traversal semantics)을 정의해야 합니다.

### 포커스 기반 내비게이션

RTL 레이아웃에서의 포커스 내비게이션은 레이아웃의 미러링된 구조를 따릅니다:

* 포커스는 RTL 콘텐츠의 자연스러운 흐름에 따라 오른쪽에서 왼쪽으로, 위에서 아래로 이동합니다.
* 스와이프나 탭과 같은 제스처는 미러링된 레이아웃에 맞춰 자동으로 조정됩니다.

또한, 위로 스와이프하거나 아래로 스와이프하는 접근성 제스처를 통해 서로 다른 순회 그룹 간에 올바른 내비게이션이 이루어지도록 순회 시맨틱을 정의할 수 있습니다.

순회 시맨틱을 정의하고 순회 인덱스를 설정하는 방법에 대한 자세한 내용은 [접근성(Accessibility)](compose-accessibility.md#traversal-order) 섹션을 참조하세요.

## 알려진 문제

RTL 언어에 대한 지원을 지속적으로 개선하고 있으며, 다음과 같은 알려진 문제를 해결할 계획입니다:

* RTL 레이아웃에서 비 RTL 문자를 입력할 때 캐럿(caret) 위치 수정 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
* 아랍어 숫자에 대한 캐럿 위치 수정 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
* `TextDirection.Content` 수정 ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))