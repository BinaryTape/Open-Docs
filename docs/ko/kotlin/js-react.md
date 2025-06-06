[//]: # (title: React와 Kotlin/JS로 웹 애플리케이션 빌드하기 — 튜토리얼)

<no-index/>

이 튜토리얼에서는 Kotlin/JS와 [React](https://reactjs.org/) 프레임워크를 사용하여 브라우저 애플리케이션을 빌드하는 방법을 알려드립니다. 다음 내용을 학습합니다:

* 일반적인 React 애플리케이션 빌드 관련 작업을 완료합니다.
* [Kotlin의 DSL](type-safe-builders.md)을 사용하여 가독성을 해치지 않으면서도 간결하고 일관되게 개념을 표현하는 방법을 살펴보고, 완전한 기능을 갖춘 애플리케이션을 Kotlin으로 작성할 수 있도록 합니다.
* 기성(ready-made) npm 컴포넌트를 사용하고, 외부 라이브러리를 활용하며, 최종 애플리케이션을 게시하는 방법을 배웁니다.

결과물은 [KotlinConf](https://kotlinconf.com/) 행사를 위한 _KotlinConf Explorer_ 웹 앱이며, 컨퍼런스 강연 링크가 포함됩니다. 사용자는 한 페이지에서 모든 강연을 시청하고 시청했거나 시청하지 않은 것으로 표시할 수 있습니다.

이 튜토리얼은 Kotlin에 대한 사전 지식과 HTML 및 CSS에 대한 기본 지식을 가정합니다. React의 기본 개념을 이해하면 일부 샘플 코드를 이해하는 데 도움이 될 수 있지만, 필수는 아닙니다.

> 최종 애플리케이션은 [여기](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)에서 얻을 수 있습니다.
>
{style="note"}

## 시작하기 전에

1. [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 최신 버전을 다운로드하여 설치합니다.
2. [프로젝트 템플릿](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle)을 복제(clone)하여 IntelliJ IDEA에서 엽니다. 이 템플릿에는 필요한 모든 구성 및 종속성이 포함된 기본 Kotlin 멀티플랫폼 Gradle 프로젝트가 포함되어 있습니다.

   * `build.gradle.kts` 파일의 종속성(Dependencies) 및 작업(tasks):

   ```kotlin
   dependencies {
       // React, React DOM + Wrappers
       implementation(enforcedPlatform("org.jetbrains.kotlin-wrappers:kotlin-wrappers-bom:1.0.0-pre.430"))
       implementation("org.jetbrains.kotlin-wrappers:kotlin-react")
       implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom")
   
       // Kotlin React Emotion (CSS)
       implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
   
       // Video Player
       implementation(npm("react-player", "2.12.0"))
   
       // Share Buttons
       implementation(npm("react-share", "4.4.1"))
   
       // Coroutines & serialization
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
       implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
   }
   ```

   * 이 튜토리얼에서 사용할 JavaScript 코드를 삽입하기 위한 `src/jsMain/resources/index.html`의 HTML 템플릿 페이지:

   ```html
   <!doctype html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Hello, Kotlin/JS!</title>
   </head>
   <body>
       <div id="root"></div>
       <script src="confexplorer.js"></script>
   </body>
   </html>
   ```
   {validate="false"}

   Kotlin/JS 프로젝트는 빌드 시 모든 코드와 종속성을 프로젝트와 동일한 이름의 단일 JavaScript 파일(`confexplorer.js`)로 자동 번들링(bundle)합니다. 일반적인 [JavaScript 컨벤션](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)에 따라, 브라우저가 스크립트 전에 모든 페이지 요소를 로드하도록 보장하기 위해 `body`의 콘텐츠(`root` div 포함)가 먼저 로드됩니다.

* `src/jsMain/kotlin/Main.kt`의 코드 스니펫:

   ```kotlin
   import kotlinx.browser.document
   
   fun main() {
       document.bgColor = "red"
   }
   ```

### 개발 서버 실행하기

기본적으로 Kotlin 멀티플랫폼 Gradle 플러그인은 임베디드 `webpack-dev-server`를 지원하여, 서버를 수동으로 설정할 필요 없이 IDE에서 애플리케이션을 실행할 수 있도록 합니다.

프로그램이 브라우저에서 성공적으로 실행되는지 테스트하려면 IntelliJ IDEA 내 Gradle 도구 창에서 `run` 또는 `browserDevelopmentRun` 작업(`other` 또는 `kotlin browser` 디렉터리에서 사용 가능)을 호출하여 개발 서버를 시작합니다.

![Gradle tasks list](browser-development-run.png){width=700}

터미널에서 프로그램을 실행하려면 대신 `./gradlew run`을 사용하세요.

프로젝트가 컴파일되고 번들링되면, 브라우저 창에 빈 빨간색 페이지가 나타납니다:

![Blank red page](red-page.png){width=700}

### 핫 리로드 / 연속 모드 활성화

_[연속 컴파일](dev-server-continuous-compilation.md)_ 모드를 구성하여 변경 사항을 적용할 때마다 수동으로 프로젝트를 컴파일하고 실행할 필요가 없도록 합니다. 계속 진행하기 전에 실행 중인 모든 개발 서버 인스턴스를 중지해야 합니다.

1. Gradle `run` 작업을 처음 실행한 후 IntelliJ IDEA가 자동으로 생성하는 실행 구성(run configuration)을 편집합니다:

   ![Edit a run configuration](edit-configurations-continuous.png){width=700}

2. **Run/Debug Configurations** 대화 상자에서 실행 구성(run configuration)의 인수에 `--continuous` 옵션을 추가합니다:

   ![Enable continuous mode](continuous-mode.png){width=700}

   변경 사항을 적용한 후, IntelliJ IDEA 내의 **Run** 버튼을 사용하여 개발 서버를 다시 시작할 수 있습니다. 터미널에서 연속 Gradle 빌드를 실행하려면 대신 `./gradlew run --continuous`를 사용하세요.

3. 이 기능을 테스트하려면 Gradle 작업이 실행 중인 동안 `Main.kt` 파일에서 페이지 색상을 파란색으로 변경합니다:

   ```kotlin
   document.bgColor = "blue"
   ```

   그러면 프로젝트가 다시 컴파일되고, 새로고침 후 브라우저 페이지가 새 색상으로 바뀝니다.

개발 과정에서 개발 서버를 연속 모드로 계속 실행할 수 있습니다. 변경 사항을 적용할 때마다 페이지를 자동으로 다시 빌드하고 새로고침합니다.

> 이 프로젝트 상태는 `master` 브랜치 [여기](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)에서 찾을 수 있습니다.
>
{style="note"}

## 웹 앱 초안 만들기

### React로 첫 정적 페이지 추가하기

앱이 간단한 메시지를 표시하도록 하려면 `Main.kt` 파일의 코드를 다음으로 바꿉니다:

```kotlin
import kotlinx.browser.document
import react.*
import emotion.react.css
import csstype.Position
import csstype.px
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.p
import react.dom.html.ReactHTML.img
import react.dom.client.createRoot
import kotlinx.serialization.Serializable

fun main() {
    val container = document.getElementById("root") ?: error("Couldn't find root container!")
    createRoot(container).render(Fragment.create {
        h1 {
            +"Hello, React+Kotlin/JS!"
        }
    })
}
```
{validate="false"}

* `render()` 함수는 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom)에 [프래그먼트(fragment)](https://reactjs.org/docs/fragments.html) 내의 첫 번째 HTML 요소를 `root` 요소로 렌더링하도록 지시합니다. 이 요소는 템플릿에 포함된 `src/jsMain/resources/index.html`에 정의된 컨테이너입니다.
* 내용은 `<h1>` 헤더이며, 타입 세이프(typesafe) DSL을 사용하여 HTML을 렌더링합니다.
* `h1`은 람다(lambda) 파라미터를 받는 함수입니다. 문자열 리터럴 앞에 `+` 기호를 추가하면, 실제로 [연산자 오버로딩(operator overloading)](operator-overloading.md)을 사용하여 `unaryPlus()` 함수가 호출됩니다. 이 함수는 문자열을 포함된 HTML 요소에 추가합니다.

프로젝트가 다시 컴파일되면, 브라우저는 이 HTML 페이지를 표시합니다:

![An HTML page example](hello-react-js.png){width=700}

### HTML을 Kotlin의 타입 세이프 HTML DSL로 변환하기

React용 Kotlin [래퍼(wrappers)](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md)는 순수 Kotlin 코드로 HTML을 작성할 수 있게 해주는 [도메인 특화 언어(DSL)](type-safe-builders.md)를 제공합니다. 이런 점에서 JavaScript의 [JSX](https://reactjs.org/docs/introducing-jsx.html)와 유사합니다. 하지만 이 마크업은 Kotlin이므로, 자동 완성이나 타입 검사와 같은 정적 타입 언어의 모든 이점을 얻을 수 있습니다.

미래 웹 앱의 기존 HTML 코드와 Kotlin의 타입 세이프(typesafe) 변형을 비교해 보세요:

<tabs>
<tab title="HTML">

```html
<h1>KotlinConf Explorer</h1>
<div>
    <h3>Videos to watch</h3>
    <p>John Doe: Building and breaking things</p>
    <p>Jane Smith: The development process</p>
    <p>Matt Miller: The Web 7.0</p>
    <h3>Videos watched</h3>
    <p>Tom Jerry: Mouseless development</p>
</div>
<div>
    <h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder">
</div>
```

</tab>
<tab title="Kotlin">

```kotlin
h1 {
    +"KotlinConf Explorer"
}
div {
    h3 {
        +"Videos to watch"
    }
    p {
        + "John Doe: Building and breaking things"
    }
    p {
        +"Jane Smith: The development process"
    }
    p {
        +"Matt Miller: The Web 7.0"
    }
    h3 {
        +"Videos watched"
    }
    p {
        +"Tom Jerry: Mouseless development"
    }
}
div {
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
       src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
    }
}
```

</tab>
</tabs>

Kotlin 코드를 복사하고 `main()` 함수 내의 `Fragment.create()` 함수 호출을 업데이트하여 이전 `h1` 태그를 바꿉니다.

브라우저가 다시 로드될 때까지 기다립니다. 이제 페이지는 다음과 같이 보여야 합니다:

![The web app draft](website-draft.png){width=700}

### 마크업에 Kotlin 구문을 사용하여 비디오 추가하기

이 DSL을 사용하여 Kotlin으로 HTML을 작성하면 몇 가지 장점이 있습니다. 루프, 조건, 컬렉션, 문자열 보간(string interpolation)과 같은 일반적인 Kotlin 구문을 사용하여 앱을 조작할 수 있습니다.

이제 하드코딩된 비디오 목록을 Kotlin 객체 목록으로 바꿀 수 있습니다:

1. `Main.kt`에서 모든 비디오 속성을 한곳에 보관할 `Video` [데이터 클래스(data class)](data-classes.md)를 생성합니다:

   ```kotlin
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

2. 시청하지 않은 비디오와 시청한 비디오의 두 목록을 각각 채웁니다. 이 선언들을 `Main.kt` 파일 최상단에 추가합니다:

   ```kotlin
   val unwatchedVideos = listOf(
       Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
       Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
       Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
   )
   
   val watchedVideos = listOf(
       Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
   )
   ```

3. 페이지에서 이 비디오들을 사용하려면, 시청하지 않은 `Video` 객체 컬렉션을 반복하는 Kotlin `for` 루프를 작성합니다. "Videos to watch" 아래의 세 개의 `p` 태그를 다음 스니펫으로 바꿉니다:

   ```kotlin
   for (video in unwatchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```
   
4. "Videos watched" 다음의 단일 태그에 대해서도 동일한 과정을 적용하여 코드를 수정합니다:

   ```kotlin
   for (video in watchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```

브라우저가 다시 로드될 때까지 기다립니다. 레이아웃은 이전과 동일하게 유지되어야 합니다. 루프가 제대로 작동하는지 확인하기 위해 목록에 비디오를 더 추가할 수 있습니다.

### 타입 세이프 CSS로 스타일 추가하기

[Emotion](https://emotion.sh/docs/introduction) 라이브러리용 [kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) 래퍼를 사용하면 JavaScript로 HTML과 함께 CSS 속성(동적 속성 포함)을 바로 지정할 수 있습니다. 개념적으로 이는 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js)와 유사하지만 Kotlin용입니다. DSL을 사용하는 이점은 Kotlin 코드 구문을 사용하여 서식 규칙을 표현할 수 있다는 것입니다.

이 튜토리얼의 템플릿 프로젝트에는 `kotlin-emotion`을 사용하는 데 필요한 종속성이 이미 포함되어 있습니다:

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

`kotlin-emotion`을 사용하면 HTML 요소 `div`와 `h3` 내부에 `css` 블록을 지정하여 스타일을 정의할 수 있습니다.

비디오 플레이어를 페이지의 오른쪽 상단 모서리로 이동시키려면 CSS를 사용하고 비디오 플레이어(스니펫의 마지막 `div`)의 코드를 조정합니다:

```kotlin
div {
    css {
        position = Position.absolute
        top = 10.px
        right = 10.px
    }
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
        src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
    }
}
```

다른 스타일도 자유롭게 실험해 보세요. 예를 들어, `fontFamily`를 변경하거나 UI에 `color`를 추가할 수 있습니다.

## 앱 컴포넌트 디자인하기

React의 기본 빌딩 블록은 _[컴포넌트(components)](https://reactjs.org/docs/components-and-props.html)_ 라고 불립니다. 컴포넌트는 다른 더 작은 컴포넌트로 구성될 수도 있습니다. 컴포넌트를 결합하여 애플리케이션을 빌드합니다. 컴포넌트를 일반적이고 재사용 가능하도록 구성하면, 코드나 로직을 중복하지 않고 앱의 여러 부분에서 사용할 수 있습니다.

`render()` 함수의 내용은 일반적으로 기본 컴포넌트를 설명합니다. 현재 애플리케이션의 레이아웃은 다음과 같습니다:

![Current layout](current-layout.png){width=700}

애플리케이션을 개별 컴포넌트로 분해하면, 각 컴포넌트가 자신의 책임을 처리하는 더 구조화된 레이아웃을 얻게 됩니다:

![Structured layout with components](structured-layout.png){width=700}

컴포넌트는 특정 기능을 캡슐화합니다. 컴포넌트를 사용하면 소스 코드가 짧아지고 읽고 이해하기 쉬워집니다.

### 메인 컴포넌트 추가하기

애플리케이션 구조를 만들기 시작하려면, 먼저 `root` 요소로 렌더링할 메인 컴포넌트인 `App`을 명시적으로 지정합니다:

1. `src/jsMain/kotlin` 폴더에 새 `App.kt` 파일을 생성합니다.
2. 이 파일 안에 다음 스니펫을 추가하고 `Main.kt`의 타입 세이프 HTML을 이 안으로 옮깁니다:

   ```kotlin
   import kotlinx.coroutines.async
   import react.*
   import react.dom.*
   import kotlinx.browser.window
   import kotlinx.coroutines.*
   import kotlinx.serialization.decodeFromString
   import kotlinx.serialization.json.Json
   import emotion.react.css
   import csstype.Position
   import csstype.px
   import react.dom.html.ReactHTML.h1
   import react.dom.html.ReactHTML.h3
   import react.dom.html.ReactHTML.div
   import react.dom.html.ReactHTML.p
   import react.dom.html.ReactHTML.img
   
   val App = FC<Props> {
       // typesafe HTML goes here, starting with the first h1 tag!
   }
   ```
   
   `FC` 함수는 [함수 컴포넌트(function component)](https://reactjs.org/docs/components-and-props.html#function-and-class-components)를 생성합니다.

3. `Main.kt` 파일에서 `main()` 함수를 다음과 같이 업데이트합니다:

   ```kotlin
   fun main() {
       val container = document.getElementById("root") ?: error("Couldn't find root container!")
       createRoot(container).render(App.create())
   }
   ```

   이제 프로그램은 `App` 컴포넌트의 인스턴스를 생성하고 지정된 컨테이너에 렌더링합니다.

React 개념에 대한 자세한 내용은 [문서 및 가이드](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)를 참조하세요.

### 목록 컴포넌트 추출하기

`watchedVideos`와 `unwatchedVideos` 목록이 각각 비디오 목록을 포함하고 있으므로, 단일 재사용 가능한 컴포넌트를 만들고 목록에 표시되는 콘텐츠만 조정하는 것이 합리적입니다.

`VideoList` 컴포넌트는 `App` 컴포넌트와 동일한 패턴을 따릅니다. `FC` 빌더 함수를 사용하며, `unwatchedVideos` 목록의 코드를 포함합니다.

1. `src/jsMain/kotlin` 폴더에 새 `VideoList.kt` 파일을 생성하고 다음 코드를 추가합니다:

   ```kotlin
   import kotlinx.browser.window
   import react.*
   import react.dom.*
   import react.dom.html.ReactHTML.p
   
   val VideoList = FC<Props> {
       for (video in unwatchedVideos) {
           p {
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

2. `App.kt`에서 매개변수 없이 `VideoList` 컴포넌트를 호출하여 사용합니다:

   ```kotlin
   // . . .

   div {
       h3 {
           +"Videos to watch"
       }
       VideoList()
   
       h3 {
           +"Videos watched"
       }
       VideoList()
   }

   // . . .
   ```

   현재 `App` 컴포넌트는 `VideoList` 컴포넌트가 표시하는 콘텐츠를 제어할 수 없습니다. 이는 하드코딩되어 있으므로 동일한 목록이 두 번 표시됩니다.

### 컴포넌트 간 데이터 전달을 위한 props 추가하기

`VideoList` 컴포넌트를 재사용할 것이므로, 다른 콘텐츠로 채울 수 있어야 합니다. 항목 목록을 컴포넌트에 속성으로 전달하는 기능을 추가할 수 있습니다. React에서 이러한 속성을 _props_라고 합니다. React에서 컴포넌트의 props가 변경되면, 프레임워크는 해당 컴포넌트를 자동으로 다시 렌더링합니다.

`VideoList`의 경우, 표시될 비디오 목록을 포함하는 prop이 필요합니다. `VideoList` 컴포넌트에 전달될 수 있는 모든 props를 담는 인터페이스를 정의합니다:

1. `VideoList.kt` 파일에 다음 정의를 추가합니다:

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
   }
   ```
   [external](js-interop.md#external-modifier) 한정자(modifier)는 인터페이스의 구현이 외부에서 제공되므로, 컴파일러가 해당 선언에서 JavaScript 코드를 생성하려고 시도하지 않도록 지시합니다.

2. `VideoList`의 클래스 정의를 조정하여 `FC` 블록에 매개변수로 전달되는 props를 사용하도록 합니다:

   ```kotlin
   val VideoList = FC<VideoListProps> { props ->
       for (video in props.videos) {
           p {
               key = video.id.toString()
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

   `key` 속성은 React 렌더러가 `props.videos` 값이 변경될 때 무엇을 해야 할지 파악하는 데 도움을 줍니다. 이는 키를 사용하여 목록의 어느 부분이 새로고침되어야 하고 어느 부분이 동일하게 유지되어야 하는지 결정합니다. 목록과 키에 대한 자세한 정보는 [React 가이드](https://reactjs.org/docs/lists-and-keys.html)에서 찾을 수 있습니다.

3. `App` 컴포넌트에서 자식 컴포넌트가 적절한 속성으로 인스턴스화되었는지 확인합니다. `App.kt`에서 `h3` 요소 아래의 두 루프를 `unwatchedVideos` 및 `watchedVideos` 속성과 함께 `VideoList` 호출로 바꿉니다. Kotlin DSL에서는 `VideoList` 컴포넌트에 속하는 블록 내에서 이를 할당합니다:

   ```kotlin
   h3 {
       +"Videos to watch"
   }
   VideoList {
       videos = unwatchedVideos
   }
   h3 {
       +"Videos watched"
   }
   VideoList {
       videos = watchedVideos
   }
   ```

새로고침 후, 브라우저는 이제 목록이 올바르게 렌더링됨을 보여줄 것입니다.

### 목록을 인터랙티브하게 만들기

먼저, 사용자가 목록 항목을 클릭할 때 나타나는 알림 메시지를 추가합니다. `VideoList.kt`에서 현재 비디오를 포함하는 알림을 트리거하는 `onClick` 핸들러 함수를 추가합니다:

```kotlin
// . . .

p {
    key = video.id.toString()
    onClick = {
        window.alert("Clicked $video!")
    }
    +"${video.speaker}: ${video.title}"
}

// . . .
```

브라우저 창에서 목록 항목 중 하나를 클릭하면 다음과 같은 알림 창에 비디오 정보가 나타납니다:

![Browser alert window](alert-window.png){width=700}

> `onClick` 함수를 람다로 직접 정의하는 것은 간결하고 프로토타이핑에 매우 유용합니다. 그러나 Kotlin/JS에서 동일성(equality)이 [현재 작동하는 방식](https://youtrack.jetbrains.com/issue/KT-15101)으로 인해, 성능 면에서 클릭 핸들러를 전달하는 가장 최적화된 방법은 아닙니다. 렌더링 성능을 최적화하려면 함수를 변수에 저장하고 전달하는 것을 고려하세요.
>
{style="tip"}

### 값을 유지하기 위한 상태(state) 추가하기

단순히 사용자에게 알림을 주는 대신, 선택된 비디오를 ▶ 삼각형으로 강조하는 기능을 추가할 수 있습니다. 이를 위해 이 컴포넌트에 특정한 _상태(state)_를 도입합니다.

상태(state)는 React의 핵심 개념 중 하나입니다. 최신 React(_Hooks API_라고 불리는 것을 사용)에서는 [`useState` 훅(hook)](https://reactjs.org/docs/hooks-state.html)을 사용하여 상태를 표현합니다.

1. `VideoList` 선언 상단에 다음 코드를 추가합니다:

   ```kotlin
   val VideoList = FC<VideoListProps> { props ->
       var selectedVideo: Video? by useState(null)

   // . . .
   ```
   {validate="false"}

   * `VideoList` 함수형 컴포넌트(functional component)는 상태(현재 함수 호출과 독립적인 값)를 유지합니다. 상태는 널 허용(nullable)이며 `Video?` 타입을 가집니다. 기본값은 `null`입니다.
   * React의 `useState()` 함수는 프레임워크가 함수의 여러 호출에 걸쳐 상태를 추적하도록 지시합니다. 예를 들어, 기본값을 지정하더라도 React는 기본값이 초기에만 할당되도록 보장합니다. 상태가 변경되면 컴포넌트는 새 상태를 기반으로 다시 렌더링됩니다.
   * `by` 키워드는 `useState()`가 [위임 속성(delegated property)](delegated-properties.md)으로 작동함을 나타냅니다. 다른 변수와 마찬가지로 값을 읽고 씁니다. `useState()` 뒤의 구현은 상태를 작동시키는 데 필요한 메커니즘을 처리합니다.

   State Hook에 대해 더 자세히 알아보려면 [React 문서](https://reactjs.org/docs/hooks-state.html)를 확인하세요.

2. `VideoList` 컴포넌트의 `onClick` 핸들러와 텍스트를 다음과 같이 변경합니다:

   ```kotlin
   val VideoList = FC<VideoListProps> { props ->
       var selectedVideo: Video? by useState(null)
       for (video in props.videos) {
           p {
               key = video.id.toString()
               onClick = {
                   selectedVideo = video
               }
               if (video == selectedVideo) {
                   +"▶ "
               }
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

   * 사용자가 비디오를 클릭하면 해당 값이 `selectedVideo` 변수에 할당됩니다.
   * 선택된 목록 항목이 렌더링될 때, 삼각형이 앞에 붙습니다.

상태 관리(state management)에 대한 자세한 내용은 [React FAQ](https://reactjs.org/docs/faq-state.html)에서 찾을 수 있습니다.

브라우저를 확인하고 목록에서 항목을 클릭하여 모든 것이 올바르게 작동하는지 확인하세요.

## 컴포넌트 구성하기

현재 두 비디오 목록은 독립적으로 작동하며, 각 목록은 선택된 비디오를 추적합니다.

플레이어가 하나뿐임에도 불구하고, 사용자는 시청하지 않은 목록과 시청한 목록에서 각각 하나씩 두 개의 비디오를 선택할 수 있습니다:

![Two videos are selected in both lists simultaneously](two-videos-select.png){width=700}

목록은 자신 내부에서나 형제 목록 내부에서 어떤 비디오가 선택되었는지 동시에 추적할 수 없습니다. 그 이유는 선택된 비디오가 _목록_ 상태의 일부가 아니라 _애플리케이션_ 상태의 일부이기 때문입니다. 이는 개별 컴포넌트에서 상태를 _들어 올려야(lift)_ 함을 의미합니다.

### 상태(state) 들어 올리기

React는 props가 부모 컴포넌트에서 자식 컴포넌트로만 전달될 수 있도록 보장합니다. 이는 컴포넌트가 하드와이어링(hard-wired)되는 것을 방지합니다.

컴포넌트가 형제 컴포넌트의 상태를 변경하려면, 부모를 통해 그렇게 해야 합니다. 그 시점에서 상태는 더 이상 자식 컴포넌트 중 어느 하나에 속하지 않고, 전체를 아우르는 부모 컴포넌트에 속하게 됩니다.

컴포넌트에서 부모로 상태를 마이그레이션하는 과정을 _상태 들어 올리기(lifting state)_라고 합니다. 앱의 경우, `currentVideo`를 `App` 컴포넌트의 상태로 추가합니다:

1. `App.kt`에서 `App` 컴포넌트 정의 상단에 다음을 추가합니다:

   ```kotlin
   val App = FC<Props> {
       var currentVideo: Video? by useState(null)
   
       // . . .
   }
   ```

   `VideoList` 컴포넌트는 더 이상 상태를 추적할 필요가 없습니다. 대신 현재 비디오를 prop으로 받게 됩니다.

2. `VideoList.kt`에서 `useState()` 호출을 제거합니다.
3. `VideoList` 컴포넌트가 선택된 비디오를 prop으로 받도록 준비합니다. 이를 위해 `VideoListProps` 인터페이스를 확장하여 `selectedVideo`를 포함하도록 합니다:

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
       var selectedVideo: Video?
   }
   ```

4. 삼각형의 조건을 `state` 대신 `props`를 사용하도록 변경합니다:

   ```kotlin
   if (video == props.selectedVideo) {
       +"▶ "
   }
   ```

### 핸들러 전달하기

현재 prop에 값을 할당할 방법이 없으므로 `onClick` 함수는 현재 설정된 방식으로 작동하지 않습니다. 부모 컴포넌트의 상태를 변경하려면 상태를 다시 들어 올려야 합니다.

React에서 상태는 항상 부모에서 자식으로 흐릅니다. 따라서 자식 컴포넌트 중 하나에서 _애플리케이션_ 상태를 변경하려면, 사용자 상호 작용을 처리하는 로직을 부모 컴포넌트로 이동시킨 다음 해당 로직을 prop으로 전달해야 합니다. Kotlin에서는 변수가 [함수 타입](lambdas.md#function-types)을 가질 수 있다는 점을 기억하세요.

1. `VideoListProps` 인터페이스를 다시 확장하여 `Video`를 인수로 받고 `Unit`을 반환하는 함수인 `onSelectVideo` 변수를 포함하도록 합니다:

   ```kotlin
   external interface VideoListProps : Props {
       // ...
       var onSelectVideo: (Video) -> Unit
   }
   ```

2. `VideoList` 컴포넌트에서 새 prop을 `onClick` 핸들러에 사용합니다:

   ```kotlin
   onClick = {
       props.onSelectVideo(video)
   }
   ```
   
   이제 `VideoList` 컴포넌트에서 `selectedVideo` 변수를 삭제할 수 있습니다.

3. `App` 컴포넌트로 돌아가서 두 비디오 목록 각각에 대해 `selectedVideo`와 `onSelectVideo` 핸들러를 전달합니다:

   ```kotlin
   VideoList {
       videos = unwatchedVideos // and watchedVideos respectively
       selectedVideo = currentVideo
       onSelectVideo = { video ->
           currentVideo = video
       }
   }
   ```

4. 시청한 비디오 목록에 대해서도 이전 단계를 반복합니다.

브라우저로 돌아가서 비디오를 선택할 때 선택이 두 목록 사이에서 중복 없이 전환되는지 확인하세요.

## 컴포넌트 더 추가하기

### 비디오 플레이어 컴포넌트 추출하기

이제 또 다른 자체 포함 컴포넌트인 비디오 플레이어를 만들 수 있습니다. 현재는 플레이스홀더 이미지입니다. 비디오 플레이어는 강연 제목, 강연자, 비디오 링크를 알아야 합니다. 이 정보는 각 `Video` 객체에 이미 포함되어 있으므로, prop으로 전달하여 해당 속성에 접근할 수 있습니다.

1. 새 `VideoPlayer.kt` 파일을 생성하고 `VideoPlayer` 컴포넌트에 대한 다음 구현을 추가합니다:

   ```kotlin
   import csstype.*
   import react.*
   import emotion.react.css
   import react.dom.html.ReactHTML.button
   import react.dom.html.ReactHTML.div
   import react.dom.html.ReactHTML.h3
   import react.dom.html.ReactHTML.img
   
   external interface VideoPlayerProps : Props {
       var video: Video
   }
   
   val VideoPlayer = FC<VideoPlayerProps> { props ->
       div {
           css {
               position = Position.absolute
               top = 10.px
               right = 10.px
           }
           h3 {
               +"${props.video.speaker}: ${props.video.title}"
           }
           img {
               src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
           }
       }
   }
   ```

2. `VideoPlayerProps` 인터페이스가 `VideoPlayer` 컴포넌트가 널 불가능(non-nullable)한 `Video`를 받는다고 지정하므로, `App` 컴포넌트에서 이에 맞춰 처리해야 합니다.

   `App.kt`에서 비디오 플레이어에 대한 이전 `div` 스니펫을 다음으로 바꿉니다:

   ```kotlin
   currentVideo?.let { curr ->
       VideoPlayer {
           video = curr
       }
   }
   ```

   [`let` 스코프 함수](scope-functions.md#let)는 `state.currentVideo`가 null이 아닐 때만 `VideoPlayer` 컴포넌트가 추가되도록 보장합니다.

이제 목록의 항목을 클릭하면 비디오 플레이어가 나타나고 클릭된 항목의 정보로 채워질 것입니다.

### 버튼 추가 및 연결하기

사용자가 비디오를 시청했거나 시청하지 않은 것으로 표시하고 두 목록 사이를 이동할 수 있도록, `VideoPlayer` 컴포넌트에 버튼을 추가합니다.

이 버튼은 두 개의 다른 목록 사이에서 비디오를 이동시키므로, 상태 변경을 처리하는 로직은 `VideoPlayer`에서 _들어 올려져_ 부모로부터 prop으로 전달되어야 합니다. 버튼은 비디오가 시청되었는지 여부에 따라 다르게 보여야 합니다. 이 또한 prop으로 전달해야 하는 정보입니다.

1. `VideoPlayer.kt`의 `VideoPlayerProps` 인터페이스를 확장하여 이 두 경우에 대한 속성을 포함하도록 합니다:

   ```kotlin
   external interface VideoPlayerProps : Props {
       var video: Video
       var onWatchedButtonPressed: (Video) -> Unit
       var unwatchedVideo: Boolean
   }
   ```

2. 이제 실제 컴포넌트에 버튼을 추가할 수 있습니다. 다음 스니펫을 `VideoPlayer` 컴포넌트의 본문, `h3`와 `img` 태그 사이에 복사합니다:

   ```kotlin
   button {
       css {
           display = Display.block
           backgroundColor = if (props.unwatchedVideo) NamedColor.lightgreen else NamedColor.red
       }
       onClick = {
           props.onWatchedButtonPressed(props.video)
       }
       if (props.unwatchedVideo) {
           +"Mark as watched"
       } else {
           +"Mark as unwatched"
       }
   }
   ```

   스타일을 동적으로 변경할 수 있게 해주는 Kotlin CSS DSL의 도움을 받아, 기본적인 Kotlin `if` 표현식을 사용하여 버튼의 색상을 변경할 수 있습니다.

### 비디오 목록을 애플리케이션 상태(state)로 이동하기

이제 `App` 컴포넌트에서 `VideoPlayer` 사용 위치를 조정할 시간입니다. 버튼이 클릭되면 비디오가 시청하지 않은 목록에서 시청한 목록으로 또는 그 반대로 이동해야 합니다. 이제 이 목록들이 실제로 변경될 수 있으므로, 이를 애플리케이션 상태(state)로 이동합니다:

1. `App.kt`에서 `useState()` 호출을 사용하여 다음 속성들을 `App` 컴포넌트 상단에 추가합니다:

   ```kotlin
   val App = FC<Props> {
       var currentVideo: Video? by useState(null)
       var unwatchedVideos: List<Video> by useState(listOf(
           Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
           Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
           Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
       ))
       var watchedVideos: List<Video> by useState(listOf(
           Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
       ))

       // . . .
   }
   ```
   {validate="false"}

2. 모든 데모 데이터가 `watchedVideos` 및 `unwatchedVideos`의 기본값에 직접 포함되어 있으므로, 더 이상 파일 수준 선언이 필요하지 않습니다. `Main.kt`에서 `watchedVideos` 및 `unwatchedVideos` 선언을 삭제합니다.
3. 비디오 플레이어에 속하는 `App` 컴포넌트의 `VideoPlayer` 호출 지점을 다음과 같이 변경합니다:

   ```kotlin
   VideoPlayer {
       video = curr
       unwatchedVideo = curr in unwatchedVideos
       onWatchedButtonPressed = {
           if (video in unwatchedVideos) {
               unwatchedVideos = unwatchedVideos - video
               watchedVideos = watchedVideos + video
           } else {
               watchedVideos = watchedVideos - video
               unwatchedVideos = unwatchedVideos + video
           }
       }
   }
   ```

브라우저로 돌아가 비디오를 선택하고 버튼을 몇 번 누릅니다. 비디오가 두 목록 사이에서 전환될 것입니다.

## npm 패키지 사용하기

앱을 사용 가능하게 만들려면, 실제로 비디오를 재생하는 비디오 플레이어와 콘텐츠 공유를 돕는 몇 가지 버튼이 여전히 필요합니다.

React는 풍부한 생태계를 가지고 있으며, 직접 기능을 빌드하는 대신 사용할 수 있는 많은 기성(pre-made) 컴포넌트가 있습니다.

### 비디오 플레이어 컴포넌트 추가하기

플레이스홀더 비디오 컴포넌트를 실제 YouTube 플레이어로 바꾸려면 npm의 `react-player` 패키지를 사용하세요. 이 패키지는 비디오를 재생할 수 있으며 플레이어의 모양을 제어할 수 있습니다.

컴포넌트 문서 및 API 설명은 GitHub의 [README](https://www.npmjs.com/package/react-player)를 참조하세요.

1. `build.gradle.kts` 파일을 확인합니다. `react-player` 패키지는 이미 포함되어 있어야 합니다:

   ```kotlin
   dependencies {
       // ...
       // Video Player
       implementation(npm("react-player", "2.12.0"))
       // ...
   }
   ```

   보시다시피, `build` 파일의 `dependencies` 블록에서 `npm()` 함수를 사용하여 Kotlin/JS 프로젝트에 npm 종속성을 추가할 수 있습니다. Gradle 플러그인은 이러한 종속성을 자동으로 다운로드하고 설치해 줍니다. 이를 위해 자체 번들된 [Yarn](https://yarnpkg.com/) 패키지 관리자를 사용합니다.

2. React 애플리케이션 내부에서 JavaScript 패키지를 사용하려면, [외부 선언(external declarations)](js-interop.md)을 제공하여 Kotlin 컴파일러에 무엇을 기대해야 하는지 알려줄 필요가 있습니다.

   새 `ReactYouTube.kt` 파일을 생성하고 다음 내용을 추가합니다:

   ```kotlin
   @file:JsModule("react-player")
   @file:JsNonModule
   
   import react.*
   
   @JsName("default")
   external val ReactPlayer: ComponentClass<dynamic>
   ```

   컴파일러가 `ReactPlayer`와 같은 외부 선언을 보면, 해당 클래스의 구현이 종속성(dependency)에 의해 제공된다고 가정하고 해당 코드를 생성하지 않습니다.

   마지막 두 줄은 `require("react-player").default;`와 같은 JavaScript import와 동일합니다. 이는 컴포넌트가 런타임에 `ComponentClass<dynamic>`에 부합할 것이라고 컴파일러에게 알려줍니다.

그러나 이 구성에서는 `ReactPlayer`가 허용하는 props의 제네릭 타입이 `dynamic`으로 설정됩니다. 이는 컴파일러가 런타임에 문제를 일으킬 위험을 감수하고 어떤 코드든 허용한다는 의미입니다.

더 나은 대안은 이 외부 컴포넌트의 props에 어떤 종류의 속성이 속하는지 지정하는 `external interface`를 생성하는 것입니다. 컴포넌트의 [README](https://www.npmjs.com/package/react-player)에서 props 인터페이스에 대해 알아볼 수 있습니다. 이 경우 `url`과 `controls` props를 사용합니다:

1. `ReactYouTube.kt`의 내용을 `dynamic`을 외부 인터페이스로 대체하여 조정합니다:

   ```kotlin
   @file:JsModule("react-player")
   @file:JsNonModule
   
   import react.*
   
   @JsName("default")
   external val ReactPlayer: ComponentClass<ReactPlayerProps>
   
   external interface ReactPlayerProps : Props {
       var url: String
       var controls: Boolean
   }
   ```

2. 이제 새로운 `ReactPlayer`를 사용하여 `VideoPlayer` 컴포넌트의 회색 플레이스홀더 직사각형을 대체할 수 있습니다. `VideoPlayer.kt`에서 `img` 태그를 다음 스니펫으로 바꿉니다:

   ```kotlin
   ReactPlayer {
       url = props.video.videoUrl
       controls = true
   }
   ```

### 소셜 공유 버튼 추가하기

애플리케이션 콘텐츠를 쉽게 공유하는 방법은 메신저 및 이메일용 소셜 공유 버튼을 갖는 것입니다. 예를 들어 [react-share](https://github.com/nygardk/react-share/blob/master/README.md)와 같이 기성 React 컴포넌트를 사용할 수도 있습니다:

1. `build.gradle.kts` 파일을 확인합니다. 이 npm 라이브러리는 이미 포함되어 있어야 합니다:

   ```kotlin
   dependencies {
       // ...
       // Share Buttons
       implementation(npm("react-share", "4.4.1"))
       // ...
   }
   ```

2. Kotlin에서 `react-share`를 사용하려면 더 기본적인 외부 선언을 작성해야 합니다. GitHub의 [예시](https://github.com/nygardk/react-share/blob/master/demo/Demo.tsx#L61)는 공유 버튼이 `EmailShareButton`과 `EmailIcon`과 같은 두 개의 React 컴포넌트로 구성됨을 보여줍니다. 다양한 유형의 공유 버튼과 아이콘은 모두 동일한 인터페이스를 가집니다. 비디오 플레이어에 대해 이미 했던 방식과 동일하게 각 컴포넌트에 대한 외부 선언을 생성합니다.

   새 `ReactShare.kt` 파일에 다음 코드를 추가합니다:

   ```kotlin
   @file:JsModule("react-share")
   @file:JsNonModule
   
   import react.ComponentClass
   import react.Props
   
   @JsName("EmailIcon")
   external val EmailIcon: ComponentClass<IconProps>
   
   @JsName("EmailShareButton")
   external val EmailShareButton: ComponentClass<ShareButtonProps>
   
   @JsName("TelegramIcon")
   external val TelegramIcon: ComponentClass<IconProps>
   
   @JsName("TelegramShareButton")
   external val TelegramShareButton: ComponentClass<ShareButtonProps>
   
   external interface ShareButtonProps : Props {
       var url: String
   }
   
   external interface IconProps : Props {
       var size: Int
       var round: Boolean
   }
   ```

3. 애플리케이션의 사용자 인터페이스에 새 컴포넌트를 추가합니다. `VideoPlayer.kt`에서 `ReactPlayer` 사용 바로 위에 `div` 안에 두 개의 공유 버튼을 추가합니다:

   ```kotlin
   // . . .

   div {
       css {
            position = Position.absolute
            top = 10.px
            right = 10.px
        }
       EmailShareButton {
           url = props.video.videoUrl
           EmailIcon {
               size = 32
               round = true
           }
       }
       TelegramShareButton {
           url = props.video.videoUrl
           TelegramIcon {
               size = 32
               round = true
           }
       }
   }

   // . . .
   ```

이제 브라우저를 확인하고 버튼이 실제로 작동하는지 확인할 수 있습니다. 버튼을 클릭하면 비디오 URL이 포함된 _공유 창_이 나타나야 합니다. 버튼이 나타나지 않거나 작동하지 않으면 광고 및 소셜 미디어 차단기를 비활성화해야 할 수 있습니다.

![Share window](social-buttons.png){width=700}

[react-share](https://github.com/nygardk/react-share/blob/master/README.md#features)에서 사용 가능한 다른 소셜 네트워크용 공유 버튼으로 이 단계를 자유롭게 반복해 보세요.

## 외부 REST API 사용하기

이제 앱에서 하드코딩된 데모 데이터를 REST API의 실제 데이터로 바꿀 수 있습니다.

이 튜토리얼을 위해 [작은 API](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1)가 제공됩니다. 이 API는 단일 엔드포인트 `videos`만 제공하며, 목록에서 요소를 액세스하기 위한 숫자 매개변수를 받습니다. 브라우저로 API를 방문하면 API에서 반환되는 객체가 `Video` 객체와 동일한 구조를 가짐을 확인할 수 있습니다.

### Kotlin에서 JS 기능 사용하기

브라우저는 이미 다양한 [웹 API](https://developer.mozilla.org/en-US/docs/Web/API)를 내장하고 있습니다. Kotlin/JS에는 이러한 API에 대한 래퍼가 기본적으로 포함되어 있으므로 Kotlin/JS에서도 이를 사용할 수 있습니다. 한 가지 예시는 HTTP 요청을 만드는 데 사용되는 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)입니다.

첫 번째 잠재적인 문제는 `fetch()`와 같은 브라우저 API가 논블로킹(non-blocking) 작업을 수행하기 위해 [콜백(callbacks)](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)을 사용한다는 것입니다. 여러 콜백이 순서대로 실행되어야 할 때, 콜백은 중첩되어야 합니다. 당연히 코드는 점점 더 많은 기능이 서로 쌓이면서 들여쓰기가 심해지고, 이는 가독성을 떨어뜨립니다.

이를 극복하기 위해, 이러한 기능에 더 나은 접근 방식인 Kotlin의 코루틴(coroutines)을 사용할 수 있습니다.

두 번째 문제는 JavaScript의 동적 타입 특성에서 발생합니다. 외부 API에서 반환되는 데이터의 타입에 대한 보장이 없습니다. 이를 해결하기 위해 `kotlinx.serialization` 라이브러리를 사용할 수 있습니다.

`build.gradle.kts` 파일을 확인합니다. 관련 스니펫은 이미 존재해야 합니다:

```kotlin
dependencies {
    // . . .

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
}
```

### 직렬화(serialization) 추가하기

외부 API를 호출하면 JSON 형식의 텍스트가 반환되며, 이는 여전히 작업 가능한 Kotlin 객체로 변환되어야 합니다.

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)은 JSON 문자열을 Kotlin 객체로 변환하는 이러한 유형의 작업을 가능하게 하는 라이브러리입니다.

1. `build.gradle.kts` 파일을 확인합니다. 해당 스니펫은 이미 존재해야 합니다:

   ```kotlin
   plugins {
       // . . .
       kotlin("plugin.serialization") version "%kotlinVersion%"
   }
   
   dependencies {
       // . . .

       // Serialization
       implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
   }
   ```

2. 첫 번째 비디오를 가져오기 위한 준비로, 직렬화 라이브러리에 `Video` 클래스에 대해 알려줄 필요가 있습니다. `Main.kt`에서 정의에 `@Serializable` 어노테이션을 추가합니다:

   ```kotlin
   @Serializable
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

### 비디오 가져오기

API에서 비디오를 가져오려면, `App.kt` (또는 새 파일)에 다음 함수를 추가합니다:

```kotlin
suspend fun fetchVideo(id: Int): Video {
    val response = window
        .fetch("https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/$id")
        .await()
        .text()
        .await()
    return Json.decodeFromString(response)
}
```

* _정지 함수(Suspending function)_ `fetch()`는 주어진 `id`를 가진 비디오를 API에서 가져옵니다. 이 응답은 시간이 걸릴 수 있으므로, 결과를 `await()`합니다. 다음으로, 콜백을 사용하는 `text()`가 응답에서 본문(body)을 읽습니다. 그런 다음 완료될 때까지 `await()`합니다.
* 함수의 값을 반환하기 전에, `kotlinx.coroutines`의 함수인 `Json.decodeFromString`에 전달합니다. 이 함수는 요청에서 받은 JSON 텍스트를 적절한 필드를 가진 Kotlin 객체로 변환합니다.
* `window.fetch` 함수 호출은 `Promise` 객체를 반환합니다. 일반적으로 `Promise`가 해결되고 결과가 사용 가능해지면 호출되는 콜백 핸들러를 정의해야 합니다. 그러나 코루틴을 사용하면 해당 `Promise`를 `await()`할 수 있습니다. `await()`와 같은 함수가 호출될 때마다 메서드는 실행을 중지(일시 중단)합니다. `Promise`가 해결되면 실행이 계속됩니다.

사용자에게 비디오를 선택할 수 있도록, 위와 동일한 API에서 25개의 비디오를 가져올 `fetchVideos()` 함수를 정의합니다. 모든 요청을 동시에 실행하려면 Kotlin 코루틴에서 제공하는 [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 기능을 사용하세요:

1. `App.kt`에 다음 구현을 추가합니다:

   ```kotlin
   suspend fun fetchVideos(): List<Video> = coroutineScope {
       (1..25).map { id ->
           async {
               fetchVideo(id)
           }
       }.awaitAll()
   }
   ```

   [구조화된 동시성(structured concurrency)](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency) 원칙에 따라, 구현은 `coroutineScope`로 래핑됩니다. 그런 다음 25개의 비동기 작업(요청당 하나)을 시작하고 모두 완료될 때까지 기다릴 수 있습니다.

2. 이제 애플리케이션에 데이터를 추가할 수 있습니다. `mainScope`에 대한 정의를 추가하고, `App` 컴포넌트가 다음 스니펫으로 시작하도록 변경합니다. 데모 값을 `emptyLists` 인스턴스로 교체하는 것도 잊지 마세요:

   ```kotlin
   val mainScope = MainScope()
   
   val App = FC<Props> {
       var currentVideo: Video? by useState(null)
       var unwatchedVideos: List<Video> by useState(emptyList())
       var watchedVideos: List<Video> by useState(emptyList())
   
       useEffectOnce {
           mainScope.launch {
               unwatchedVideos = fetchVideos()
           }
       }

   // . . .
   ```
   {validate="false"}

   * [`MainScope()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html)는 Kotlin의 구조화된 동시성 모델의 일부이며 비동기 작업이 실행될 스코프를 생성합니다.
   * `useEffectOnce`는 또 다른 React _훅(hook)_ (특히, [useEffect](https://reactjs.org/docs/hooks-effect.html) 훅의 간소화된 버전)입니다. 이는 컴포넌트가 _부수 효과(side effect)_를 수행함을 나타냅니다. 단순히 자신을 렌더링하는 것이 아니라 네트워크를 통해 통신하기도 합니다.

브라우저를 확인합니다. 애플리케이션에 실제 데이터가 표시되어야 합니다:

![Fetched data from API](website-api-data.png){width=700}

페이지를 로드할 때:

* `App` 컴포넌트의 코드가 호출됩니다. 이는 `useEffectOnce` 블록의 코드를 시작합니다.
* `App` 컴포넌트는 시청했거나 시청하지 않은 비디오에 대해 빈 목록으로 렌더링됩니다.
* API 요청이 완료되면 `useEffectOnce` 블록은 이를 `App` 컴포넌트의 상태에 할당합니다. 이는 재렌더링을 트리거합니다.
* `App` 컴포넌트의 코드가 다시 호출되지만, `useEffectOnce` 블록은 두 번째로 실행되지 _않습니다_.

코루틴이 어떻게 작동하는지 심층적으로 이해하고 싶다면, 이 [코루틴 튜토리얼](coroutines-and-channels.md)을 확인하세요.

## 프로덕션 및 클라우드 배포하기

이제 애플리케이션을 클라우드에 게시하고 다른 사람들이 접근할 수 있도록 할 시간입니다.

### 프로덕션 빌드 패키징하기

모든 자산(assets)을 프로덕션 모드로 패키징하려면 IntelliJ IDEA의 도구 창에서 Gradle의 `build` 작업을 실행하거나 `./gradlew build`를 실행합니다. 이렇게 하면 DCE(dead code elimination)와 같은 다양한 개선 사항이 적용된 최적화된 프로젝트 빌드가 생성됩니다.

빌드가 완료되면 배포에 필요한 모든 파일을 `/build/dist`에서 찾을 수 있습니다. 여기에는 JavaScript 파일, HTML 파일 및 애플리케이션 실행에 필요한 기타 리소스가 포함됩니다. 이를 정적 HTTP 서버에 두거나, GitHub Pages를 사용하여 제공하거나, 선택한 클라우드 공급자에서 호스팅할 수 있습니다.

### Heroku에 배포하기

Heroku는 자체 도메인으로 접근 가능한 애플리케이션을 손쉽게 실행할 수 있게 해줍니다. 개발 목적으로는 무료 티어(free tier)로 충분할 것입니다.

1. [계정을 생성합니다](https://signup.heroku.com/).
2. [CLI 클라이언트를 설치하고 인증합니다](https://devcenter.heroku.com/articles/heroku-cli).
3. 프로젝트 루트에서 터미널에 다음 명령어를 실행하여 Git 저장소를 생성하고 Heroku 앱을 연결합니다:

   ```bash
   git init
   heroku create
   git add .
   git commit -m "initial commit"
   ```

4. Heroku에서 실행되는 일반적인 JVM 애플리케이션(예: Ktor 또는 Spring Boot로 작성된 애플리케이션)과 달리, 이 앱은 정적 HTML 페이지와 JavaScript 파일을 생성하며, 이에 따라 제공되어야 합니다. 필요한 빌드팩(buildpack)을 조정하여 프로그램을 올바르게 제공할 수 있습니다:

   ```bash
   heroku buildpacks:set heroku/gradle
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
   ```

5. `heroku/gradle` 빌드팩이 제대로 실행되려면 `build.gradle.kts` 파일에 `stage` 작업이 있어야 합니다. 이 작업은 `build` 작업과 동일하며, 해당 별칭(alias)은 파일 하단에 이미 포함되어 있습니다:

   ```kotlin
   // Heroku Deployment
   tasks.register("stage") {
       dependsOn("build")
   }
   ```

6. `buildpack-static`을 구성하기 위해 프로젝트 루트에 새 `static.json` 파일을 추가합니다.
7. 파일 내부에 `root` 속성을 추가합니다:

   ```xml
   {
       "root": "build/distributions"
   }
   ```
   {validate="false"}

8. 이제 예를 들어 다음 명령어를 실행하여 배포를 트리거할 수 있습니다:

   ```bash
   git add -A
   git commit -m "add stage task and static content root configuration"
   git push heroku master
   ```

> `main` 브랜치가 아닌 다른 브랜치에서 푸시하는 경우, 예를 들어 `git push heroku feature-branch:main`과 같이 `main` 원격으로 푸시하도록 명령어를 조정하세요.
>
{style="tip"}

배포가 성공하면, 사람들이 인터넷에서 애플리케이션에 접근할 수 있는 URL이 표시될 것입니다.

![Web app deployment to production](deployment-to-production.png){width=700}

> 이 프로젝트 상태는 `finished` 브랜치 [여기](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)에서 찾을 수 있습니다.
>
{style="note"}

## 다음 단계

### 기능 더 추가하기 {initial-collapse-state="collapsed" collapsible="true"}

결과로 생성된 앱을 시작점으로 삼아 React, Kotlin/JS 등 분야의 고급 주제를 더 탐구할 수 있습니다.

* **검색**. 강연 목록을 제목이나 저자 등으로 필터링할 수 있는 검색 필드를 추가할 수 있습니다. [React에서 HTML 폼 요소가 작동하는 방식](https://reactjs.org/docs/forms.html)에 대해 알아보세요.
* **지속성**. 현재 애플리케이션은 페이지가 새로고침될 때마다 시청자의 시청 목록을 잃어버립니다. Kotlin에서 사용 가능한 웹 프레임워크(예: [Ktor](https://ktor.io/)) 중 하나를 사용하여 자체 백엔드를 구축하는 것을 고려해 보세요. 또는 [클라이언트에 정보를 저장하는 방법](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)을 알아보세요.
* **복잡한 API**. 많은 데이터셋과 API를 사용할 수 있습니다. 애플리케이션에 모든 종류의 데이터를 가져올 수 있습니다. 예를 들어, [고양이 사진](https://thecatapi.com/) 시각화 도구 또는 [로열티 프리 스톡 사진 API](https://unsplash.com/developers)를 구축할 수 있습니다.

### 스타일 개선: 반응형 및 그리드 {initial-collapse-state="collapsed" collapsible="true"}

애플리케이션 디자인은 여전히 매우 단순하며 모바일 장치나 좁은 창에서는 멋지게 보이지 않을 것입니다. CSS DSL을 더 탐색하여 앱을 더 접근성 있게 만드세요.

### 커뮤니티 참여 및 도움 받기 {initial-collapse-state="collapsed" collapsible="true"}

문제를 보고하고 도움을 받는 가장 좋은 방법은 [kotlin-wrappers 이슈 트래커](https://github.com/JetBrains/kotlin-wrappers/issues)입니다. 문제에 대한 티켓을 찾을 수 없다면, 자유롭게 새 티켓을 제출하세요. 공식 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)에 참여할 수도 있습니다. `#javascript` 및 `#react` 채널이 있습니다.

### 코루틴에 대해 더 알아보기 {initial-collapse-state="collapsed" collapsible="true"}

동시성 코드를 작성하는 방법에 대해 더 자세히 알아보고 싶다면, 이 [코루틴 튜토리얼](coroutines-and-channels.md)을 확인하세요.

### React에 대해 더 알아보기 {initial-collapse-state="collapsed" collapsible="true"}

이제 기본적인 React 개념과 이것이 Kotlin으로 어떻게 변환되는지 알았으므로, [React 문서](https://react.dev/learn)에 설명된 다른 개념들을 Kotlin으로 변환할 수 있습니다.