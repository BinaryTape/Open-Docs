---
title: "Kotlin/JS 프로젝트를 IR 컴파일러로 마이그레이션하기"
---
Kotlin의 모든 플랫폼에서 동작을 통합하고 새로운 JS 관련 최적화를 구현하기 위해 기존 Kotlin/JS 컴파일러를 [IR 기반 컴파일러](js-ir-compiler)로 교체했습니다.
두 컴파일러 간의 내부적인 차이점에 대한 자세한 내용은 Sebastian Aigner의 블로그 게시물
[Migrating our Kotlin/JS app to the new IR compiler](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i)에서 확인할 수 있습니다.

컴파일러 간의 중요한 차이점으로 인해 Kotlin/JS 프로젝트를 기존 백엔드에서 새로운 백엔드로 전환하려면 코드를 조정해야 할 수 있습니다. 이 페이지에서는 제안된 솔루션과 함께 알려진 마이그레이션 문제 목록을 정리했습니다.

:::tip
[Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) 플러그인을 설치하여
마이그레이션 중에 발생하는 일부 문제를 해결하는 방법에 대한 유용한 팁을 얻으세요.

:::

이 가이드는 문제를 해결하고 새로운 문제를 발견함에 따라 시간이 지남에 따라 변경될 수 있습니다. 이 가이드를 완전하게 유지할 수 있도록 도와주세요.
IR 컴파일러로 전환할 때 발생하는 문제는 이슈 트래커 [YouTrack](https://kotl.in/issue)에 제출하거나
[이 양식](https://surveys.jetbrains.com/s3/ir-be-migration-issue)을 작성하여 보고해 주세요.

## JS 및 React 관련 클래스 및 인터페이스를 external 인터페이스로 변환

**문제**: React의 `State` 및
`Props`와 같은 순수 JS 클래스에서 파생된 Kotlin 인터페이스 및 클래스(데이터 클래스 포함)를 사용하면 `ClassCastException`이 발생할 수 있습니다. 이러한 예외는 컴파일러가
이러한 클래스의 인스턴스를 JS에서 가져온 경우에도 Kotlin 객체인 것처럼 처리하려고 시도하기 때문에 발생합니다.

**해결 방법**: 순수 JS 클래스에서 파생된 모든 클래스 및 인터페이스를 [external 인터페이스](js-interop#external-interfaces)로 변환합니다.

```kotlin
// 다음을 교체합니다.
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// 다음으로 교체합니다.
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

IntelliJ IDEA에서는 다음과 같은 [구조적 검색 및 바꾸기](https://www.jetbrains.com/help/idea/structural-search-and-replace.html)
템플릿을 사용하여 인터페이스를 `external`로 자동 표시할 수 있습니다.
* [`State` 템플릿](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [`Props` 템플릿](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## external 인터페이스의 속성을 var로 변환

**문제**: Kotlin/JS 코드의 external 인터페이스 속성은 읽기 전용(`val`) 속성일 수 없습니다. 해당 값은
[`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)의 도우미 함수인 `js()` 또는 `jso()`로 객체를 생성한 후에만 할당할 수 있기 때문입니다.

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**해결 방법**: external 인터페이스의 모든 속성을 `var`로 변환합니다.

```kotlin
// 다음을 교체합니다.
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// 다음으로 교체합니다.
external interface CustomComponentState : State {
   var name: String
}
```

## external 인터페이스에서 receiver가 있는 함수를 일반 함수로 변환

**문제**: external 선언에는 확장 함수 또는 해당 함수 유형이 있는 속성과 같이 receiver가 있는 함수를 포함할 수 없습니다.

**해결 방법**: receiver 객체를 인수로 추가하여 해당 함수 및 속성을 일반 함수로 변환합니다.

```kotlin
// 다음을 교체합니다.
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() `->` Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) `->` Unit
}
```

## 상호 운용성을 위해 일반 JS 객체 생성

**문제**: external 인터페이스를 구현하는 Kotlin 객체의 속성은 _enumerable_이 아닙니다. 즉, 객체의 속성을 반복하는 작업에 대해 표시되지 않습니다(예:
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

이름으로 계속 액세스할 수 있지만: `obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // 일반 JS 객체
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin 객체
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON은 속성이 아닌 backing field만 확인합니다.
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**해결 방법 1**: `js()` 또는 `jso()`( [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)의 도우미 함수)를 사용하여 일반 JavaScript 객체를 생성합니다.

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// 다음을 교체합니다.
val ktApp = AppPropsImpl("App1") // Kotlin 객체
```

```kotlin
// 다음으로 교체합니다.
val jsApp = js("{name: 'App1'}") as AppProps // 또는 jso {}
```

**해결 방법 2**: `kotlin.js.json()`으로 객체 생성:

```kotlin
// 또는 다음으로 생성
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 함수 참조에서 toString() 호출을 .name으로 교체

**문제**: IR 백엔드에서 함수 참조에 대해 `toString()`을 호출하면 고유한 값이 생성되지 않습니다.

**해결 방법**: `toString()` 대신 `name` 속성을 사용합니다.

## 빌드 스크립트에서 binaries.executable()을 명시적으로 지정

**문제**: 컴파일러가 실행 가능한 `.js` 파일을 생성하지 않습니다.

이 문제는 기본 컴파일러가 기본적으로 JavaScript 실행 파일을 생성하는 반면 IR 컴파일러는
이를 수행하기 위한 명시적 지침이 필요하기 때문에 발생할 수 있습니다. 자세한 내용은 [Kotlin/JS 프로젝트 설정 지침](js-project-setup#execution-environments)에서 확인하세요.

**해결 방법**: `binaries.executable()` 줄을 프로젝트의 `build.gradle(.kts)`에 추가합니다.

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## Kotlin/JS IR 컴파일러를 사용할 때 추가 문제 해결 팁

다음 힌트는 Kotlin/JS IR 컴파일러를 사용하여 프로젝트에서 문제를 해결할 때 도움이 될 수 있습니다.

### external 인터페이스에서 부울 속성을 nullable로 만들기

**문제**: external 인터페이스에서 `Boolean`에 대해 `toString`을 호출할 때 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')`과 같은 오류가 발생합니다. JavaScript는 부울 변수의 `null` 또는 `undefined` 값을 `false`로 처리합니다. `null` 또는 `undefined`일 수 있는 `Boolean`에 대해 `toString`을 호출하는 데 의존하는 경우(예: 코드가 제어할 수 없는 JavaScript 코드에서 호출될 때) 다음 사항에 유의하세요.

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**해결 방법**: external 인터페이스의 `Boolean` 속성을 nullable(`Boolean?`)로 만들 수 있습니다.

```kotlin
// 다음을 교체합니다.
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// 다음으로 교체합니다.
external interface SomeExternal {
    var visible: Boolean?
}
```