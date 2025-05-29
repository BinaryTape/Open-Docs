[//]: # (title: Kotlin/JS 프로젝트를 IR 컴파일러로 마이그레이션하기)

Kotlin의 모든 플랫폼에서의 동작을 통일하고 새로운 JS 특정 최적화를 구현하는 등의 목적으로 기존 Kotlin/JS 컴파일러를 [IR 기반 컴파일러](js-ir-compiler.md)로 교체했습니다. 두 컴파일러 간의 내부적인 차이점에 대해서는 Sebastian Aigner의 블로그 게시물 [Migrating our Kotlin/JS app to the new IR compiler](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i)에서 자세히 알아볼 수 있습니다.

컴파일러 간의 상당한 차이로 인해, 기존 백엔드에서 새로운 백엔드로 Kotlin/JS 프로젝트를 전환하려면 코드 조정이 필요할 수 있습니다. 이 페이지에서는 알려진 마이그레이션 문제점과 제안된 해결책 목록을 정리했습니다.

> [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) 플러그인을 설치하여 마이그레이션 중에 발생하는 일부 문제를 해결하는 데 유용한 팁을 얻으세요.
>
{style="tip"}

이 가이드는 문제가 수정되고 새로운 문제가 발견됨에 따라 시간이 지남에 따라 변경될 수 있습니다. 가이드를 완벽하게 유지할 수 있도록 도와주세요. IR 컴파일러로 전환할 때 발생하는 모든 문제를 이슈 트래커 [YouTrack](https://kotl.in/issue)에 제출하거나 [이 양식](https://surveys.jetbrains.com/s3/ir-be-migration-issue)을 작성하여 보고해 주십시오.

## JS 및 React 관련 클래스와 인터페이스를 외부 인터페이스로 변환하기

**문제**: React의 `State` 및 `Props`와 같은 순수 JS 클래스에서 파생된 Kotlin 인터페이스 및 클래스(데이터 클래스 포함)를 사용하면 `ClassCastException`이 발생할 수 있습니다. 이러한 예외는 컴파일러가 실제로는 JS에서 온 이러한 클래스의 인스턴스를 Kotlin 객체인 것처럼 다루려고 시도하기 때문에 발생합니다.

**해결책**: 순수 JS 클래스에서 파생된 모든 클래스와 인터페이스를 [외부 인터페이스](js-interop.md#external-interfaces)로 변환하세요.

```kotlin
// Replace this
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// With this
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

IntelliJ IDEA에서는 다음 [구조 검색 및 바꾸기](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) 템플릿을 사용하여 인터페이스를 자동으로 `external`로 표시할 수 있습니다.
* [`State`용 템플릿](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [`Props`용 템플릿](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## 외부 인터페이스의 프로퍼티를 var로 변환하기

**문제**: Kotlin/JS 코드의 외부 인터페이스 프로퍼티는 읽기 전용(`val`) 프로퍼티가 될 수 없습니다. 그 값은 `js()` 또는 `jso()`([`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)의 헬퍼 함수)로 객체가 생성된 후에만 할당될 수 있기 때문입니다.

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**해결책**: 외부 인터페이스의 모든 프로퍼티를 `var`로 변환하세요.

```kotlin
// Replace this
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// With this
external interface CustomComponentState : State {
   var name: String
}
```

## 외부 인터페이스의 리시버 함수를 일반 함수로 변환하기

**문제**: 외부 선언은 확장 함수나 해당 함수형 타입을 가진 프로퍼티와 같은 리시버 함수를 포함할 수 없습니다.

**해결책**: 해당 함수와 프로퍼티를 리시버 객체를 인수로 추가하여 일반 함수로 변환하세요.

```kotlin
// Replace this
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() -> Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) -> Unit
}
```

## 상호 운용성을 위해 일반 JS 객체 생성하기

**문제**: 외부 인터페이스를 구현하는 Kotlin 객체의 프로퍼티는 _열거 가능하지 않습니다_. 이는 객체의 프로퍼티를 반복하는 작업(예: )에서 보이지 않는다는 의미입니다.
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

이름으로 여전히 접근 가능하지만: `obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // plain JS object
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin object
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON sees only the backing field, not the property
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**해결책 1**: `js()` 또는 `jso()`([`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)의 헬퍼 함수)를 사용하여 일반 JavaScript 객체를 생성하세요.

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// Replace this
val ktApp = AppPropsImpl("App1") // Kotlin object
```

```kotlin
// With this
val jsApp = js("{name: 'App1'}") as AppProps // or jso {}
```

**해결책 2**: `kotlin.js.json()`을 사용하여 객체를 생성하세요.

```kotlin
// or with this
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 함수 참조의 toString() 호출을 .name으로 대체하기

**문제**: IR 백엔드에서는 함수 참조에 대해 `toString()`을 호출해도 고유한 값이 생성되지 않습니다.

**해결책**: `toString()` 대신 `name` 프로퍼티를 사용하세요.

## 빌드 스크립트에 binaries.executable()을 명시적으로 지정하기

**문제**: 컴파일러가 실행 가능한 `.js` 파일을 생성하지 않습니다.

이는 기본 컴파일러가 기본적으로 JavaScript 실행 파일을 생성하는 반면, IR 컴파일러는 이를 위한 명시적인 지시가 필요하기 때문에 발생할 수 있습니다. [Kotlin/JS 프로젝트 설정 지침](js-project-setup.md#execution-environments)에서 자세히 알아보세요.

**해결책**: 프로젝트의 `build.gradle(.kts)`에 `binaries.executable()` 줄을 추가하세요.

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## Kotlin/JS IR 컴파일러 사용 시 추가 문제 해결 팁

다음 힌트들은 Kotlin/JS IR 컴파일러를 사용하는 프로젝트에서 문제를 해결하는 데 도움이 될 수 있습니다.

### 외부 인터페이스에서 Boolean 프로퍼티를 nullable로 만들기

**문제**: 외부 인터페이스의 `Boolean`에 대해 `toString`을 호출할 때 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')`와 같은 오류가 발생합니다. JavaScript는 boolean 변수의 `null` 또는 `undefined` 값을 `false`로 취급합니다. `null` 또는 `undefined`일 수 있는 `Boolean`에 대해 `toString`을 호출하는 데 의존하는 경우(예: 제어할 수 없는 JavaScript 코드에서 코드가 호출되는 경우), 다음 사항을 염두에 두십시오.

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**해결책**: 외부 인터페이스의 `Boolean` 프로퍼티를 nullable(`Boolean?`)로 만들 수 있습니다.

```kotlin
// Replace this
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// With this
external interface SomeExternal {
    var visible: Boolean?
}