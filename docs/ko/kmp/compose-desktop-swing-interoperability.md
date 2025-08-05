[//]: # (title: Swing 상호 운용성)

여기서는 Compose Multiplatform 애플리케이션에서 Swing 컴포넌트를 사용하는 방법과 그 역의 경우, 이 상호 운용성(interoperability)의 한계와 장점, 그리고 이 접근 방식을 언제 사용해야 하고 언제 사용하지 말아야 하는지에 대해 배우게 됩니다.

Compose Multiplatform와 Swing 간의 상호 운용성은 다음을 돕는 것을 목표로 합니다:
* Swing 애플리케이션을 Compose Multiplatform로 마이그레이션하는 프로세스를 간소화하고 원활하게 합니다.
* Compose 대응 컴포넌트(analogue)가 없는 경우 Swing 컴포넌트를 사용하여 Compose Multiplatform 애플리케이션을 향상시킵니다.

많은 경우에, Compose Multiplatform 애플리케이션 내에서 Swing 컴포넌트를 사용하는 것보다 누락된 컴포넌트를 Compose Multiplatform에서 직접 구현(그리고 커뮤니티에 기여하는 것)하는 것이 더 효과적입니다.

## Swing 상호 운용(interop) 사용 사례 및 한계

### Swing 앱의 Compose Multiplatform 컴포넌트

첫 번째 사용 사례는 Compose Multiplatform 컴포넌트를 Swing 애플리케이션에 추가하는 것입니다. 애플리케이션의 Compose Multiplatform 부분을 렌더링하기 위해 `ComposePanel` Swing 컴포넌트를 사용하여 이를 달성할 수 있습니다. Swing의 관점에서 `ComposePanel`은 또 다른 Swing 컴포넌트이며, 그에 따라 처리됩니다.

참고로, 팝업(popup), 툴팁(tooltip), 컨텍스트 메뉴(context menu)를 포함한 모든 Compose Multiplatform 컴포넌트는 Swing의 `ComposePanel` 내에서 렌더링되며 그 안에서 위치가 지정되고 크기가 조정됩니다. 따라서 이러한 컴포넌트를 Swing 기반 구현으로 교체하는 것을 고려하거나, 두 가지 새로운 실험적 기능(experimental features)을 시도해 보세요:

[오프스크린 렌더링](#experimental-off-screen-rendering)
: 컴포즈 패널을 Swing 컴포넌트에 직접 렌더링할 수 있도록 합니다.

[팝업, 대화 상자, 드롭다운을 위한 개별 플랫폼 뷰](#experimental-separate-views-for-popups)
: 팝업이 더 이상 초기 컴포저블 캔버스나 앱 창에 의해 제한되지 않습니다.

`ComposePanel`을 사용하는 몇 가지 시나리오는 다음과 같습니다:
* 애니메이션 객체 또는 애니메이션 객체 전체 패널을 애플리케이션에 삽입합니다(예: 이모티콘 선택 또는 이벤트에 애니메이션 반응이 있는 툴바).
* 그래픽 또는 인포그래픽과 같은 대화형 렌더링 영역을 애플리케이션에 구현합니다. 이는 Compose Multiplatform를 사용하여 더 쉽고 편리하게 달성할 수 있습니다.
* (잠재적으로 애니메이션될 수도 있는) 복잡한 렌더링 영역을 애플리케이션에 통합합니다. 이는 Compose Multiplatform로 더 간단합니다.
* Swing 기반 애플리케이션의 사용자 인터페이스에서 복잡한 부분을 교체합니다. Compose Multiplatform는 편리한 컴포넌트 레이아웃 시스템과 광범위한 내장 컴포넌트 및 사용자 정의 컴포넌트를 빠르게 생성하기 위한 옵션을 제공하기 때문입니다.

### Compose Multiplatform 앱의 Swing 컴포넌트

또 다른 사용 사례는 Swing에는 존재하지만 Compose Multiplatform에는 대응 컴포넌트가 없는 컴포넌트를 사용해야 할 때입니다. 새로운 구현을 처음부터 만드는 것이 너무 시간이 많이 걸린다면, `SwingPanel`을 시도해 보세요. `SwingPanel` 함수는 Compose Multiplatform 컴포넌트 위에 배치된 Swing 컴포넌트의 크기, 위치 및 렌더링을 관리하는 래퍼(wrapper) 역할을 합니다.

참고로, `SwingPanel` 내의 Swing 컴포넌트는 항상 Compose Multiplatform 컴포넌트 위에 계층화되므로, `SwingPanel` 아래에 위치한 모든 것은 Swing 컴포넌트에 의해 잘릴 것입니다. 잘림(clipping) 및 겹침(overlapping) 문제를 피하려면 [실험적 상호 운용 블렌딩(interop blending)](#experimental-interop-blending)을 시도해 보세요. 여전히 잘못된 렌더링의 위험이 있다면, 그에 따라 UI를 재설계하거나 `SwingPanel` 사용을 피하고 누락된 컴포넌트를 구현하여 기술 발전에 기여할 수 있습니다.

`SwingPanel`을 사용하는 시나리오는 다음과 같습니다:
* 애플리케이션에 팝업, 툴팁 또는 컨텍스트 메뉴가 필요하지 않거나, 적어도 `SwingPanel` 내부에 있지 않은 경우.
* `SwingPanel`이 고정된 위치에 유지되는 경우. 이 경우, Swing 컴포넌트의 위치가 변경될 때 발생하는 글리치(glitch) 및 아티팩트(artifact)의 위험을 줄일 수 있습니다. 그러나 이 조건은 필수 사항이 아니며 각 특정 사례에 대해 테스트해야 합니다.

Compose Multiplatform와 Swing은 두 가지 방식으로 모두 결합될 수 있어 유연한 UI 디자인이 가능합니다. `SwingPanel`을 `ComposePanel` 안에 배치할 수 있으며, 이 `ComposePanel`은 또 다른 `SwingPanel` 안에 있을 수도 있습니다. 그러나 이러한 중첩된 조합을 사용하기 전에 잠재적인 렌더링 글리치를 고려해야 합니다. 코드 샘플은 [중첩된 `SwingPanel` 및 `ComposePanel`을 사용한 레이아웃](#layout-with-nested-swing-and-compose-multiplatform-components)을 참조하세요.

## Swing 애플리케이션에서 Compose Multiplatform 사용

`ComposePanel`을 사용하면 Swing 기반 애플리케이션 내에서 Compose Multiplatform로 UI를 생성할 수 있습니다. Swing 레이아웃에 `ComposePanel` 인스턴스를 추가하고 `setContent` 내에서 컴포지션(composition)을 정의하세요:

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JButton
import javax.swing.JFrame
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

val northClicks = mutableStateOf(0)
val westClicks = mutableStateOf(0)
val eastClicks = mutableStateOf(0)

fun main() = SwingUtilities.invokeLater {
    val window = JFrame()

    // Creates ComposePanel
    val composePanel = ComposePanel()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
    window.title = "SwingComposeWindow"

    window.contentPane.add(actionButton("NORTH", action = { northClicks.value++ }), BorderLayout.NORTH)
    window.contentPane.add(actionButton("WEST", action = { westClicks.value++ }), BorderLayout.WEST)
    window.contentPane.add(actionButton("EAST", action = { eastClicks.value++ }), BorderLayout.EAST)
    window.contentPane.add(
        actionButton(
            text = "SOUTH/REMOVE COMPOSE",
            action = {
                window.contentPane.remove(composePanel)
            }
        ),
        BorderLayout.SOUTH
    )

    // Adds ComposePanel to JFrame
    window.contentPane.add(composePanel, BorderLayout.CENTER)

    // Sets the content
    composePanel.setContent {
        ComposeContent()
    }

    window.setSize(800, 600)
    window.isVisible = true
}

fun actionButton(text: String, action: () -> Unit): JButton {
    val button = JButton(text)
    button.toolTipText = "Tooltip for $text button."
    button.preferredSize = Dimension(100, 100)
    button.addActionListener { action() }
    return button
}

@Composable
fun ComposeContent() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Row {
            Counter("West", westClicks)
            Spacer(modifier = Modifier.width(25.dp))
            Counter("North", northClicks)
            Spacer(modifier = Modifier.width(25.dp))
            Counter("East", eastClicks)
        }
    }
}

@Composable
fun Counter(text: String, counter: MutableState<Int>) {
    Surface(
        modifier = Modifier.size(130.dp, 130.dp),
        color = Color(180, 180, 180),
        shape = RoundedCornerShape(4.dp)
    ) {
        Column {
            Box(
                modifier = Modifier.height(30.dp).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "${text}Clicks: ${counter.value}")
            }
            Spacer(modifier = Modifier.height(25.dp))
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Button(onClick = { counter.value++ }) {
                    Text(text = text, color = Color.White)
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="composePanel.setContent { ComposeContent() }"}

<img src="compose-desktop-swing-composepanel.animated.gif" alt="IntegrationWithSwing" preview-src="compose-desktop-swing-composepanel.png" width="799"/>

### 실험적 오프스크린 렌더링

실험적 모드는 컴포즈 패널을 Swing 컴포넌트에 직접 렌더링할 수 있도록 합니다. 이는 패널이 표시되거나, 숨겨지거나, 크기가 조정될 때 발생하는 과도기적 렌더링 문제를 방지합니다. 또한 Swing 컴포넌트와 컴포즈 패널을 결합할 때 적절한 계층화를 가능하게 합니다. 즉, Swing 컴포넌트가 `ComposePanel` 위 또는 아래에 표시될 수 있습니다.

> 오프스크린 렌더링은 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다.
> 따라서 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

오프스크린 렌더링을 활성화하려면 `compose.swing.render.on.graphics` 시스템 속성을 사용하세요. 이 속성은 애플리케이션에서 Compose 코드를 실행하기 전에 설정되어야 하므로, 시작 시 `-D` 명령줄 JVM 인수를 사용하여 활성화하는 것이 좋습니다:

```Console
-Dcompose.swing.render.on.graphics=true
```

또는 진입점에서 `System.setProperty()`를 사용하세요:

```kotlin
fun main() {
    System.setProperty("compose.swing.render.on.graphics", "true")
    ...
}
```

### 팝업을 위한 실험적 개별 뷰

툴팁 및 드롭다운 메뉴와 같은 팝업 요소가 초기 컴포저블 캔버스나 앱 창에 의해 제한되지 않는 것이 중요할 수 있습니다. 예를 들어, 컴포저블 뷰가 전체 화면을 차지하지 않지만 경고 대화 상자(alert dialog)를 생성해야 하는 경우입니다.

> 팝업을 위한 개별 뷰 또는 창을 생성하는 것은 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다. 옵트인(Opt-in)이 필요하며(자세한 내용은 아래 참조),
> 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

데스크톱에서 팝업을 위한 개별 뷰 또는 창을 생성하려면, `compose.layers.type` 시스템 속성을 설정하세요. 지원되는 값은 다음과 같습니다:
* `WINDOW`는 `Popup` 및 `Dialog` 컴포넌트를 별도의 장식 없는 창으로 생성합니다.
* `COMPONENT`는 `Popup` 또는 `Dialog`를 동일한 창 내의 별도 Swing 컴포넌트로 생성합니다. 이 설정은 오프스크린 렌더링 활성화가 필요하며([실험적 오프스크린 렌더링](#experimental-off-screen-rendering) 섹션 참조), 오프스크린 렌더링은 `ComposePanel` 컴포넌트에만 작동하고 전체 창 애플리케이션에는 작동하지 않습니다.

참고로, 팝업과 대화 상자는 여전히 자체 경계 외부(예: 최상위 컨테이너의 그림자)에 아무것도 그릴 수 없습니다.

다음은 `COMPONENT` 속성을 사용하는 코드 예시입니다:

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import javax.swing.JFrame
import javax.swing.JLayeredPane
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

@OptIn(ExperimentalComposeUiApi::class)
fun main() = SwingUtilities.invokeLater {
    System.setProperty("compose.swing.render.on.graphics", "true")
    System.setProperty("compose.layers.type", "COMPONENT")

    val window = JFrame()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE

    val contentPane = JLayeredPane()
    contentPane.layout = null

    val composePanel = ComposePanel()
    composePanel.setBounds(200, 200, 200, 200)
    composePanel.setContent {
        ComposeContent()
    }
    
    // Uses the full window for dialogs
    composePanel.windowContainer = contentPane
    contentPane.add(composePanel)

    window.contentPane.add(contentPane)
    window.setSize(800, 600)
    window.isVisible = true
}

@Composable
fun ComposeContent() {
    Box(Modifier.fillMaxSize().background(Color.Green)) {
        Dialog(onDismissRequest = {}) {
            Box(Modifier.size(100.dp).background(Color.Yellow))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@OptIn(ExperimentalComposeUiApi::class) fun main()"}

## Compose Multiplatform 애플리케이션에서 Swing 사용

`SwingPanel`을 사용하면 Compose Multiplatform 애플리케이션 내에서 Swing으로 UI를 생성할 수 있습니다. `SwingPanel`의 `factory` 파라미터를 사용하여 Swing `JPanel`을 생성하세요:

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.SwingPanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication
import java.awt.Component
import javax.swing.BoxLayout
import javax.swing.JButton
import javax.swing.JPanel

fun main() = singleWindowApplication(title = "SwingPanel") {
    val counter = remember { mutableStateOf(0) }

    val inc: () -> Unit = { counter.value++ }
    val dec: () -> Unit = { counter.value-- }

    Box(
        modifier = Modifier.fillMaxWidth().height(60.dp).padding(top = 20.dp),
        contentAlignment = Alignment.Center
    ) {
        Text("Counter: ${counter.value}")
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(top = 80.dp, bottom = 20.dp)
        ) {
            Button("1. Compose Button: increment", inc)
            Spacer(modifier = Modifier.height(20.dp))

            SwingPanel(
                background = Color.LightGray,
                modifier = Modifier.size(270.dp, 90.dp),
                factory = {
                    JPanel().apply {
                        layout = BoxLayout(this, BoxLayout.Y_AXIS)
                        add(actionButton("1. Swing Button: decrement", dec))
                        add(actionButton("2. Swing Button: decrement", dec))
                        add(actionButton("3. Swing Button: decrement", dec))
                    }
                }
            )

            Spacer(modifier = Modifier.height(20.dp))
            Button("2. Compose Button: increment", inc)
        }
    }
}

@Composable
fun Button(text: String = "", action: (() -> Unit)? = null) {
    Button(
        modifier = Modifier.size(270.dp, 30.dp),
        onClick = { action?.invoke() }
    ) {
        Text(text)
    }
}

fun actionButton(
    text: String,
    action: () -> Unit
): JButton {
    val button = JButton(text)
    button.alignmentX = Component.CENTER_ALIGNment
    button.addActionListener { action() }

    return button
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="factory = { JPanel().apply { layout = BoxLayout(this, BoxLayout.Y_AXIS)"}

<img src="compose-desktop-swingpanel.animated.gif" alt="SwingPanel" preview-src="compose-desktop-swingpanel.png" width="600"/>

### Compose 상태 변경 시 Swing 컴포넌트 업데이트

Swing 컴포넌트를 최신 상태로 유지하려면, `update: (T) -> Unit` 콜백(callback)을 제공하세요. 이 콜백은 컴포저블(composable) 상태가 변경되거나 레이아웃이 인플레이트될 때마다 호출됩니다. 다음 코드 샘플은 컴포저블 상태가 변경될 때마다 `SwingPanel` 내에서 Swing 컴포넌트를 업데이트하는 방법을 보여줍니다:

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.awt.SwingPanel
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.application
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.rememberWindowState
import java.awt.BorderLayout
import javax.swing.JPanel
import javax.swing.JLabel

val swingLabel = JLabel()

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = 400.dp, height = 200.dp),
        title = "SwingLabel"
    ) {
        val clicks = remember { mutableStateOf(0) }
        Column(
            modifier = Modifier.fillMaxSize().padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            SwingPanel(
                modifier = Modifier.fillMaxWidth().height(40.dp),
                factory = {
                    JPanel().apply {
                        add(swingLabel, BorderLayout.CENTER)
                    }
                },
                update = {
                    swingLabel.text = "SwingLabel clicks: ${clicks.value}"
                }
            )
            Spacer(modifier = Modifier.height(40.dp))
            Row (
                modifier = Modifier.height(40.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(onClick = { clicks.value++ }) {
                    Text(text = "Increment")
                }
                Spacer(modifier = Modifier.width(20.dp))
                Button(onClick = { clicks.value-- }) {
                    Text(text = "Decrement")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="factory = { JPanel().apply { add(swingLabel, BorderLayout.CENTER)} }, update = {"}

<img src="compose-desktop-swinglabel.animated.gif" alt="SwingLabel" preview-src="compose-desktop-swinglabel.png" width="600"/>

### 실험적 상호 운용 블렌딩

기본적으로 `SwingPanel` 래퍼(wrapper)를 사용하여 구현된 상호 운용 뷰는 직사각형 모양이며, 모든 Compose Multiplatform 컴포넌트 위에 전경으로 표시됩니다. 팝업 요소를 더 쉽게 사용하기 위해, 상호 운용 블렌딩에 대한 실험적 지원을 도입했습니다.

> 상호 운용 블렌딩은 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다.
> 따라서 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

이 실험적 기능을 활성화하려면 `compose.interop.blending` 시스템 속성을 `true`로 설정하세요. 이 속성은 애플리케이션에서 Compose 코드를 실행하기 전에 활성화되어야 하므로, `-Dcompose.interop.blending=true` 명령줄 JVM 인수를 통해 설정하거나 진입점(entry point)에서 `System.setProperty()`를 사용하세요:

```kotlin
fun main() {
    System.setProperty("compose.interop.blending", "true")
    ...
}
```

상호 운용 블렌딩이 활성화되면, 다음 사용 사례에서 Swing을 활용할 수 있습니다:

* **잘림(Clipping)**. 더 이상 직사각형 모양에 제한되지 않습니다. `clip` 및 `shadow` 수정자(modifier)는 `SwingPanel`과 함께 올바르게 작동합니다.
* **겹침(Overlapping)**. `SwingPanel` 위에 Compose Multiplatform 콘텐츠를 그리고 평소처럼 상호 작용하는 것이 가능합니다.

자세한 내용 및 알려진 제한 사항은 [GitHub 설명](https://github.com/JetBrains/compose-multiplatform-core/pull/915)을 참조하세요.

## 중첩된 Swing 및 Compose Multiplatform 컴포넌트가 있는 레이아웃

상호 운용성을 통해 Swing과 Compose Multiplatform를 두 가지 방식으로 모두 결합할 수 있습니다: Compose Multiplatform 애플리케이션에 Swing 컴포넌트를 추가하고, Swing 애플리케이션에 Compose Multiplatform 컴포넌트를 추가하는 방식입니다. 여러 컴포넌트를 중첩하고 접근 방식을 자유롭게 결합하려는 경우에도 이 시나리오가 지원됩니다.

다음 코드 샘플은 `SwingPanel`을 이미 다른 `SwingPanel` 안에 있는 `ComposePanel`에 추가하여 Swing-Compose Multiplatform-Swing 구조를 생성하는 방법을 보여줍니다:

```kotlin
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.awt.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.window.*
import androidx.compose.ui.unit.*
import java.awt.BorderLayout
import java.awt.Dimension
import java.awt.Insets
import javax.swing.*
import javax.swing.border.EmptyBorder

val Gray = java.awt.Color(64, 64, 64)
val DarkGray = java.awt.Color(32, 32, 32)
val LightGray = java.awt.Color(210, 210, 210)

data class Item(
    val text: String,
    val icon: ImageVector,
    val color: Color,
    val state: MutableState<Boolean> = mutableStateOf(false)
)
val panelItemsList = listOf(
    Item(text = "Person", icon = Icons.Filled.Person, color = Color(10, 232, 162)),
    Item(text = "Favorite", icon = Icons.Filled.Favorite, color = Color(150, 232, 150)),
    Item(text = "Search", icon = Icons.Filled.Search, color = Color(232, 10, 162)),
    Item(text = "Settings", icon = Icons.Filled.Settings, color = Color(232, 162, 10)),
    Item(text = "Close", icon = Icons.Filled.Close, color = Color(232, 100, 100))
)
val itemSize = 50.dp

fun java.awt.Color.toCompose(): Color {
    return Color(red, green, blue)
}

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = 500.dp, height = 500.dp),
        title = "Layout"
    ) {
        Column(
            modifier = Modifier.fillMaxSize().background(color = Gray.toCompose()).padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Compose Area", color = LightGray.toCompose())
            Spacer(modifier = Modifier.height(40.dp))
            SwingPanel(
                background = DarkGray.toCompose(),
                modifier = Modifier.fillMaxSize(),
                factory = {
                    ComposePanel().apply {
                        setContent {
                            Box {
                                SwingPanel(
                                    modifier = Modifier.fillMaxSize(),
                                    factory = { SwingComponent() }
                                )
                                Box (
                                    modifier = Modifier.align(Alignment.TopStart)
                                        .padding(start = 20.dp, top = 80.dp)
                                        .background(color = DarkGray.toCompose())
                                ) {
                                    SwingPanel(
                                        modifier = Modifier.size(itemSize * panelItemsList.size, itemSize),
                                        factory = {
                                            ComposePanel().apply {
                                                setContent {
                                                    ComposeOverlay()
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            )
        }
    }
}

fun SwingComponent() : JPanel {
    return JPanel().apply {
        background = DarkGray
        border = EmptyBorder(20, 20, 20, 20)
        layout = BorderLayout()
        add(
            JLabel("TextArea Swing Component").apply {
                foreground = LightGray
                verticalAlignment = SwingConstants.NORTH
                horizontalAlignment = SwingConstants.CENTER
                preferredSize = Dimension(40, 160)
            },
            BorderLayout.NORTH
        )
        add(
            JTextArea().apply {
                background = LightGray
                lineWrap = true
                wrapStyleWord = true
                margin = Insets(10, 10, 10, 10)
                text = "The five boxing wizards jump quickly. " +
                "Crazy Fredrick bought many very exquisite opal jewels. " +
                "Pack my box with five dozen liquor jugs.
" +
                "Cozy sphinx waves quart jug of bad milk. " +
                "The jay, pig, fox, zebra and my wolves quack!"
            },
            BorderLayout.CENTER
        )
    }
}

@Composable
fun ComposeOverlay() {
    Box(
        modifier = Modifier.fillMaxSize().
            background(color = DarkGray.toCompose()),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.background(
                shape = RoundedCornerShape(4.dp),
                color = Color.DarkGray.copy(alpha = 0.5f)
            )
        ) {
            for (item in panelItemsList) {
                SelectableItem(
                    text = item.text,
                    icon = item.icon,
                    color = item.color,
                    selected = item.state
                )
            }
        }
    }
}

@Composable
fun SelectableItem(
    text: String,
    icon: ImageVector,
    color: Color,
    selected: MutableState<Boolean>
) {
    Box(
        modifier = Modifier.size(itemSize)
            .clickable { selected.value = !selected.value },
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.alpha(if (selected.value) 1.0f else 0.5f),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(modifier = Modifier.size(32.dp), imageVector = icon, contentDescription = null, tint = color)
            Text(text = text, color = Color.White, fontSize = 10.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fun SwingComponent() : JPanel { return JPanel().apply {"}

<img src="compose-desktop-swing-layout.animated.gif" alt="Swing layout" preview-src="compose-desktop-swing-layout.png" width="600"/>

## 다음 단계는 무엇인가요?

[다른 데스크톱 전용 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.