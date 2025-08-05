[//]: # (title: 데스크톱 접근성 기능 지원)

Compose Multiplatform는 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 구축되어, 대부분의 접근성 기능을 모든 플랫폼의 공통 코드에서 사용할 수 있게 합니다. 데스크톱 접근성 지원의 현재 상태는 다음과 같습니다.

| 플랫폼 | 접근성 상태             |
|----------|----------------------------------|
| MacOS    | 완벽하게 지원됨                  |
| Windows  | Java Access Bridge를 통해 지원됨 |
| Linux    | 지원되지 않음                    | 

## Windows에서 접근성 활성화

Windows의 접근성은 Java Access Bridge를 통해 제공되며, 이는 기본적으로 비활성화되어 있습니다.
Windows에서 접근성 기능을 개발하려면 다음 명령어를 사용하여 Java Access Bridge를 활성화하십시오.

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO CMP-373이 수정되면 이 임시 해결책을 제거하세요)

접근성 기능을 포함하는 네이티브 배포판을 생성하려면 `modules` DSL 메서드를 사용하여 `jdk.accessibility` 모듈을 추가하십시오.

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 예제: 시맨틱 규칙을 사용하는 사용자 지정 버튼

사용자 지정 버튼이 포함된 간단한 앱을 만들고 화면 판독기 도구를 위한 설명 텍스트를 지정해 봅시다.
화면 판독기가 활성화되면 버튼 설명에서 "Click to increment value" 텍스트를 들을 수 있습니다.

```kotlin
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.*

fun main() = singleWindowApplication(
    title = "Custom Button", state = WindowState(size = DpSize(300.dp, 200.dp))
) {
    var count by remember { mutableStateOf(0) }

    Box(modifier = Modifier.padding(50.dp)) {
        Box(modifier = Modifier
            .background(Color.LightGray)
            .fillMaxSize()
            .clickable { count += 1 }
            // 콘텐츠의 텍스트를 사용합니다.
            .semantics(mergeDescendants = true) {
                // UI 요소의 유형을 할당합니다.
                role = Role.Button
                // 버튼에 도움말 텍스트를 추가합니다.
                contentDescription = "Click to increment value"
            }
        ) {
            val text = when (count) {
                0 -> "Click Me!"
                1 -> "Clicked"
                else -> "Clicked $count times"
            }
            Text(text, modifier = Modifier.align(Alignment.Center), fontSize = 24.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title=".clickable { count += 1 } .semantics(mergeDescendants = true)"}

macOS에서 애플리케이션 요소의 접근성 정보를 테스트하려면 [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector)를 사용할 수 있습니다.
(**Xcode** | **Open Developer Tool** | **Accessibility Inspector**):

<img src="compose-desktop-accessibility-macos.png" alt="Accessibility inspector on mcOS" width="700"/>

Windows에서는 [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS)의 **Show Speech History** 기능이나 [NVDA](https://www.nvaccess.org/)의 **Speech Viewer**를 사용할 수 있습니다.

<img src="compose-desktop-accessibility.png" alt="Accessibility on Windows" width="600"/>

더 많은 예제를 보려면 [Jetpack Compose의 접근성](https://developer.android.com/develop/ui/compose/accessibility) 가이드를 참조하십시오.

## 다음 단계는 무엇입니까?

[다른 데스크톱 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.