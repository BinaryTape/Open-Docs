---
title: "Typesafe HTML DSL"
---
[kotlinx.html 라이브러리](https://www.github.com/kotlin/kotlinx.html)는 정적으로 타입이 지정된 HTML 빌더를 사용하여 DOM 요소를 생성하는 기능을 제공합니다(JavaScript 외에도 JVM 대상에서도 사용 가능!). 라이브러리를 사용하려면 해당 저장소와 종속성을 `build.gradle.kts` 파일에 포함해야 합니다.

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

종속성이 포함되면 DOM을 생성하기 위해 제공되는 다양한 인터페이스에 액세스할 수 있습니다.
예를 들어 제목, 일부 텍스트 및 링크를 렌더링하려면 다음 스니펫으로 충분합니다.

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

브라우저에서 이 예제를 실행하면 DOM이 간단한 방식으로 조립됩니다. 이는 브라우저의 개발자 도구를 사용하여 웹 사이트의 요소를 확인하여 쉽게 확인할 수 있습니다.

<img src="/img/rendering-example.png" alt="Rendering a website from kotlinx.html" width="700" style={{verticalAlign: 'middle'}}/>

`kotlinx.html` 라이브러리에 대한 자세한 내용은 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)를 확인하십시오.
여기에서 DOM에 추가하지 않고 [요소를 만드는](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees) 방법, `onClick`과 같은 [이벤트에 바인딩](https://github.com/Kotlin/kotlinx.html/wiki/Events)하는 방법, HTML 요소에 [CSS 클래스를 적용](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)하는 방법에 대한 예제를 비롯한 자세한 정보를 찾을 수 있습니다.