[//]: # (title: 타입 안전 HTML DSL)

[kotlinx.html 라이브러리](https://www.github.com/kotlin/kotlinx.html)는 정적으로 타입이 지정된 HTML 빌더를 사용하여 DOM 요소를 생성하는 기능을 제공합니다(그리고 JavaScript 외에도 JVM 타겟에서도 사용할 수 있습니다!). 이 라이브러리를 사용하려면 해당 레포지토리와 의존성을 `build.gradle.kts` 파일에 포함해야 합니다:

```kotlin
repositories {
    // ...
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-js"))
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.8.0")
    // ...
}
```

의존성이 포함되면, DOM을 생성하는 데 제공되는 다양한 인터페이스에 접근할 수 있습니다. 제목, 일부 텍스트, 그리고 링크를 렌더링하려면 예를 들어 다음 스니펫만으로도 충분합니다:

```kotlin
import kotlinx.browser.*
import kotlinx.html.*
import kotlinx.html.dom.*

fun main() {
    document.body!!.append.div {
        h1 {
            +"Welcome to Kotlin/JS!"
        }
        p {
            +"Fancy joining this year's "
            a("https://kotlinconf.com/") {
                +"KotlinConf"
            }
            +"?"
        }
    }
}
```

이 예제를 브라우저에서 실행하면, DOM이 간단한 방식으로 구성됩니다. 이는 브라우저의 개발자 도구를 사용하여 웹사이트의 'Elements'를 확인하면 쉽게 알 수 있습니다:

![kotlinx.html로 웹사이트 렌더링](rendering-example.png){width=700}

`kotlinx.html` 라이브러리에 대해 더 자세히 알아보려면, [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)를 확인해 보세요. 여기에서 DOM에 추가하지 않고 [요소를 생성하는 방법](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees), `onClick`과 같은 [이벤트에 바인딩하는 방법](https://github.com/Kotlin/kotlinx.html/wiki/Events), 그리고 HTML 요소에 [CSS 클래스를 적용하는 방법](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)에 대한 예시 등 다양한 정보를 찾을 수 있습니다.