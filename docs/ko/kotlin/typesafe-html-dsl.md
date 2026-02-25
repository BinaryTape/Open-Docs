[//]: # (title: 타입 안전한(Typesafe) HTML DSL)

[kotlinx.html 라이브러리](https://www.github.com/kotlin/kotlinx.html)는 정적 타입(statically typed) HTML 빌더를 사용하여 DOM 요소를 생성하는 기능을 제공합니다 (JavaScript뿐만 아니라 JVM 타겟에서도 사용할 수 있습니다!). 이 라이브러리를 사용하려면 `build.gradle.kts` 파일에 해당 저장소와 의존성을 추가하세요:

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

의존성이 추가되면 DOM 생성을 위해 제공되는 다양한 인터페이스에 접근할 수 있습니다. 예를 들어 헤드라인, 일부 텍스트, 그리고 링크를 렌더링하려면 다음과 같은 코드 스니펫이면 충분합니다:

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

이 예제를 브라우저에서 실행하면 DOM이 직관적인 방식으로 구성됩니다. 이는 브라우저의 개발자 도구를 사용하여 웹사이트의 Elements(요소)를 확인함으로써 쉽게 확인할 수 있습니다:

![Rendering a website from kotlinx.html](rendering-example.png){width=700}

`kotlinx.html` 라이브러리에 대해 더 자세히 알아보려면 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)를 확인하세요. 여기에서 DOM에 추가하지 않고 [요소 생성하기](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees), `onClick`과 같은 [이벤트 바인딩](https://github.com/Kotlin/kotlinx.html/wiki/Events), HTML 요소에 [CSS 클래스 적용하기](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) 등 더 많은 정보를 찾을 수 있습니다.